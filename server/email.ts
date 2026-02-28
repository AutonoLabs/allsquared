import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AllSquared <noreply@allsquared.co.uk>';
const APP_URL = process.env.VITE_APP_URL || 'https://allsquared.co.uk';

type EmailResult = { success: boolean; error?: string };

async function send(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!resend) {
    console.warn('[Email] Resend not configured, skipping email:', subject);
    return { success: false, error: 'Email not configured' };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: wrapInLayout(subject, html),
    });
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error: String(error) };
  }
}

function wrapInLayout(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:white;border-radius:8px;padding:32px;border:1px solid #e4e4e7;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#18181b;">AllSquared</h1>
          </div>
          ${content}
          <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
          <p style="font-size:12px;color:#71717a;text-align:center;margin:0;">
            AllSquared - Secure Service Contracts for the UK's Freelance Economy
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function button(text: string, url: string): string {
  return `
    <div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#18181b;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500;font-size:14px;">
        ${text}
      </a>
    </div>
  `;
}

function formatAmount(pence: number | string): string {
  const amount = typeof pence === 'string' ? parseInt(pence, 10) : pence;
  return `£${(amount / 100).toFixed(2)}`;
}

// --- Contract Emails ---

export async function sendContractSentEmail(
  to: string,
  data: { contractTitle: string; senderName: string; contractId: string }
): Promise<EmailResult> {
  return send(to, `Contract awaiting your signature: ${data.contractTitle}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Contract Awaiting Signature</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      <strong>${data.senderName}</strong> has sent you a contract to review and sign:
    </p>
    <div style="background:#f4f4f5;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-weight:600;color:#18181b;">${data.contractTitle}</p>
    </div>
    <p style="color:#3f3f46;line-height:1.6;">
      Please review the contract details and sign if you agree to the terms.
    </p>
    ${button('Review Contract', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

export async function sendContractSignedEmail(
  to: string,
  data: { contractTitle: string; signerName: string; contractId: string; allSigned: boolean }
): Promise<EmailResult> {
  const subject = data.allSigned
    ? `Contract fully executed: ${data.contractTitle}`
    : `${data.signerName} signed: ${data.contractTitle}`;

  const message = data.allSigned
    ? `All parties have signed <strong>"${data.contractTitle}"</strong>. The contract is now active.`
    : `<strong>${data.signerName}</strong> has signed <strong>"${data.contractTitle}"</strong>.`;

  return send(to, subject, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">
      ${data.allSigned ? 'Contract Active' : 'Contract Signed'}
    </h2>
    <p style="color:#3f3f46;line-height:1.6;">${message}</p>
    ${button('View Contract', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

// --- Milestone Emails ---

export async function sendMilestoneSubmittedEmail(
  to: string,
  data: { milestoneTitle: string; contractTitle: string; contractId: string; providerName: string }
): Promise<EmailResult> {
  return send(to, `Milestone submitted for review: ${data.milestoneTitle}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Milestone Submitted</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      <strong>${data.providerName}</strong> has submitted the milestone
      <strong>"${data.milestoneTitle}"</strong> on contract <strong>"${data.contractTitle}"</strong>
      for your review.
    </p>
    ${button('Review Milestone', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

export async function sendMilestoneApprovedEmail(
  to: string,
  data: { milestoneTitle: string; contractTitle: string; contractId: string; amount: number | string }
): Promise<EmailResult> {
  return send(to, `Milestone approved: ${data.milestoneTitle}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Milestone Approved</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      Your milestone <strong>"${data.milestoneTitle}"</strong> on contract
      <strong>"${data.contractTitle}"</strong> has been approved.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin:16px 0;text-align:center;">
      <p style="margin:0;font-size:24px;font-weight:700;color:#16a34a;">
        ${formatAmount(data.amount)}
      </p>
      <p style="margin:4px 0 0;color:#15803d;font-size:14px;">Payment released</p>
    </div>
    ${button('View Details', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

export async function sendMilestoneRejectedEmail(
  to: string,
  data: { milestoneTitle: string; contractTitle: string; contractId: string; reason?: string }
): Promise<EmailResult> {
  return send(to, `Milestone requires revision: ${data.milestoneTitle}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Milestone Revision Needed</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      Your milestone <strong>"${data.milestoneTitle}"</strong> on contract
      <strong>"${data.contractTitle}"</strong> requires revisions.
    </p>
    ${data.reason ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#991b1b;font-size:14px;"><strong>Feedback:</strong> ${data.reason}</p>
      </div>
    ` : ''}
    ${button('View Details', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

// --- Payment Emails ---

export async function sendPaymentReceivedEmail(
  to: string,
  data: { amount: number | string; contractTitle: string; contractId: string }
): Promise<EmailResult> {
  return send(to, `Payment received: ${formatAmount(data.amount)}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Payment Received</h2>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin:16px 0;text-align:center;">
      <p style="margin:0;font-size:24px;font-weight:700;color:#16a34a;">
        ${formatAmount(data.amount)}
      </p>
      <p style="margin:4px 0 0;color:#15803d;font-size:14px;">
        for "${data.contractTitle}"
      </p>
    </div>
    ${button('View Contract', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

// --- Dispute Emails ---

export async function sendDisputeOpenedEmail(
  to: string,
  data: { contractTitle: string; contractId: string; disputeType: string; initiatorName: string }
): Promise<EmailResult> {
  return send(to, `Dispute raised on: ${data.contractTitle}`, `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Dispute Raised</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      <strong>${data.initiatorName}</strong> has raised a <strong>${data.disputeType}</strong>
      dispute on contract <strong>"${data.contractTitle}"</strong>.
    </p>
    <p style="color:#3f3f46;line-height:1.6;">
      Please review the details and respond promptly.
    </p>
    ${button('View Dispute', `${APP_URL}/dashboard/contracts/${data.contractId}`)}
  `);
}

// --- Welcome Email ---

export async function sendWelcomeEmail(
  to: string,
  data: { name: string }
): Promise<EmailResult> {
  return send(to, 'Welcome to AllSquared', `
    <h2 style="font-size:18px;color:#18181b;margin:0 0 12px;">Welcome to AllSquared, ${data.name}!</h2>
    <p style="color:#3f3f46;line-height:1.6;">
      You're all set to start creating secure service contracts with protected payments.
    </p>
    <p style="color:#3f3f46;line-height:1.6;">Here's what you can do:</p>
    <ul style="color:#3f3f46;line-height:1.8;">
      <li><strong>Create a contract</strong> using AI or our templates</li>
      <li><strong>Protect payments</strong> with escrow</li>
      <li><strong>Track milestones</strong> and release funds on approval</li>
    </ul>
    ${button('Go to Dashboard', `${APP_URL}/dashboard`)}
  `);
}
