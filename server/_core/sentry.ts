/**
 * Sentry initialization (server-side).
 * Silently no-ops when SENTRY_DSN is unset so dev/local work without it.
 */
import * as Sentry from "@sentry/node";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  const environment = process.env.NODE_ENV || "development";

  if (!dsn) {
    if (environment === "production") {
      console.warn(
        "[Sentry] SENTRY_DSN is not set in production — server errors will not be reported. " +
          "Set SENTRY_DSN in Vercel to enable error tracking.",
      );
    }
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,
    // PII scrubbing
    sendDefaultPii: false,
    // Filter out noisy health-check transactions
    ignoreTransactions: ["GET /api/health"],
    beforeSend(event) {
      // Strip any potential Authorization headers
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      return event;
    },
  });

  console.log(`[Sentry] Initialized (env=${environment})`);
}

export { Sentry };
