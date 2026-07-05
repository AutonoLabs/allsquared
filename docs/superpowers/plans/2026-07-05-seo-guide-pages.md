# SEO Guide Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the SEO landing pages named in `allsquared-plans/for-repo/ROADMAP.md`
Phase 05 ("no pay less notice", "main contractor not paying subcontractor", "smash and
grab adjudication cost", "payment notice deadline calculator"), driving organic search
traffic into the `/checker` questionnaire.

**Architecture:** A single typed content array (`lib/guides.ts`) plus one dynamic route
(`app/guides/[slug]/page.tsx`) using `generateStaticParams` and `generateMetadata` — avoids
four near-duplicate page files. The homepage becomes the "no pay less notice" primary
landing page directly at `/`.

**Tech Stack:** Next.js 14 App Router metadata API. Builds on the checker-app-scaffold and
notice-validity-checker plans (links to `/checker`).

## Global Constraints

- Depends on both prior plans being merged first: `Header`/`Footer`/`app/layout.tsx` from
  `2026-07-05-checker-app-scaffold.md`, and the `/checker` route from
  `2026-07-05-notice-validity-checker.md` (every guide page's CTA links there).
- Every guide page must end with a CTA linking to `/checker`.
- Content must not overstate certainty — the deadline-calculator guide must repeat the
  calendar-days-not-certified caveat used in `DisclaimerBanner`.
- No new dependencies.

---

### Task 1: Guide content data + dynamic route

**Files:**
- Create: `checker/lib/guides.ts`
- Create: `checker/lib/__tests__/guides.test.ts`
- Create: `checker/app/guides/[slug]/page.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type Guide = {
    slug: string;
    title: string;
    metaDescription: string;
    intro: string;
    body: string[]; // paragraphs
  };
  export const guides: Guide[];
  export function getGuideBySlug(slug: string): Guide | undefined;
  ```
  Consumed by this plan's route file and by Task 2's homepage.

- [ ] **Step 1: Write the failing test**

```ts
// checker/lib/__tests__/guides.test.ts
import { describe, expect, it } from "vitest";
import { guides, getGuideBySlug } from "../guides";

describe("guides", () => {
  it("has exactly the three secondary Phase 05 SEO slugs", () => {
    const slugs = guides.map((g) => g.slug).sort();
    expect(slugs).toEqual(
      [
        "main-contractor-not-paying-subcontractor",
        "payment-notice-deadline-calculator",
        "smash-and-grab-adjudication-cost",
      ].sort()
    );
  });

  it("returns a guide by slug", () => {
    const guide = getGuideBySlug("smash-and-grab-adjudication-cost");
    expect(guide?.title).toContain("Smash");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getGuideBySlug("does-not-exist")).toBeUndefined();
  });

  it("every guide has non-empty body paragraphs", () => {
    for (const guide of guides) {
      expect(guide.body.length).toBeGreaterThan(0);
      for (const paragraph of guide.body) {
        expect(paragraph.length).toBeGreaterThan(20);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd checker && pnpm test lib/__tests__/guides.test.ts`
Expected: FAIL — "Cannot find module '../guides'"

- [ ] **Step 3: Implement guides.ts**

```ts
// checker/lib/guides.ts
export type Guide = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  body: string[];
};

export const guides: Guide[] = [
  {
    slug: "main-contractor-not-paying-subcontractor",
    title: "Main Contractor Not Paying? Here's What UK Subcontractors Can Do",
    metaDescription:
      "If a main contractor hasn't paid you, the Construction Act gives you a fast, procedural route to recover the full notified sum — here's how it works.",
    intro:
      "If a main contractor has stopped paying, you are not stuck waiting for a valuation argument. The Housing Grants, Construction and Regeneration Act 1996 (as amended) gives every UK construction subcontractor a statutory right to be paid on time — and a fast enforcement route when that right is ignored.",
    body: [
      "Every construction contract in England and Wales is required to have a payment mechanism: a due date, a final date for payment, and a right for the payer to serve a payment notice or a pay less notice if they intend to pay less than the sum applied for.",
      "If your main contractor missed the deadline to serve a valid pay less notice, the amount you applied for becomes the 'notified sum' — payable in full, regardless of any dispute about the actual value of the work. This is commonly called a 'smash and grab' adjudication, because it turns on notice dates and paperwork, not on re-arguing the value of the work.",
      "The process to enforce this is adjudication: a 28-day statutory dispute process that any party to a construction contract can start at any time, without needing a court order first. An adjudicator's decision is binding and enforceable immediately, even if the losing party wants to challenge it later.",
      "The first step is establishing exactly which notices were served, and when. Our free checker below walks through your dates and gives you an immediate, automated read on whether your payer's paperwork was in order.",
    ],
  },
  {
    slug: "smash-and-grab-adjudication-cost",
    title: "Smash and Grab Adjudication Cost: What UK Subcontractors Actually Pay",
    metaDescription:
      "Adjudicator fees typically run £8,000–£30,000 for construction disputes — but smash-and-grab cases are the cheapest and fastest category to bring. Here's the real cost breakdown.",
    intro:
      "The biggest reason subcontractors write off money they're owed isn't that they're wrong on the law — it's that the cost of enforcing it looks disproportionate to the claim. Smash-and-grab adjudication is the exception: it's the cheapest, fastest category of UK construction dispute, because it turns purely on dates and notices, not on valuing the work.",
    body: [
      "A typical full-value adjudication — where the parties argue about how much the work is actually worth — can cost £8,000 to £30,000 in adjudicator fees alone, before either side's own advisers. That's why claims consultants and construction solicitors usually only take cases above roughly £50,000-£125,000: the fees don't make sense below that.",
      "A smash-and-grab case is structurally different. There's no valuation argument — the adjudicator is only being asked whether a payment notice or pay less notice was served, and whether it was served on time and in the correct form. That means the referral, response, and decision can be prepared and run far faster and cheaper than a true-value dispute.",
      "Low-value and fast-track adjudication schemes (CIC Model Adjudication Procedure, TeCSA, RICS) already exist precisely because the standard adjudicator-fee model doesn't work for claims under roughly £25,000 — but almost none of the market serves that segment today, because the preparation cost (not the adjudicator's fee) is what's still uncapped and expensive.",
      "That's the gap a prepared, AI-assisted referral pack closes: fixed-fee preparation for the notice-validity case, at a price that makes sub-£25,000 claims rational to bring for the first time.",
    ],
  },
  {
    slug: "payment-notice-deadline-calculator",
    title: "Payment Notice Deadline Calculator (UK Construction Contracts)",
    metaDescription:
      "Calculate your payment notice and pay less notice deadlines under a UK construction contract, and check whether your payer's notices were served on time.",
    intro:
      "Payment notice and pay less notice deadlines are the single most important dates in a UK construction payment dispute. Missing them — as a payer — means the notified sum becomes payable in full. This calculator estimates both deadlines from your contract dates.",
    body: [
      "Under the Scheme for Construction Contracts (which applies whenever a contract doesn't specify its own payment terms, or specifies terms that don't comply with the Construction Act), a payment notice is due within 5 days of the due date, and a pay less notice is due 7 days before the final date for payment — unless your contract specifies different periods, in which case the contract terms apply first.",
      "The calculator below uses calendar days for a quick first read. It does not yet account for the England & Wales bank-holiday calendar, so treat the exact deadline dates as indicative — for a certified assessment before you act on a deadline, get the reviewed referral pack.",
      "Enter your due date, final date for payment, and (if one was served) the date your payer's pay less notice arrived. You'll get an immediate read on whether it was served in time, and what that means for the sum you're owed.",
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd checker && pnpm test lib/__tests__/guides.test.ts`
Expected: PASS — 4 tests passed

- [ ] **Step 5: Implement the dynamic route**

```tsx
// checker/app/guides/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { guides, getGuideBySlug } from "@/lib/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.metaDescription,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold text-ink">{guide.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{guide.intro}</p>
      <div className="mt-6 space-y-4 text-ink/80">
        {guide.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <Link
        href="/checker"
        className="mt-8 inline-block rounded-md bg-accent px-6 py-3 font-medium text-white"
      >
        Check your notice free
      </Link>
    </article>
  );
}
```

- [ ] **Step 6: Verify the app builds and statically generates all three guide pages**

Run: `cd checker && pnpm build`
Expected: build output lists `/guides/main-contractor-not-paying-subcontractor`,
`/guides/payment-notice-deadline-calculator`, and `/guides/smash-and-grab-adjudication-cost`
as static (○) routes.

- [ ] **Step 7: Commit**

```bash
git add checker/lib/guides.ts checker/lib/__tests__/guides.test.ts checker/app/guides
git commit -m "feat(checker): SEO guide pages via typed content + dynamic route"
```

---

### Task 2: Homepage as the primary "no pay less notice" landing page

**Files:**
- Modify: `checker/app/page.tsx`

**Interfaces:**
- Consumes: `guides` from `checker/lib/guides.ts` (Task 1)
- Produces: nothing consumed elsewhere (leaf page)

- [ ] **Step 1: Replace the placeholder homepage with real SEO content**

```tsx
// checker/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Has Your Payer Served a Valid Pay Less Notice?",
  description:
    "Free checker for UK construction subcontractors: find out if your main contractor's pay less notice was valid, and what you're owed if it wasn't.",
};

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">
        Has your payer served a valid pay less notice?
      </h1>
      <p className="mt-4 text-lg text-ink/80">
        If they haven&apos;t — or served it late — the full amount you applied for is
        likely payable, and we can get it. Check your dates for free below.
      </p>
      <Link
        href="/checker"
        className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-medium text-white"
      >
        Check your notice free
      </Link>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-ink">More on payment recovery</h2>
        <ul className="mt-4 space-y-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="text-accent underline">
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify the app builds**

Run: `cd checker && pnpm build`
Expected: "Compiled successfully"

- [ ] **Step 3: Commit**

```bash
git add checker/app/page.tsx
git commit -m "feat(checker): homepage as primary no-pay-less-notice landing page"
```

---

### Task 3: Sitemap for SEO crawlability

**Files:**
- Create: `checker/app/sitemap.ts`

**Interfaces:**
- Consumes: `guides` from `checker/lib/guides.ts` (Task 1)
- Produces: nothing consumed elsewhere

- [ ] **Step 1: Implement sitemap.ts** (Next.js's built-in `MetadataRoute` convention — no
  unit test needed, it's a thin data-mapping file exercised by the build/curl check below)

```ts
// checker/app/sitemap.ts
import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://allsquared-checker.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/checker`, lastModified: new Date() },
    ...guides.map((guide) => ({
      url: `${BASE_URL}/guides/${guide.slug}`,
      lastModified: new Date(),
    })),
  ];
}
```

- [ ] **Step 2: Verify the app builds and serves a 5-URL sitemap**

Run: `cd checker && pnpm build && pnpm start &`
Then: `sleep 2 && curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"`
Expected: `5` (home, checker, 3 guides)

Run: `kill %1` to stop the server afterward.

- [ ] **Step 3: Commit**

```bash
git add checker/app/sitemap.ts
git commit -m "feat(checker): sitemap.xml for SEO crawlability"
```

---

## Verification (end of plan)

1. `cd checker && pnpm test` — all tests pass (guides + everything from prior plans).
2. `cd checker && pnpm build` — all 3 guide routes + home + checker are listed as static.
3. `cd checker && pnpm dev`, visit `/`, `/guides/smash-and-grab-adjudication-cost`,
   `/guides/main-contractor-not-paying-subcontractor`,
   `/guides/payment-notice-deadline-calculator` — confirm content renders and each page's
   CTA links to `/checker`.
4. View page source on any guide page — confirm `<title>` and meta description match the
   `guides.ts` content (Next.js metadata API).
