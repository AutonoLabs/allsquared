import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

type LeadPayload = {
  email: string;
  notifiedSum: number;
  likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
};

// Basic but practical email check — rejects whitespace, missing @/. and absurd lengths.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254; // RFC 5321 practical limit
const MAX_NOTIFIED_SUM_PENCE = 100_000_000_00; // £1,000,000 — anything above is implausible for a subbie

function isValidPayload(body: unknown): body is LeadPayload {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.email === "string" &&
    candidate.email.length <= MAX_EMAIL_LEN &&
    EMAIL_RE.test(candidate.email) &&
    typeof candidate.notifiedSum === "number" &&
    Number.isFinite(candidate.notifiedSum) &&
    candidate.notifiedSum >= 0 &&
    candidate.notifiedSum <= MAX_NOTIFIED_SUM_PENCE &&
    typeof candidate.likelyValid === "string" &&
    ["smash_and_grab_likely", "notices_served_on_time", "needs_human_review"].includes(
      candidate.likelyValid
    )
  );
}

/**
 * Persist the lead as a structured JSON line to stdout BEFORE attempting email.
 * Vercel captures function logs, so the lead is recoverable even if email send
 * fails (unverified domain, rate limit, transient error). This is the source
 * of truth until a durable store is wired in Phase 01.
 */
function persistLeadToLog(payload: LeadPayload): void {
  console.log(
    JSON.stringify({
      event: "checker_lead",
      ts: new Date().toISOString(),
      email: payload.email,
      notifiedSumPence: payload.notifiedSum,
      likelyValid: payload.likelyValid,
    })
  );
}

async function appendLeadJsonl(body: LeadPayload): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const line = JSON.stringify({ ...body, timestamp: new Date().toISOString() }) + "\n";
  await appendFile(path.join(dir, "leads.jsonl"), line, "utf8");
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  // Always persist first — never lose a lead to an email failure.
  persistLeadToLog(body);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[lead] RESEND_API_KEY not set — persisting lead to data/leads.jsonl:", body.email);
    await appendLeadJsonl(body);
    return Response.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "checker@allsquared.dev";
  const toAddress = process.env.LEAD_NOTIFICATION_EMAIL ?? "eli@autonolabs.ai";

  try {
    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject: `New checker lead — ${body.likelyValid}`,
      text: `Email: ${body.email}\nNotified sum: £${(body.notifiedSum / 100).toFixed(2)}\nResult: ${body.likelyValid}`,
    });
  } catch (err) {
    // Email failed (unverified domain, rate limit, transient) — but the lead is
    // already in the logs. Do NOT surface the failure to the user: we don't want
    // to discourage real leads or tip off spammers that the endpoint degrades.
    console.error("[lead] email send failed (lead already persisted to logs):", (err as Error).message);
  }

  await appendLeadJsonl(body);
  return Response.json({ ok: true });
}
