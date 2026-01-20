import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { db, createNotification, getContract, updateContract } from '../db';
import { signatures, contracts, webhookEvents, auditLogs } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * E-Signature Integration
 *
 * Supports:
 * - DocuSign (enterprise)
 * - SignWell (cost-effective alternative)
 * - Internal signatures (basic, for MVP)
 *
 * DocuSign is recommended for production due to:
 * - Legal recognition worldwide
 * - Audit trail and tamper-evident seal
 * - eIDAS compliance (EU)
 * - ESIGN Act compliance (US)
 */

// Provider configuration
const DOCUSIGN_API_URL = process.env.DOCUSIGN_API_URL || 'https://demo.docusign.net/restapi/v2.1';
const SIGNWELL_API_URL = 'https://www.signwell.com/api/v1';

// Get active signature provider
function getActiveProvider(): 'docusign' | 'signwell' | 'internal' {
  if (process.env.DOCUSIGN_INTEGRATION_KEY && process.env.DOCUSIGN_ACCOUNT_ID) {
    return 'docusign';
  }
  if (process.env.SIGNWELL_API_KEY) {
    return 'signwell';
  }
  return 'internal';
}

// DocuSign API helper
async function docusignRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: any
) {
  const accessToken = process.env.DOCUSIGN_ACCESS_TOKEN;
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    throw new Error('DocuSign is not configured');
  }

  const response = await fetch(`${DOCUSIGN_API_URL}/accounts/${accountId}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('DocuSign API error:', data);
    throw new Error(data.message || 'DocuSign API error');
  }

  return data;
}

// SignWell API helper
async function signwellRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: any
) {
  const apiKey = process.env.SIGNWELL_API_KEY;

  if (!apiKey) {
    throw new Error('SignWell is not configured');
  }

  const response = await fetch(`${SIGNWELL_API_URL}${endpoint}`, {
    method,
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('SignWell API error:', data);
    throw new Error(data.message || 'SignWell API error');
  }

  return data;
}

// Generate PDF from contract content (simplified)
function generateContractPDF(contract: any): string {
  // In production, use a proper PDF generation library like pdf-lib or puppeteer
  // For now, return base64 encoded HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${contract.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
        h1 { color: #333; }
        .signature-block { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
        .signature-line { border-bottom: 1px solid #000; width: 300px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <h1>${contract.title}</h1>
      <p><strong>Contract Reference:</strong> ${contract.id}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
      <hr />
      <div class="content">
        ${typeof contract.contractContent === 'string'
          ? contract.contractContent.replace(/\n/g, '<br>')
          : JSON.stringify(contract.contractContent)}
      </div>
      <div class="signature-block">
        <h3>Signatures</h3>
        <div>
          <p><strong>Client:</strong></p>
          <div class="signature-line"></div>
          <p>Name: _________________ Date: _________________</p>
        </div>
        <div>
          <p><strong>Service Provider:</strong></p>
          <div class="signature-line"></div>
          <p>Name: _________________ Date: _________________</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return Buffer.from(htmlContent).toString('base64');
}

export const signaturesRouter = router({
  // Get signature provider info
  getProviderInfo: protectedProcedure.query(() => {
    const provider = getActiveProvider();

    return {
      provider,
      features: {
        docusign: {
          name: 'DocuSign',
          description: 'Enterprise e-signature solution',
          legalValidity: 'Globally recognized, eIDAS & ESIGN compliant',
          auditTrail: true,
          mobileApp: true,
        },
        signwell: {
          name: 'SignWell',
          description: 'Cost-effective e-signature solution',
          legalValidity: 'ESIGN & UETA compliant',
          auditTrail: true,
          mobileApp: false,
        },
        internal: {
          name: 'AllSquared Internal',
          description: 'Basic e-signature with IP logging',
          legalValidity: 'Valid under UK law for most contracts',
          auditTrail: true,
          mobileApp: false,
        },
      },
    };
  }),

  // Create signature request for a contract
  createSignatureRequest: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        signers: z.array(
          z.object({
            userId: z.string(),
            email: z.string().email(),
            name: z.string(),
            role: z.enum(['client', 'provider']),
          })
        ),
        message: z.string().optional(),
        expiresInDays: z.number().min(1).max(90).default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify contract exists and user has access
      const contract = await getContract(input.contractId);

      if (!contract) {
        throw new Error('Contract not found');
      }

      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      if (contract.status !== 'draft' && contract.status !== 'pending_signature') {
        throw new Error('Contract is not in a signable state');
      }

      const provider = getActiveProvider();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);

      const signatureRecords = [];

      if (provider === 'docusign') {
        // Create DocuSign envelope
        const pdfBase64 = generateContractPDF(contract);

        const envelope = await docusignRequest('/envelopes', 'POST', {
          emailSubject: `Please sign: ${contract.title}`,
          emailBlurb: input.message || 'Please review and sign this contract.',
          documents: [
            {
              documentBase64: pdfBase64,
              name: `${contract.title}.html`,
              fileExtension: 'html',
              documentId: '1',
            },
          ],
          recipients: {
            signers: input.signers.map((signer, index) => ({
              email: signer.email,
              name: signer.name,
              recipientId: String(index + 1),
              routingOrder: String(index + 1),
              tabs: {
                signHereTabs: [
                  {
                    documentId: '1',
                    pageNumber: '1',
                    xPosition: '100',
                    yPosition: signer.role === 'client' ? '500' : '600',
                  },
                ],
                dateSignedTabs: [
                  {
                    documentId: '1',
                    pageNumber: '1',
                    xPosition: '350',
                    yPosition: signer.role === 'client' ? '500' : '600',
                  },
                ],
              },
            })),
          },
          status: 'sent',
        });

        // Create signature records
        for (const signer of input.signers) {
          const sigId = `sig_${nanoid(16)}`;
          signatureRecords.push({
            id: sigId,
            contractId: input.contractId,
            userId: signer.userId,
            provider: 'docusign' as const,
            providerEnvelopeId: envelope.envelopeId,
            status: 'sent' as const,
            signatureName: signer.name,
            expiresAt,
            sentAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (provider === 'signwell') {
        // Create SignWell document
        const pdfBase64 = generateContractPDF(contract);

        const document = await signwellRequest('/documents', 'POST', {
          name: contract.title,
          files: [
            {
              name: `${contract.title}.html`,
              file_base64: pdfBase64,
            },
          ],
          recipients: input.signers.map((signer) => ({
            email: signer.email,
            name: signer.name,
            id: signer.userId,
          })),
          subject: `Please sign: ${contract.title}`,
          message: input.message || 'Please review and sign this contract.',
          expires_in: input.expiresInDays,
          test_mode: process.env.NODE_ENV !== 'production',
        });

        // Send for signing
        await signwellRequest(`/documents/${document.id}/send`, 'POST');

        // Create signature records
        for (const signer of input.signers) {
          const sigId = `sig_${nanoid(16)}`;
          signatureRecords.push({
            id: sigId,
            contractId: input.contractId,
            userId: signer.userId,
            provider: 'signwell' as const,
            providerEnvelopeId: document.id,
            status: 'sent' as const,
            signatureName: signer.name,
            expiresAt,
            sentAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        // Internal signatures
        for (const signer of input.signers) {
          const sigId = `sig_${nanoid(16)}`;
          signatureRecords.push({
            id: sigId,
            contractId: input.contractId,
            userId: signer.userId,
            provider: 'internal' as const,
            status: 'pending' as const,
            signatureName: signer.name,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Insert signature records
      for (const record of signatureRecords) {
        await db.insert(signatures).values(record);
      }

      // Update contract status
      await updateContract(input.contractId, {
        status: 'pending_signature',
        updatedAt: new Date(),
      });

      // Send notifications
      for (const signer of input.signers) {
        if (signer.userId !== ctx.user.id) {
          await createNotification({
            id: `notif_${nanoid(16)}`,
            userId: signer.userId,
            type: 'contract',
            title: 'Signature Requested',
            message: `You have been asked to sign "${contract.title}". Please review and sign by ${expiresAt.toLocaleDateString('en-GB')}.`,
            relatedId: input.contractId,
            isRead: 'no',
            createdAt: new Date(),
          });
        }
      }

      // Audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'signature_request_created',
        entityType: 'signature',
        entityId: input.contractId,
        newValue: JSON.stringify({
          provider,
          signers: input.signers.map((s) => ({ userId: s.userId, role: s.role })),
        }),
        createdAt: new Date(),
      });

      return {
        success: true,
        provider,
        signatureIds: signatureRecords.map((r) => r.id),
        expiresAt,
      };
    }),

  // Get signature status for a contract
  getContractSignatures: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify access
      const contract = await getContract(input.contractId);

      if (!contract) {
        throw new Error('Contract not found');
      }

      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      const sigs = await db
        .select()
        .from(signatures)
        .where(eq(signatures.contractId, input.contractId));

      const allSigned = sigs.length > 0 && sigs.every((s) => s.status === 'signed');
      const anyDeclined = sigs.some((s) => s.status === 'declined');
      const anyExpired = sigs.some((s) => s.status === 'expired');

      return {
        signatures: sigs,
        allSigned,
        anyDeclined,
        anyExpired,
        pendingCount: sigs.filter((s) => s.status === 'pending' || s.status === 'sent').length,
        signedCount: sigs.filter((s) => s.status === 'signed').length,
      };
    }),

  // Sign contract (internal provider)
  signContract: protectedProcedure
    .input(
      z.object({
        signatureId: z.string(),
        signatureName: z.string(),
        signatureData: z.string().optional(), // Base64 signature image
        agreedToTerms: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.agreedToTerms) {
        throw new Error('You must agree to the terms to sign');
      }

      // Get signature record
      const sig = await db
        .select()
        .from(signatures)
        .where(eq(signatures.id, input.signatureId))
        .limit(1);

      if (!sig[0]) {
        throw new Error('Signature record not found');
      }

      if (sig[0].userId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      if (sig[0].status === 'signed') {
        throw new Error('Already signed');
      }

      if (sig[0].status === 'expired') {
        throw new Error('Signature request has expired');
      }

      // Check expiration
      if (sig[0].expiresAt && new Date(sig[0].expiresAt) < new Date()) {
        await db
          .update(signatures)
          .set({ status: 'expired', updatedAt: new Date() })
          .where(eq(signatures.id, input.signatureId));
        throw new Error('Signature request has expired');
      }

      // Update signature record
      await db
        .update(signatures)
        .set({
          status: 'signed',
          signatureName: input.signatureName,
          signatureImage: input.signatureData,
          signedAt: new Date(),
          ipAddress: ctx.req.headers['x-forwarded-for']?.toString() || ctx.req.socket?.remoteAddress,
          userAgent: ctx.req.headers['user-agent'],
          updatedAt: new Date(),
        })
        .where(eq(signatures.id, input.signatureId));

      // Check if all signatures are complete
      const allSigs = await db
        .select()
        .from(signatures)
        .where(eq(signatures.contractId, sig[0].contractId));

      const allSigned = allSigs.every(
        (s) => s.id === input.signatureId || s.status === 'signed'
      );

      if (allSigned) {
        // Update contract to active
        await updateContract(sig[0].contractId, {
          status: 'active',
          updatedAt: new Date(),
        });

        // Get contract for notifications
        const contract = await getContract(sig[0].contractId);

        if (contract) {
          // Notify all parties
          const parties = [contract.clientId, contract.providerId].filter(Boolean);
          for (const userId of parties) {
            if (userId) {
              await createNotification({
                id: `notif_${nanoid(16)}`,
                userId,
                type: 'contract',
                title: 'Contract Fully Executed',
                message: `"${contract.title}" has been signed by all parties and is now active.`,
                relatedId: sig[0].contractId,
                isRead: 'no',
                createdAt: new Date(),
              });
            }
          }
        }
      }

      // Audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'contract_signed',
        entityType: 'signature',
        entityId: input.signatureId,
        newValue: JSON.stringify({
          contractId: sig[0].contractId,
          signatureName: input.signatureName,
          allPartiesSigned: allSigned,
        }),
        ipAddress: ctx.req.headers['x-forwarded-for']?.toString(),
        userAgent: ctx.req.headers['user-agent'],
        createdAt: new Date(),
      });

      return {
        success: true,
        allPartiesSigned: allSigned,
        contractActive: allSigned,
      };
    }),

  // Decline to sign
  declineSignature: protectedProcedure
    .input(
      z.object({
        signatureId: z.string(),
        reason: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sig = await db
        .select()
        .from(signatures)
        .where(eq(signatures.id, input.signatureId))
        .limit(1);

      if (!sig[0]) {
        throw new Error('Signature record not found');
      }

      if (sig[0].userId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      // Update signature status
      await db
        .update(signatures)
        .set({
          status: 'declined',
          updatedAt: new Date(),
        })
        .where(eq(signatures.id, input.signatureId));

      // Get contract and notify other party
      const contract = await getContract(sig[0].contractId);

      if (contract) {
        const otherPartyId =
          contract.clientId === ctx.user.id ? contract.providerId : contract.clientId;

        if (otherPartyId) {
          await createNotification({
            id: `notif_${nanoid(16)}`,
            userId: otherPartyId,
            type: 'contract',
            title: 'Signature Declined',
            message: `A party has declined to sign "${contract.title}". Reason: ${input.reason.substring(0, 100)}...`,
            relatedId: sig[0].contractId,
            isRead: 'no',
            createdAt: new Date(),
          });
        }
      }

      // Audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'signature_declined',
        entityType: 'signature',
        entityId: input.signatureId,
        newValue: JSON.stringify({ reason: input.reason }),
        createdAt: new Date(),
      });

      return { success: true };
    }),

  // Resend signature request
  resendRequest: protectedProcedure
    .input(
      z.object({
        signatureId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sig = await db
        .select()
        .from(signatures)
        .where(eq(signatures.id, input.signatureId))
        .limit(1);

      if (!sig[0]) {
        throw new Error('Signature record not found');
      }

      // Verify user initiated the contract
      const contract = await getContract(sig[0].contractId);

      if (!contract || contract.clientId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      if (sig[0].status === 'signed') {
        throw new Error('Already signed');
      }

      // Extend expiration
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 14);

      await db
        .update(signatures)
        .set({
          status: sig[0].status === 'expired' ? 'pending' : sig[0].status,
          expiresAt: newExpiry,
          updatedAt: new Date(),
        })
        .where(eq(signatures.id, input.signatureId));

      // Notify signer
      await createNotification({
        id: `notif_${nanoid(16)}`,
        userId: sig[0].userId,
        type: 'contract',
        title: 'Signature Reminder',
        message: `Reminder: Please sign "${contract.title}". The request will expire on ${newExpiry.toLocaleDateString('en-GB')}.`,
        relatedId: sig[0].contractId,
        isRead: 'no',
        createdAt: new Date(),
      });

      return {
        success: true,
        newExpiresAt: newExpiry,
      };
    }),

  // Handle DocuSign webhook
  handleDocuSignWebhook: publicProcedure
    .input(
      z.object({
        event: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const webhookId = `webhook_${nanoid(16)}`;

      await db.insert(webhookEvents).values({
        id: webhookId,
        provider: 'docusign',
        eventType: input.event,
        payload: JSON.stringify(input.data),
        status: 'processing',
        createdAt: new Date(),
      });

      try {
        const envelopeId = input.data.envelopeId;

        switch (input.event) {
          case 'envelope-completed': {
            // All parties have signed
            await db
              .update(signatures)
              .set({
                status: 'signed',
                signedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(signatures.providerEnvelopeId, envelopeId));

            // Update contract
            const sig = await db
              .select()
              .from(signatures)
              .where(eq(signatures.providerEnvelopeId, envelopeId))
              .limit(1);

            if (sig[0]) {
              await updateContract(sig[0].contractId, {
                status: 'active',
                updatedAt: new Date(),
              });
            }
            break;
          }

          case 'recipient-completed': {
            // Individual signer completed
            const recipientEmail = input.data.recipientEmail;
            await db
              .update(signatures)
              .set({
                status: 'signed',
                signedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(signatures.providerEnvelopeId, envelopeId),
                  eq(signatures.signatureName, input.data.recipientName || '')
                )
              );
            break;
          }

          case 'recipient-declined': {
            await db
              .update(signatures)
              .set({
                status: 'declined',
                updatedAt: new Date(),
              })
              .where(eq(signatures.providerEnvelopeId, envelopeId));
            break;
          }

          case 'envelope-voided':
          case 'envelope-declined': {
            await db
              .update(signatures)
              .set({
                status: 'declined',
                updatedAt: new Date(),
              })
              .where(eq(signatures.providerEnvelopeId, envelopeId));
            break;
          }
        }

        await db
          .update(webhookEvents)
          .set({
            status: 'processed',
            processedAt: new Date(),
          })
          .where(eq(webhookEvents.id, webhookId));

        return { success: true };
      } catch (error) {
        await db
          .update(webhookEvents)
          .set({
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          .where(eq(webhookEvents.id, webhookId));

        throw error;
      }
    }),

  // Get signing URL for external providers
  getSigningUrl: protectedProcedure
    .input(
      z.object({
        signatureId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sig = await db
        .select()
        .from(signatures)
        .where(eq(signatures.id, input.signatureId))
        .limit(1);

      if (!sig[0]) {
        throw new Error('Signature record not found');
      }

      if (sig[0].userId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      if (sig[0].provider === 'internal') {
        // Internal signatures are handled in-app
        return {
          provider: 'internal',
          url: null,
          signInApp: true,
        };
      }

      if (sig[0].provider === 'docusign' && sig[0].providerEnvelopeId) {
        // Get DocuSign recipient view URL
        const view = await docusignRequest(
          `/envelopes/${sig[0].providerEnvelopeId}/views/recipient`,
          'POST',
          {
            authenticationMethod: 'email',
            email: ctx.user.email,
            userName: ctx.user.name || ctx.user.email,
            returnUrl: `${process.env.APP_URL}/contracts/${sig[0].contractId}?signed=true`,
          }
        );

        return {
          provider: 'docusign',
          url: view.url,
          signInApp: false,
        };
      }

      if (sig[0].provider === 'signwell' && sig[0].providerEnvelopeId) {
        // Get SignWell signing URL
        const document = await signwellRequest(
          `/documents/${sig[0].providerEnvelopeId}`,
          'GET'
        );

        const recipient = document.recipients?.find(
          (r: any) => r.id === ctx.user.id || r.email === ctx.user.email
        );

        return {
          provider: 'signwell',
          url: recipient?.embedded_signing_url || null,
          signInApp: false,
        };
      }

      return {
        provider: sig[0].provider,
        url: null,
        signInApp: true,
      };
    }),
});
