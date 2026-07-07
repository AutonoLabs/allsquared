// ---------------------------------------------------------------------------
// Transpact country restrictions
// ---------------------------------------------------------------------------
// Source: Transpact partner onboarding note (2026-06-28).
//
// Rule: Transpact does NOT work with freelancers whose only payout bank
// account is held in their own name in certain restricted jurisdictions
// (e.g. PK, ZA, CN). A freelancer with a personal-name bank account in
// India (IN), Singapore (SG), Hong Kong (HK), etc. is acceptable.
//
// Reference: https://transpact.com/CountriesWeWorkWith.aspx
//
// This module enforces the rule by `supplierPayoutCountry` — i.e. the
// ISO-3166-alpha-2 country code of the bank where the freelancer receives
// their payout. It is intentionally a pure module with no I/O so it can be
// unit-tested without the full router graph.
// ---------------------------------------------------------------------------

/**
 * Personal-name bank accounts in these countries are NOT supported by
 * Transpact. ISO-3166-alpha-2 codes.
 */
export const RESTRICTED_PAYOUT_COUNTRIES: ReadonlySet<string> = new Set([
  'PK', // Pakistan
  'ZA', // South Africa
  'CN', // China
]);

/**
 * Personal-name bank accounts in these countries are explicitly supported
 * per the partner note. ISO-3166-alpha-2 codes. Kept as documentation;
 * the gating logic uses `RESTRICTED_PAYOUT_COUNTRIES` + a fallback default.
 */
export const ALLOWED_PERSONAL_PAYOUT_COUNTRIES: ReadonlySet<string> = new Set([
  'IN', // India
  'SG', // Singapore
  'HK', // Hong Kong
  'GB', // United Kingdom
  'US', // United States
  'AU', // Australia
  'CA', // Canada
  'NZ', // New Zealand
  'IE', // Ireland
  'AE', // United Arab Emirates
]);

/**
 * Result of the payout-country check.
 *
 * `decision`:
 *   - 'allowed'  — country is on the supported list (or not on the
 *                  restricted list)
 *   - 'blocked'  — country is on the restricted list; produce an error
 *   - 'unknown'  — code was not a valid ISO-3166-alpha-2; produce a
 *                  warning and treat conservatively as blocked
 */
export interface PayoutCountryCheck {
  decision: 'allowed' | 'blocked' | 'unknown';
  reason: string;
}

const ISO_3166_ALPHA2 = /^[A-Z]{2}$/;

/**
 * Decide whether a freelancer may hold an escrow payout in this bank
 * account country. Case-insensitive on the input; we normalise to upper
 * case internally.
 */
export function checkPayoutCountry(
  rawCountryCode: string | null | undefined,
): PayoutCountryCheck {
  const code = (rawCountryCode ?? '').trim().toUpperCase();

  if (!code) {
    return {
      decision: 'unknown',
      reason: 'No payout country supplied. Cannot evaluate Transpact eligibility.',
    };
  }

  if (!ISO_3166_ALPHA2.test(code)) {
    return {
      decision: 'unknown',
      reason: `Invalid ISO-3166-alpha-2 country code: "${code}".`,
    };
  }

  if (RESTRICTED_PAYOUT_COUNTRIES.has(code)) {
    return {
      decision: 'blocked',
      reason:
        `Transpact does not support personal-name bank accounts in ${code} ` +
        'for freelancer payouts. The freelancer must hold a payout bank ' +
        'account in an eligible jurisdiction (e.g. IN, SG, HK, GB, US, AU). ' +
        'See https://transpact.com/CountriesWeWorkWith.aspx',
    };
  }

  return {
    decision: 'allowed',
    reason: `Payout country ${code} is permitted by Transpact.`,
  };
}
