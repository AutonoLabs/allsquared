/**
 * Pure webhook signature verification helpers.
 *
 * Extracted from server/_core/index.ts so they can be unit-tested
 * without spinning up Express. Both Stripe and Transpact (and any other
 * HMAC-SHA256-signed provider) use these primitives.
 */
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Constant-time comparison of two hex/base64 digests.
 * Returns false on length mismatch (timingSafeEqual throws otherwise).
 */
export function signaturesMatch(expected: string, actual: string): boolean {
  if (typeof expected !== "string" || typeof actual !== "string") return false;
  if (expected.length !== actual.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  } catch {
    return false;
  }
}

/**
 * Extract a candidate signature from a header that may be:
 *   - a plain hex/base64 string
 *   - a Stripe-style `t=12345,v1=hexdigest` header
 *   - an array (when the same header is sent multiple times)
 */
export function extractProvidedSignature(
  header: string | string[] | undefined,
): string | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;

  const normalized = value.trim();
  if (!normalized) return null;

  // Stripe-style: "t=...,v1=..." → take the v1 value
  if (normalized.includes("=")) {
    const parts = normalized.split(",");
    for (const part of parts) {
      const [k, v] = part.split("=", 2);
      if (k?.trim() === "v1" && v?.trim()) return v.trim();
    }
  }

  return normalized;
}

/**
 * Verify an HMAC-SHA256 signature over a raw body.
 * Tries both hex and base64 encodings (Stripe uses hex, Transpact varies).
 */
export function verifyHmacSignature(
  rawBody: Buffer | string,
  header: string | string[] | undefined,
  secret: string,
): boolean {
  const provided = extractProvidedSignature(header);
  if (!provided) return false;
  if (!secret) return false;

  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, "utf8");

  const hexDigest = createHmac("sha256", secret).update(body).digest("hex");
  if (signaturesMatch(hexDigest, provided)) return true;

  const base64Digest = createHmac("sha256", secret).update(body).digest("base64");
  if (signaturesMatch(base64Digest, provided)) return true;

  return false;
}

/**
 * Verify a Stripe-style signed payload: `t=<timestamp>.<rawBody>`.
 * Rejects timestamps outside a 5-minute tolerance window.
 */
export function verifyStripeSignature(
  rawBody: Buffer | string,
  header: string | string[] | undefined,
  secret: string,
  options: { toleranceSeconds?: number; nowSeconds?: number } = {},
): { valid: boolean; reason?: string } {
  const tolerance = options.toleranceSeconds ?? 5 * 60;
  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);

  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return { valid: false, reason: "missing-header" };

  const parts: Record<string, string> = {};
  for (const piece of value.split(",")) {
    const [k, v] = piece.split("=", 2);
    if (k && v) parts[k.trim()] = v.trim();
  }

  const timestamp = parts["t"];
  const v1 = parts["v1"];

  if (!timestamp || !v1) return { valid: false, reason: "malformed-header" };

  const ts = parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return { valid: false, reason: "invalid-timestamp" };
  if (Math.abs(now - ts) > tolerance) {
    return { valid: false, reason: "timestamp-out-of-tolerance" };
  }

  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, "utf8");
  const signedPayload = `${timestamp}.${body.toString("utf8")}`;
  const expected = createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  if (!signaturesMatch(expected, v1)) {
    return { valid: false, reason: "signature-mismatch" };
  }

  return { valid: true };
}
