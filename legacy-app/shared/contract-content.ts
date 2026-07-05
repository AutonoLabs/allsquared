export type ContractSignature = {
  userId?: string;
  name: string;
  signedAt: string;
};

export type StructuredContractContent = {
  partyA?: { name?: string; email?: string; address?: string };
  partyB?: { name?: string; email?: string; address?: string };
  modules?: unknown[];
  templateId?: string;
  generatedMarkdown?: string;
  body?: string;
  signatures?: ContractSignature[];
  [key: string]: unknown;
};

/** Parse contractContent whether JSON (builder) or plain markdown (template path). */
export function parseContractContent(raw: string | null | undefined): StructuredContractContent {
  if (!raw) return { signatures: [] };

  try {
    const parsed = JSON.parse(raw) as StructuredContractContent;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      if (!parsed.signatures) parsed.signatures = [];
      return parsed;
    }
  } catch {
    // fall through — treat as markdown body
  }

  return { body: raw, signatures: [] };
}

/** Serialize content back; preserves markdown-only contracts as JSON wrapper. */
export function serializeContractContent(content: StructuredContractContent): string {
  return JSON.stringify(content);
}
