import { nanoid } from 'nanoid';

// ---------------------------------------------------------------------------
// Transpact SOAP Client
// ---------------------------------------------------------------------------
// Wraps Transpact's SOAP/XML web service. When TRANSPACT_API_KEY is unset the
// client returns deterministic mock responses so the app works in dev without
// hitting the real API.
// ---------------------------------------------------------------------------

// Config — all overridable via env vars
const TRANSPACT_WSDL_URL =
  process.env.TRANSPACT_WSDL_URL || 'https://www.transpact.com/services/TranspactService?wsdl';
const TRANSPACT_SOAP_URL =
  process.env.TRANSPACT_SOAP_URL || 'https://www.transpact.com/services/TranspactService';
const TRANSPACT_PARTNER_ID = process.env.TRANSPACT_PARTNER_ID || '';
const TRANSPACT_NAMESPACE = 'http://www.transpact.com/api';

function getApiKey(): string | undefined {
  return process.env.TRANSPACT_API_KEY;
}

function isConfigured(): boolean {
  return !!(getApiKey() && TRANSPACT_PARTNER_ID);
}

// ---------------------------------------------------------------------------
// SOAP XML helpers
// ---------------------------------------------------------------------------

function soapEnvelope(operationName: string, bodyXml: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="${TRANSPACT_NAMESPACE}">
  <soap:Header>
    <tns:AuthHeader>
      <tns:ApiKey>${getApiKey()}</tns:ApiKey>
      <tns:PartnerId>${TRANSPACT_PARTNER_ID}</tns:PartnerId>
    </tns:AuthHeader>
  </soap:Header>
  <soap:Body>
    <tns:${operationName}>
      ${bodyXml}
    </tns:${operationName}>
  </soap:Body>
</soap:Envelope>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Extract the text content of a given XML tag (non-greedy, first match). */
function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<(?:[a-zA-Z0-9]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9]+:)?${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

/** Check for a SOAP Fault in the response body. */
function checkSoapFault(xml: string): void {
  const faultString = extractTag(xml, 'faultstring');
  if (faultString) {
    const faultCode = extractTag(xml, 'faultcode') || 'UNKNOWN';
    throw new TranspactError(`Transpact SOAP fault [${faultCode}]: ${faultString}`, faultCode);
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export class TranspactError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'TranspactError';
  }
}

export interface CreateTransactionParams {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  clientEmail: string;
  callbackUrl: string;
  partnerCommissionPence?: number;
  metadata?: Record<string, string>;
}

export interface CreateTransactionResult {
  id: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  depositUrl: string;
  createdAt: string;
}

export interface TransactionDetails {
  id: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseResult {
  id: string;
  status: string;
  releasedAt: string;
}

export interface VoidResult {
  id: string;
  status: string;
  voidedAt: string;
}

// ---------------------------------------------------------------------------
// Raw SOAP transport
// ---------------------------------------------------------------------------

async function soapCall(operation: string, bodyXml: string): Promise<string> {
  const envelope = soapEnvelope(operation, bodyXml);

  console.log(`[transpact] SOAP ${operation} -> ${TRANSPACT_SOAP_URL}`);

  const res = await fetch(TRANSPACT_SOAP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `${TRANSPACT_NAMESPACE}/${operation}`,
    },
    body: envelope,
  });

  const responseXml = await res.text();

  if (!res.ok) {
    checkSoapFault(responseXml);
    throw new TranspactError(
      `Transpact HTTP ${res.status}: ${res.statusText}`,
      `HTTP_${res.status}`,
    );
  }

  checkSoapFault(responseXml);
  return responseXml;
}

// ---------------------------------------------------------------------------
// Mock responses (dev mode)
// ---------------------------------------------------------------------------

function mockCreateTransaction(params: CreateTransactionParams): CreateTransactionResult {
  const mockId = `mock_${nanoid(12)}`;
  console.warn('[transpact] DEV MODE — returning mock CreateTranspact response');
  return {
    id: mockId,
    status: 'created',
    amount: params.amount,
    currency: params.currency || 'GBP',
    reference: params.reference,
    depositUrl: `https://sandbox.transpact.com/deposit/${mockId}`,
    createdAt: new Date().toISOString(),
  };
}

function mockGetTransaction(transpactId: string): TransactionDetails {
  console.warn('[transpact] DEV MODE — returning mock ViewTranspact response');
  return {
    id: transpactId,
    status: 'held',
    amount: 0,
    currency: 'GBP',
    reference: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mockReleaseFunds(transpactId: string): ReleaseResult {
  console.warn('[transpact] DEV MODE — returning mock release response');
  return {
    id: `mock_${nanoid(12)}`,
    status: 'released',
    releasedAt: new Date().toISOString(),
  };
}

function mockVoidTransaction(transpactId: string): VoidResult {
  console.warn('[transpact] DEV MODE — returning mock VoidTranspact response');
  return {
    id: `mock_${nanoid(12)}`,
    status: 'refunded',
    voidedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API — maps to our escrow router interface
// ---------------------------------------------------------------------------

/**
 * CreateTranspact — create a new escrow transaction.
 * Supports an optional partner commission tranche.
 */
export async function createTransaction(
  params: CreateTransactionParams,
): Promise<CreateTransactionResult> {
  if (!isConfigured()) return mockCreateTransaction(params);

  const metadataXml = params.metadata
    ? Object.entries(params.metadata)
        .map(([k, v]) => `<tns:Entry><tns:Key>${escapeXml(k)}</tns:Key><tns:Value>${escapeXml(v)}</tns:Value></tns:Entry>`)
        .join('\n          ')
    : '';

  const bodyXml = `
      <tns:Amount>${params.amount}</tns:Amount>
      <tns:Currency>${escapeXml(params.currency)}</tns:Currency>
      <tns:Reference>${escapeXml(params.reference)}</tns:Reference>
      <tns:Description>${escapeXml(params.description)}</tns:Description>
      <tns:PayerEmail>${escapeXml(params.clientEmail)}</tns:PayerEmail>
      <tns:CallbackUrl>${escapeXml(params.callbackUrl)}</tns:CallbackUrl>${
    params.partnerCommissionPence != null
      ? `\n      <tns:PartnerCommission>${params.partnerCommissionPence}</tns:PartnerCommission>`
      : ''
  }${
    metadataXml
      ? `\n      <tns:Metadata>\n          ${metadataXml}\n      </tns:Metadata>`
      : ''
  }`;

  const xml = await soapCall('CreateTranspact', bodyXml);

  return {
    id: extractTag(xml, 'TranspactId') || '',
    status: extractTag(xml, 'Status') || 'created',
    amount: params.amount,
    currency: params.currency,
    reference: params.reference,
    depositUrl: extractTag(xml, 'DepositUrl') || '',
    createdAt: extractTag(xml, 'CreatedAt') || new Date().toISOString(),
  };
}

/**
 * ViewTranspact — get a single transaction's details.
 */
export async function getTransaction(transpactId: string): Promise<TransactionDetails> {
  if (!isConfigured()) return mockGetTransaction(transpactId);

  const bodyXml = `<tns:TranspactId>${escapeXml(transpactId)}</tns:TranspactId>`;
  const xml = await soapCall('ViewTranspact', bodyXml);

  return {
    id: extractTag(xml, 'TranspactId') || transpactId,
    status: extractTag(xml, 'Status') || 'unknown',
    amount: Number(extractTag(xml, 'Amount')) || 0,
    currency: extractTag(xml, 'Currency') || 'GBP',
    reference: extractTag(xml, 'Reference') || '',
    createdAt: extractTag(xml, 'CreatedAt') || '',
    updatedAt: extractTag(xml, 'UpdatedAt') || '',
  };
}

/**
 * Release funds — Transpact doesn't have a dedicated "Release" SOAP
 * operation in their public docs, so we use CreateTranspact with a
 * release instruction type, or a partner-specific endpoint. This is
 * structured so it can be swapped to a dedicated operation once the WSDL
 * is confirmed.
 */
export async function releaseFunds(
  transpactId: string,
  amount: number,
  recipientAccountId?: string,
  notes?: string,
): Promise<ReleaseResult> {
  if (!isConfigured()) return mockReleaseFunds(transpactId);

  const bodyXml = `
      <tns:TranspactId>${escapeXml(transpactId)}</tns:TranspactId>
      <tns:Amount>${amount}</tns:Amount>${
    recipientAccountId
      ? `\n      <tns:RecipientAccountId>${escapeXml(recipientAccountId)}</tns:RecipientAccountId>`
      : ''
  }${
    notes
      ? `\n      <tns:Notes>${escapeXml(notes)}</tns:Notes>`
      : ''
  }`;

  const xml = await soapCall('ReleaseTranspact', bodyXml);

  return {
    id: extractTag(xml, 'ReleaseId') || extractTag(xml, 'TranspactId') || '',
    status: 'released',
    releasedAt: extractTag(xml, 'ReleasedAt') || new Date().toISOString(),
  };
}

/**
 * VoidTranspact — cancel / refund a transaction.
 */
export async function requestRefund(
  transpactId: string,
  amount: number,
  recipientUserId?: string,
  notes?: string,
): Promise<VoidResult> {
  if (!isConfigured()) return mockVoidTransaction(transpactId);

  const bodyXml = `
      <tns:TranspactId>${escapeXml(transpactId)}</tns:TranspactId>
      <tns:Amount>${amount}</tns:Amount>${
    recipientUserId
      ? `\n      <tns:RecipientUserId>${escapeXml(recipientUserId)}</tns:RecipientUserId>`
      : ''
  }${
    notes
      ? `\n      <tns:Notes>${escapeXml(notes)}</tns:Notes>`
      : ''
  }`;

  const xml = await soapCall('VoidTranspact', bodyXml);

  return {
    id: extractTag(xml, 'VoidId') || extractTag(xml, 'TranspactId') || '',
    status: 'refunded',
    voidedAt: extractTag(xml, 'VoidedAt') || new Date().toISOString(),
  };
}
