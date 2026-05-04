import express, { Request, Response, NextFunction } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { getDb } from "../db";
import { contractTemplates } from "../../drizzle/schema";
import { sql } from "drizzle-orm";
import { processStripeWebhook } from "../routers/payments";
import { processTranspactWebhook } from "../routers/escrow";
import { timingSafeEqual, createHmac } from "crypto";

// Create Express app
const app = express();

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Trust proxy for rate limiting behind reverse proxy (Vercel, etc.)
app.set('trust proxy', 1);

// Security headers (equivalent to helmet.js but inline to avoid additional dependency)
app.use((req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Transport Security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.transpact.com https://*.docusign.com https://api.openai.com https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev https://*.clerk.dev https://api.clerk.com wss:",
      "frame-src 'self' https://js.stripe.com https://*.docusign.com https://*.signwell.com",
      "object-src 'none'",
    ].join('; ')
  );

  // Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")'
  );

  next();
});

// Simple in-memory rate limiting (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

// Rate limiting middleware
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();

  const record = rateLimitStore.get(clientIp);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  } else {
    record.count++;

    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Please slow down. Try again in a minute.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }
  }

  // Add rate limit headers
  const currentRecord = rateLimitStore.get(clientIp)!;
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentRecord.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(currentRecord.resetTime / 1000));

  next();
});

// Clean up rate limit store periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(rateLimitStore.entries())) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Input sanitization for common XSS patterns
// Skip JSON parsing for webhook routes — they need raw body for signature verification
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/webhooks/')) {
    return next();
  }
  express.json({
    limit: "50mb",
    verify: (req: Request, res: Response, buf: Buffer) => {
      const bodyStr = buf.toString();
      const xssPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i,
      ];
      for (const pattern of xssPatterns) {
        if (pattern.test(bodyStr)) {
          throw new Error('Potentially malicious content detected');
        }
      }
    },
  })(req, res, next);
});
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/webhooks/')) {
    return next();
  }
  express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
});

// =============================================================================
// HEALTH ENDPOINT
// =============================================================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    lexai: !!process.env.LEXAI_API_URL,
    companiesHouse: !!process.env.COMPANIES_HOUSE_API_KEY,
  });
});

// =============================================================================
// WEBHOOK ROUTES (must be before tRPC to use raw body)
// =============================================================================

function signaturesMatch(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function extractProvidedSignature(header: string | string[] | undefined): string | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;

  const normalized = value.trim();
  if (!normalized) return null;

  const parts = normalized.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [, candidate] = trimmed.includes('=') ? trimmed.split('=', 2) : [null, trimmed];
    if (candidate?.trim()) {
      return candidate.trim();
    }
  }

  return normalized;
}

function verifyHmacSignature(rawBody: Buffer, header: string | string[] | undefined, secret: string): boolean {
  const providedSignature = extractProvidedSignature(header);
  if (!providedSignature) return false;

  const hexDigest = createHmac('sha256', secret).update(rawBody).digest('hex');
  const base64Digest = createHmac('sha256', secret).update(rawBody).digest('base64');

  return signaturesMatch(hexDigest, providedSignature) || signaturesMatch(base64Digest, providedSignature);
}

// Stripe webhook — verified signature + full event routing
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[Stripe Webhook] Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var');
    res.status(400).json({ error: 'Missing signature or webhook secret' });
    return;
  }

  let event: { id: string; type: string; data: unknown };

  try {
    // Manual HMAC-SHA256 signature verification (avoids Stripe SDK dependency)
    const rawBody = req.body as Buffer;
    const sigHeader = sig as string;

    // Parse Stripe-Signature header: t=timestamp,v1=hash
    const sigParts = sigHeader.split(',').reduce<Record<string, string>>((acc, part) => {
      const [k, v] = part.split('=');
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    }, {});

    const timestamp = sigParts['t'];
    const v1Sig = sigParts['v1'];

    if (!timestamp || !v1Sig) {
      throw new Error('Invalid Stripe-Signature header format');
    }

    // Reject webhooks older than 5 minutes (replay attack protection)
    const tolerance = 5 * 60; // 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > tolerance) {
      throw new Error(`Webhook timestamp too old: ${timestamp}`);
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${rawBody.toString()}`;
    const expectedSig = createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    if (!signaturesMatch(expectedSig, v1Sig)) {
      throw new Error('Stripe signature mismatch');
    }

    event = JSON.parse(rawBody.toString());
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', (error as Error).message);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  try {
    await processStripeWebhook({
      eventType: event.type,
      eventId: event.id,
      data: event.data,
    });

    console.log(`[Stripe Webhook] Processed event: ${event.type} (${event.id})`);
    res.json({ received: true });
  } catch (error) {
    // Return 200 to Stripe even on processing errors to prevent retries for non-transient failures
    console.error(`[Stripe Webhook] Processing failed for ${event.type}:`, error);
    res.json({ received: true, warning: 'Event logged but processing failed' });
  }
});

// Transpact webhook
app.post('/api/webhooks/transpact', express.raw({ type: '*/*' }), async (req: Request, res: Response) => {
  const signature = req.headers['x-transpact-signature'];
  const webhookSecret = process.env.TRANSPACT_WEBHOOK_SECRET;

  try {
    const rawBody = req.body as Buffer;
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !webhookSecret || !verifyHmacSignature(rawBody, signature, webhookSecret)) {
        res.status(400).json({ error: 'Webhook signature verification failed' });
        return;
      }
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const eventType = typeof event.eventType === 'string' ? event.eventType : event.type;
    const eventId = typeof event.eventId === 'string' ? event.eventId : event.id;

    if (!eventType) {
      throw new Error('Missing Transpact event type');
    }

    await processTranspactWebhook({
      eventType,
      eventId: eventId || `transpact_${Date.now()}`,
      data: event.data ?? event,
    });

    res.json({ received: true });
  } catch (error) {
    console.error('Transpact webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// DocuSign webhook
app.post('/api/webhooks/docusign', express.json(), async (req: Request, res: Response) => {
  try {
    const event = req.body;

    res.json({ received: true });
  } catch (error) {
    console.error('DocuSign webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// =============================================================================
// tRPC API
// =============================================================================
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files in production (skip on Vercel — CDN handles static assets)
if (process.env.NODE_ENV !== "development" && !process.env.VERCEL) {
  import("./vite").then(({ serveStatic }) => serveStatic(app));
}

// Start server for standalone deployment (not in Vercel)
// Vercel sets VERCEL=1 in their environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3300;
  app.listen(PORT, () => {
    console.log(`[Server] AllSquared running on http://localhost:${PORT}`);
  });
}

// Auto-seed contract templates if table is empty
(async () => {
  try {
    const db = await getDb();
    if (!db) return;
    const rows = await db.select({ count: sql<number>`count(*)` }).from(contractTemplates);
    const templateCount = Number(rows[0]?.count ?? 0);
    if (templateCount === 0) {
      console.log('[Server] No templates found — auto-seeding...');
      const { seedTemplates } = await import('../seed-templates');
      await seedTemplates(db);
    }
  } catch (err) {
    console.warn('[Server] Auto-seed skipped:', (err as Error).message);
  }
})();

// Export for Vercel serverless
export default app;
