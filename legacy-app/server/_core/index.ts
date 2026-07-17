import express, { Request, Response, NextFunction } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { getDb } from "../db";
import { contractTemplates } from "../../drizzle/schema";
import { sql } from "drizzle-orm";
import { processStripeWebhook } from "../routers/payments";
import { processTranspactWebhook } from "../routers/escrow";
import { processDocuSignWebhook } from "../routers/signatures";
import { timingSafeEqual, createHmac } from "crypto";
import { verifyStripeSignature } from "./webhookVerify";
import { initSentry, Sentry } from "./sentry";
import { checkRateLimit, isDistributedRateLimitEnabled } from "./rateLimit";
import { CSP_DIRECTIVES, PERMISSIONS_POLICY } from "./csp";
import { isAllowedPrelaunchTrpcPath } from "../../shared/prelaunch";

// Initialize Sentry before anything else
initSentry();

// Create Express app
const app = express();

// Sentry request handler must be the FIRST middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// During prelaunch, the public app exposes only the waitlist mutation. This blocks
// product APIs for unauthenticated callers and for users with existing sessions.
app.use('/api/trpc', (req: Request, res: Response, next: NextFunction) => {
  if (!isAllowedPrelaunchTrpcPath(req.path)) {
    res.status(403).json({
      error: 'PRELAUNCH_WAITLIST_ONLY',
      message: 'AllSquared is currently available by waitlist only.',
    });
    return;
  }
  next();
});

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
  res.setHeader('Content-Security-Policy', CSP_DIRECTIVES);

  // Permissions Policy
  res.setHeader('Permissions-Policy', PERMISSIONS_POLICY);

  next();
});

// Rate limiting middleware
// Uses Upstash Redis when configured (Vercel serverless), falls back to
// process-local Map for dev.
app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';

  try {
    const { success, limit, remaining, reset } = await checkRateLimit(clientIp);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(reset / 1000));

    if (!success) {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Please slow down. Try again in a minute.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });
      return;
    }
  } catch (err) {
    // Rate limit failures should not break the request
    console.warn('[Server] Rate limit check failed:', (err as Error).message);
  }

  next();
});

if (!isDistributedRateLimitEnabled()) {
  console.warn(
    '[Server] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory rate limit. ' +
      'This is unsafe on Vercel serverless. Configure Upstash for production.',
  );
}

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
  if (process.env.NODE_ENV === 'production') {
    res.json({ ok: true });
    return;
  }
  res.json({
    ok: true,
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
    const verification = verifyStripeSignature(rawBody, sig as string, webhookSecret);
    if (!verification.valid) {
      throw new Error(verification.reason ?? 'Stripe signature verification failed');
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
    if (!webhookSecret || !signature || !verifyHmacSignature(rawBody, signature, webhookSecret)) {
      res.status(400).json({ error: 'Webhook signature verification failed' });
      return;
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
    const webhookSecret = process.env.DOCUSIGN_WEBHOOK_SECRET;
    const signature = req.headers['x-docusign-signature-1'] ?? req.headers['x-authorization-docusign'];

    if (webhookSecret) {
      const rawBody = Buffer.from(JSON.stringify(req.body));
      if (!signature || !verifyHmacSignature(rawBody, signature, webhookSecret)) {
        res.status(400).json({ error: 'Webhook signature verification failed' });
        return;
      }
    } else if (process.env.NODE_ENV === 'production') {
      res.status(503).json({ error: 'DocuSign webhook secret not configured' });
      return;
    }

    const event = req.body as { event?: string; eventType?: string; data?: unknown };
    await processDocuSignWebhook({
      event: event.event || event.eventType || 'unknown',
      data: event.data ?? event,
    });

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
      const { seedAllTemplates } = await import('../seed-templates');
      await seedAllTemplates(db);
    }
  } catch (err) {
    console.warn('[Server] Auto-seed skipped:', (err as Error).message);
  }
})();

// Sentry error handler must be registered AFTER all routes and BEFORE any other error handler
app.use(Sentry.Handlers.errorHandler());

// Optional: tail off remaining errors to Sentry
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err);
  Sentry.captureException(err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel serverless
export default app;
