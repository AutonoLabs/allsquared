import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import {
  signaturesMatch,
  extractProvidedSignature,
  verifyHmacSignature,
  verifyStripeSignature,
} from "./webhookVerify";

describe("signaturesMatch", () => {
  it("returns true for identical hex digests", () => {
    const digest = createHmac("sha256", "k").update("x").digest("hex");
    expect(signaturesMatch(digest, digest)).toBe(true);
  });

  it("returns false for different digests of the same length", () => {
    const a = "a".repeat(64);
    const b = "b".repeat(64);
    expect(signaturesMatch(a, b)).toBe(false);
  });

  it("returns false for different-length digests (without throwing)", () => {
    expect(signaturesMatch("a".repeat(32), "b".repeat(64))).toBe(false);
  });

  it("returns false on non-string inputs", () => {
    expect(signaturesMatch(undefined as any, "x")).toBe(false);
    expect(signaturesMatch("x", null as any)).toBe(false);
  });
});

describe("extractProvidedSignature", () => {
  it("returns plain value for simple header", () => {
    expect(extractProvidedSignature("abcdef0123456789")).toBe("abcdef0123456789");
  });

  it("parses Stripe-style v1 from comma-separated header", () => {
    const sig = "t=1700000000,v1=abc123,v0=deadbeef";
    expect(extractProvidedSignature(sig)).toBe("abc123");
  });

  it("takes the first value when no v1 key is present", () => {
    expect(extractProvidedSignature("xyz,abc")).toBe("xyz");
  });

  it("returns null for missing/empty headers", () => {
    expect(extractProvidedSignature(undefined)).toBeNull();
    expect(extractProvidedSignature("")).toBeNull();
    expect(extractProvidedSignature("   ")).toBeNull();
  });

  it("handles array headers (multi-value)", () => {
    expect(extractProvidedSignature(["first", "second"])).toBe("first");
  });
});

describe("verifyHmacSignature", () => {
  const secret = "whsec_test_super_secret";
  const body = Buffer.from('{"type":"charge.succeeded"}', "utf8");

  it("verifies a valid hex signature", () => {
    const sig = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyHmacSignature(body, sig, secret)).toBe(true);
  });

  it("verifies a valid base64 signature", () => {
    const sig = createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyHmacSignature(body, sig, secret)).toBe(true);
  });

  it("rejects a signature with the wrong secret", () => {
    const sig = createHmac("sha256", "wrong-secret").update(body).digest("hex");
    expect(verifyHmacSignature(body, sig, secret)).toBe(false);
  });

  it("rejects a tampered body", () => {
    const sig = createHmac("sha256", secret).update(body).digest("hex");
    const tampered = Buffer.from('{"type":"different"}', "utf8");
    expect(verifyHmacSignature(tampered, sig, secret)).toBe(false);
  });

  it("rejects when header is missing", () => {
    expect(verifyHmacSignature(body, undefined, secret)).toBe(false);
  });

  it("rejects when secret is empty", () => {
    const sig = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyHmacSignature(body, sig, "")).toBe(false);
  });

  it("accepts a Stripe-style header (extracts v1)", () => {
    const sig = createHmac("sha256", secret).update(body).digest("hex");
    const header = `t=1700000000,v1=${sig}`;
    expect(verifyHmacSignature(body, header, secret)).toBe(true);
  });

  it("accepts a string body (not just Buffer)", () => {
    const stringBody = '{"type":"charge.succeeded"}';
    const sig = createHmac("sha256", secret).update(stringBody).digest("hex");
    expect(verifyHmacSignature(stringBody, sig, secret)).toBe(true);
  });
});

describe("verifyStripeSignature", () => {
  const secret = "whsec_stripe_test";
  const body = Buffer.from('{"id":"evt_1","type":"charge.succeeded"}', "utf8");
  const now = 1_700_000_000;
  const buildHeader = (timestamp: number, sig: string) => `t=${timestamp},v1=${sig}`;

  it("verifies a valid signature within tolerance", () => {
    const ts = now - 60; // 1 min old
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", secret).update(signedPayload).digest("hex");
    const result = verifyStripeSignature(body, buildHeader(ts, sig), secret, { nowSeconds: now });
    expect(result.valid).toBe(true);
  });

  it("rejects signatures older than tolerance window (replay protection)", () => {
    const ts = now - 10 * 60; // 10 min old
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", secret).update(signedPayload).digest("hex");
    const result = verifyStripeSignature(body, buildHeader(ts, sig), secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("timestamp-out-of-tolerance");
  });

  it("rejects signatures from the future (clock skew attack)", () => {
    const ts = now + 10 * 60; // 10 min in the future
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", secret).update(signedPayload).digest("hex");
    const result = verifyStripeSignature(body, buildHeader(ts, sig), secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
  });

  it("rejects when body is tampered with", () => {
    const ts = now;
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", secret).update(signedPayload).digest("hex");
    const tampered = Buffer.from('{"id":"evt_evil","type":"charge.succeeded"}', "utf8");
    const result = verifyStripeSignature(tampered, buildHeader(ts, sig), secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("signature-mismatch");
  });

  it("rejects when secret is wrong", () => {
    const ts = now;
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", "wrong-secret").update(signedPayload).digest("hex");
    const result = verifyStripeSignature(body, buildHeader(ts, sig), secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("signature-mismatch");
  });

  it("rejects a malformed header (missing v1)", () => {
    const result = verifyStripeSignature(body, "t=1700000000", secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("malformed-header");
  });

  it("rejects an empty header", () => {
    const result = verifyStripeSignature(body, undefined, secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("missing-header");
  });

  it("rejects a non-numeric timestamp", () => {
    const result = verifyStripeSignature(body, "t=notanumber,v1=abc", secret, { nowSeconds: now });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("invalid-timestamp");
  });

  it("respects a custom tolerance", () => {
    const ts = now - 60; // 1 min old
    const signedPayload = `${ts}.${body.toString("utf8")}`;
    const sig = createHmac("sha256", secret).update(signedPayload).digest("hex");
    const result = verifyStripeSignature(body, buildHeader(ts, sig), secret, {
      nowSeconds: now,
      toleranceSeconds: 30, // strict 30s window
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("timestamp-out-of-tolerance");
  });
});
