/**
 * Single source of truth for Content Security Policy.
 * Used by both server/_core/index.ts (dynamic responses) and vercel.json (static).
 * Keep these two in sync — the JSON one is duplicated manually in vercel.json.
 */

export const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Note: 'unsafe-inline' is in here because Clerk + Stripe inline-launch iframes
  // and React's styled-jsx-free inline style attributes. Removing it requires
  // nonces — track as P2 follow-up.
  "script-src 'self' 'unsafe-inline' https://js.stripe.com https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev wss://clerk.allsquared.io wss://*.clerk.accounts.dev https://api.stripe.com https://*.stripe.com https://*.transpact.com https://*.docusign.com https://api.openai.com https://api.postcodes.io https://api.company-information.service.gov.uk https://challenges.cloudflare.com",
  "frame-src 'self' https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev https://js.stripe.com https://sign.allsquared.io https://*.docusign.com https://*.signwell.com https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://clerk.allsquared.io https://accounts.allsquared.io https://*.clerk.accounts.dev",
  "frame-ancestors 'self'",
].join("; ");

export const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")';
