import express, { Request, Response, NextFunction } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./vite";

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.transpact.com https://*.docusign.com https://api.openai.com wss:",
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
app.use(express.json({
  limit: "50mb",
  verify: (req: Request, res: Response, buf: Buffer) => {
    // Basic XSS pattern detection in JSON body
    const bodyStr = buf.toString();
    const xssPatterns = [
      /<script\b[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick=, onerror=, etc.
      /data:text\/html/i,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(bodyStr)) {
        throw new Error('Potentially malicious content detected');
      }
    }
  },
}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// =============================================================================
// WEBHOOK ROUTES (must be before tRPC to use raw body)
// =============================================================================

// Stripe webhook
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).json({ error: 'Missing signature or webhook secret' });
    return;
  }

  try {
    // In production, use Stripe's constructEvent to verify signature
    // For now, parse the body directly
    const event = JSON.parse(req.body.toString());

    // TODO: In production, call the webhook handler directly via tRPC caller
    console.log('Stripe webhook received:', event.type);

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Transpact webhook
app.post('/api/webhooks/transpact', express.json(), async (req: Request, res: Response) => {
  const signature = req.headers['x-transpact-signature'];

  try {
    // Verify signature in production
    const event = req.body;

    console.log('Transpact webhook received:', event.event);

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

    console.log('DocuSign webhook received:', event.event);

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

// Serve static files in production
if (process.env.NODE_ENV !== "development") {
  serveStatic(app);
}

// Start server for standalone deployment (not in Vercel)
// Vercel sets VERCEL=1 in their environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3300;
  app.listen(PORT, () => {
    console.log(`[Server] AllSquared running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;

