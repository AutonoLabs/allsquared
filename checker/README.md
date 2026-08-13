# AllSquared Checker (Phase 00 validation tool)

Free notice-validity checker + SEO guide pages, built per
`allsquared-plans/for-repo/ROADMAP.md` Phase 00. Not the Phase 02+ product — no rules
engine, no bank-holiday calendar, no auth, no database. Uses calendar-day math and a
persistent disclaimer (see `components/DisclaimerBanner.tsx`).

## Develop

```bash
cd checker
pnpm install
pnpm dev
```

## Deploy

This is a separate Vercel project from the main `allsquared` project (which serves the
frozen `legacy-app/`). Create a new Vercel project rooted at `checker/` and deploy to its
default `*.vercel.app` URL — do not attach a custom domain until the domain/brand
decision in `allsquared-plans/for-repo/STATE.md` is resolved.

```bash
cd checker
vercel link   # first time only — creates a NEW project, do not link to "allsquared"
vercel deploy --prod
```

### Prerequisites for lead emails

Lead emails are sent via Resend (see `app/api/lead/route.ts`). Before deploying:

- Set `RESEND_API_KEY` as an environment variable in the Vercel project.
- Verify the sending domain in the [Resend dashboard](https://resend.com/domains).
  The `from` address defaults to `checker@allsquared.dev` and can be overridden
  with `RESEND_FROM_EMAIL`. Set `LEAD_NOTIFICATION_EMAIL` to control where
  leads are sent (defaults to `eli@autonolabs.ai`).

**Lead persistence:** every lead is written to the function log as a structured
JSON line *before* email is attempted, so a lead is never lost to an email
failure (unverified domain, rate limit, transient error). Recover leads from
Vercel function logs until a durable store is wired in Phase 01.
