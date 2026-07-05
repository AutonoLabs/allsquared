import { Resend } from "resend";

type LeadPayload = {
  email: string;
  notifiedSum: number;
  likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
};

function isValidPayload(body: unknown): body is LeadPayload {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.email === "string" &&
    candidate.email.includes("@") &&
    typeof candidate.notifiedSum === "number" &&
    typeof candidate.likelyValid === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  if (!isValidPayload(body)) {
    return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[lead] RESEND_API_KEY not set — lead was not emailed:", body);
    return Response.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "checker@allsquared.dev",
    to: process.env.LEAD_NOTIFICATION_EMAIL ?? "eli@autonolabs.ai",
    subject: `New checker lead — ${body.likelyValid}`,
    text: `Email: ${body.email}\nNotified sum: £${(body.notifiedSum / 100).toFixed(2)}\nResult: ${body.likelyValid}`,
  });

  return Response.json({ ok: true });
}
