# Notice-Validity Checker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the guided questionnaire at `/checker` that estimates pay-less-notice
deadlines from user-entered contract dates, shows a plain-English validity read, and
captures the visitor as a lead via email (Resend) for human follow-up on the paid referral
pack.

**Architecture:** A pure calculation function (`assessNotice`) covered by unit tests, a
client-component multi-step form calling it entirely in the browser (no round-trip needed
for the calculation), and a single API route that emails lead details to the founder.
Calendar-day math only — deliberately simpler than the Phase 02 rules engine (R1–R3), and
labelled as such throughout.

**Tech Stack:** Next.js 14 App Router (builds on the checker-app-scaffold plan),
TypeScript, Vitest, Resend (email API, free tier: 100 emails/day, https://resend.com).

## Global Constraints

- Depends on the `2026-07-05-checker-app-scaffold.md` plan being merged first — `Header`,
  `Footer`, `DisclaimerBanner`, and `app/layout.tsx` must already exist at
  `checker/components/` and `checker/app/layout.tsx`.
- Calendar-day math only, per `allsquared-plans/for-repo/REQUIREMENTS.md` R3's exact rule
  text: "payment-notice window (5 days after due date), pay less notice prescribed period
  (contract, else Scheme 7 days before final date for payment)". Do NOT add bank-holiday
  logic — that's explicitly Phase 02 (R2) scope, not this tool's.
- Every result screen must repeat the calendar-days-not-certified caveat (matches the
  `DisclaimerBanner` wording from the scaffold plan).
- `RESEND_API_KEY` is an environment variable; if absent, the lead API route must still
  return success to the user but log a warning server-side — no user-facing errors during
  the validation sprint just because email isn't configured yet.

---

### Task 1: `assessNotice` pure calculation function

**Files:**
- Create: `checker/lib/assessNotice.ts`
- Create: `checker/lib/__tests__/assessNotice.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type NoticeInput = {
    dueDate: string; // ISO date "YYYY-MM-DD"
    finalDateForPayment: string; // ISO date
    contractPayLessNoticePeriodDays?: number; // optional, overrides Scheme default of 7
    paymentNoticeServedDate?: string; // ISO date, optional
    payLessNoticeServedDate?: string; // ISO date, optional
    notifiedSum: number; // pence, the amount claimed in the payment application
  };

  export type NoticeResult = {
    paymentNoticeDeadline: string; // ISO date
    payLessNoticeDeadline: string; // ISO date
    paymentNoticeServedOnTime: boolean | null; // null if no date given
    payLessNoticeServedOnTime: boolean | null; // null if no date given
    likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
    amountLikelyPayable: number; // pence — notifiedSum if smash_and_grab_likely, else 0
    explanation: string;
  };

  export function assessNotice(input: NoticeInput): NoticeResult;
  ```
  Consumed by the questionnaire form in Task 3 of this plan.

- [ ] **Step 1: Write the failing tests**

```ts
// checker/lib/__tests__/assessNotice.test.ts
import { describe, expect, it } from "vitest";
import { assessNotice } from "../assessNotice";

describe("assessNotice", () => {
  it("computes payment notice deadline as due date + 5 calendar days", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      notifiedSum: 1000000,
    });
    expect(result.paymentNoticeDeadline).toBe("2026-06-06");
  });

  it("computes pay less notice deadline as final date minus 7 calendar days by default", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      notifiedSum: 1000000,
    });
    expect(result.payLessNoticeDeadline).toBe("2026-06-08");
  });

  it("uses the contract-specified pay less notice period when given", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      contractPayLessNoticePeriodDays: 10,
      notifiedSum: 1000000,
    });
    expect(result.payLessNoticeDeadline).toBe("2026-06-05");
  });

  it("flags smash-and-grab likely when no pay less notice was served at all", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      notifiedSum: 1000000,
    });
    expect(result.likelyValid).toBe("smash_and_grab_likely");
    expect(result.amountLikelyPayable).toBe(1000000);
    expect(result.payLessNoticeServedOnTime).toBeNull();
  });

  it("flags smash-and-grab likely when the pay less notice was served after its deadline", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      payLessNoticeServedDate: "2026-06-10",
      notifiedSum: 1000000,
    });
    expect(result.payLessNoticeServedOnTime).toBe(false);
    expect(result.likelyValid).toBe("smash_and_grab_likely");
    expect(result.amountLikelyPayable).toBe(1000000);
  });

  it("flags notices served on time when the pay less notice beats its deadline", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      payLessNoticeServedDate: "2026-06-07",
      notifiedSum: 1000000,
    });
    expect(result.payLessNoticeServedOnTime).toBe(true);
    expect(result.likelyValid).toBe("notices_served_on_time");
    expect(result.amountLikelyPayable).toBe(0);
  });

  it("flags needs_human_review when the payment notice itself was served late", () => {
    const result = assessNotice({
      dueDate: "2026-06-01",
      finalDateForPayment: "2026-06-15",
      paymentNoticeServedDate: "2026-06-10",
      payLessNoticeServedDate: "2026-06-07",
      notifiedSum: 1000000,
    });
    expect(result.paymentNoticeServedOnTime).toBe(false);
    expect(result.likelyValid).toBe("needs_human_review");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd checker && pnpm test lib/__tests__/assessNotice.test.ts`
Expected: FAIL — "Cannot find module '../assessNotice'"

- [ ] **Step 3: Implement assessNotice**

```ts
// checker/lib/assessNotice.ts
export type NoticeInput = {
  dueDate: string;
  finalDateForPayment: string;
  contractPayLessNoticePeriodDays?: number;
  paymentNoticeServedDate?: string;
  payLessNoticeServedDate?: string;
  notifiedSum: number;
};

export type NoticeResult = {
  paymentNoticeDeadline: string;
  payLessNoticeDeadline: string;
  paymentNoticeServedOnTime: boolean | null;
  payLessNoticeServedOnTime: boolean | null;
  likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
  amountLikelyPayable: number;
  explanation: string;
};

const SCHEME_PAY_LESS_NOTICE_DAYS = 7;
const PAYMENT_NOTICE_WINDOW_DAYS = 5;

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isOnOrBefore(dateA: string, dateB: string): boolean {
  return new Date(`${dateA}T00:00:00Z`).getTime() <= new Date(`${dateB}T00:00:00Z`).getTime();
}

export function assessNotice(input: NoticeInput): NoticeResult {
  const paymentNoticeDeadline = addDays(input.dueDate, PAYMENT_NOTICE_WINDOW_DAYS);
  const payLessNoticePeriod =
    input.contractPayLessNoticePeriodDays ?? SCHEME_PAY_LESS_NOTICE_DAYS;
  const payLessNoticeDeadline = addDays(input.finalDateForPayment, -payLessNoticePeriod);

  const paymentNoticeServedOnTime = input.paymentNoticeServedDate
    ? isOnOrBefore(input.paymentNoticeServedDate, paymentNoticeDeadline)
    : null;

  const payLessNoticeServedOnTime = input.payLessNoticeServedDate
    ? isOnOrBefore(input.payLessNoticeServedDate, payLessNoticeDeadline)
    : null;

  let likelyValid: NoticeResult["likelyValid"];
  let amountLikelyPayable: number;
  let explanation: string;

  if (paymentNoticeServedOnTime === false) {
    likelyValid = "needs_human_review";
    amountLikelyPayable = 0;
    explanation =
      "The payment notice itself looks late — this changes the analysis and needs a human to check the full contract chain, not just the pay less notice.";
  } else if (payLessNoticeServedOnTime === true) {
    likelyValid = "notices_served_on_time";
    amountLikelyPayable = 0;
    explanation =
      "A pay less notice appears to have been served on time. This looks like a valuation dispute, not a smash-and-grab case — talk to us about a true-value assessment instead.";
  } else {
    likelyValid = "smash_and_grab_likely";
    amountLikelyPayable = input.notifiedSum;
    explanation = input.payLessNoticeServedDate
      ? "No valid pay less notice was served in time — on these facts, the notified sum is likely payable in full."
      : "No pay less notice was served at all — on these facts, the notified sum is likely payable in full.";
  }

  return {
    paymentNoticeDeadline,
    payLessNoticeDeadline,
    paymentNoticeServedOnTime,
    payLessNoticeServedOnTime,
    likelyValid,
    amountLikelyPayable,
    explanation,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd checker && pnpm test lib/__tests__/assessNotice.test.ts`
Expected: PASS — 7 tests passed

- [ ] **Step 5: Commit**

```bash
git add checker/lib/assessNotice.ts checker/lib/__tests__/assessNotice.test.ts
git commit -m "feat(checker): assessNotice calendar-day notice-validity calculation"
```

---

### Task 2: Lead-capture API route

**Files:**
- Create: `checker/app/api/lead/route.ts`
- Create: `checker/app/api/lead/__tests__/route.test.ts`
- Modify: `checker/package.json` (add `resend` dependency)

**Interfaces:**
- Consumes: nothing from Task 1 directly (independent of `assessNotice`)
- Produces: `POST /api/lead` accepting JSON body
  ```ts
  type LeadPayload = {
    email: string;
    notifiedSum: number;
    likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
  };
  ```
  returning `{ ok: true }` on 200, `{ ok: false, error: string }` on 400. Consumed by the
  questionnaire form in Task 3.

- [ ] **Step 1: Add the resend dependency**

Run: `cd checker && pnpm add resend@4.0.0`
Expected: added to `package.json` dependencies.

- [ ] **Step 2: Write the failing test**

```ts
// checker/app/api/lead/__tests__/route.test.ts
import { describe, expect, it, vi, beforeEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null });

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe("POST /api/lead", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "test-key";
  });

  it("returns ok:true and emails the lead when RESEND_API_KEY is set", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 500000,
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns ok:true without emailing when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 500000,
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it("returns 400 for an invalid payload", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd checker && pnpm test app/api/lead`
Expected: FAIL — "Cannot find module '../route'"

- [ ] **Step 4: Implement the route**

```ts
// checker/app/api/lead/route.ts
import { Resend } from "resend";

type LeadPayload = {
  email: string;
  notifiedSum: number;
  likelyValid: "smash_and_grab_likely" | "notices_served_on_time" | "needs_human_review";
};

function isValidPayload(body: unknown): body is LeadPayload {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.email === "string" &&
    candidate.email.includes("@") &&
    typeof candidate.notifiedSum === "number" &&
    typeof candidate.likelyValid === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  if (!isValidPayload(body)) {
    return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[lead] RESEND_API_KEY not set — lead was not emailed:", body);
    return Response.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "checker@allsquared.dev",
    to: process.env.LEAD_NOTIFICATION_EMAIL ?? "eli@autonolabs.ai",
    subject: `New checker lead — ${body.likelyValid}`,
    text: `Email: ${body.email}\nNotified sum: £${(body.notifiedSum / 100).toFixed(2)}\nResult: ${body.likelyValid}`,
  });

  return Response.json({ ok: true });
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd checker && pnpm test app/api/lead`
Expected: PASS — 3 tests passed

- [ ] **Step 6: Commit**

```bash
git add checker/app/api/lead checker/package.json checker/pnpm-lock.yaml
git commit -m "feat(checker): lead-capture API route with Resend email notification"
```

---

### Task 3: Questionnaire UI at /checker

**Files:**
- Create: `checker/app/checker/page.tsx`
- Create: `checker/components/NoticeForm.tsx`
- Create: `checker/components/__tests__/NoticeForm.test.tsx`

**Interfaces:**
- Consumes: `assessNotice` from `checker/lib/assessNotice.ts` (Task 1), `POST /api/lead`
  from Task 2
- Produces: the `/checker` route, not consumed elsewhere within this plan set

- [ ] **Step 1: Write the failing test**

```tsx
// checker/components/__tests__/NoticeForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NoticeForm } from "../NoticeForm";

describe("NoticeForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: true }),
    }) as unknown as typeof fetch;
  });

  it("shows the smash-and-grab result after submitting dates with no pay less notice", async () => {
    render(<NoticeForm />);

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-06-01" },
    });
    fireEvent.change(screen.getByLabelText(/final date for payment/i), {
      target: { value: "2026-06-15" },
    });
    fireEvent.change(screen.getByLabelText(/notified sum/i), {
      target: { value: "10000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check my notice/i }));

    await waitFor(() => {
      expect(screen.getByText(/likely payable in full/i)).toBeInTheDocument();
    });
  });

  it("posts a lead when an email is provided", async () => {
    render(<NoticeForm />);

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-06-01" },
    });
    fireEvent.change(screen.getByLabelText(/final date for payment/i), {
      target: { value: "2026-06-15" },
    });
    fireEvent.change(screen.getByLabelText(/notified sum/i), {
      target: { value: "10000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check my notice/i }));

    await waitFor(() => screen.getByLabelText(/your email/i));
    fireEvent.change(screen.getByLabelText(/your email/i), {
      target: { value: "subbie@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send me the referral pack quote/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/lead",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd checker && pnpm test components/__tests__/NoticeForm.test.tsx`
Expected: FAIL — "Cannot find module '../NoticeForm'"

- [ ] **Step 3: Implement NoticeForm**

```tsx
// checker/components/NoticeForm.tsx
"use client";

import { useState } from "react";
import { assessNotice, type NoticeResult } from "@/lib/assessNotice";

export function NoticeForm() {
  const [dueDate, setDueDate] = useState("");
  const [finalDateForPayment, setFinalDateForPayment] = useState("");
  const [payLessNoticeServedDate, setPayLessNoticeServedDate] = useState("");
  const [notifiedSumPounds, setNotifiedSumPounds] = useState("");
  const [result, setResult] = useState<NoticeResult | null>(null);
  const [email, setEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const notifiedSum = Math.round(parseFloat(notifiedSumPounds) * 100);
    const computed = assessNotice({
      dueDate,
      finalDateForPayment,
      payLessNoticeServedDate: payLessNoticeServedDate || undefined,
      notifiedSum,
    });
    setResult(computed);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        notifiedSum: result.amountLikelyPayable,
        likelyValid: result.likelyValid,
      }),
    });
    setLeadSent(true);
  }

  if (result) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-ink">
          {result.likelyValid === "smash_and_grab_likely" &&
            "Good news — the notified sum is likely payable in full"}
          {result.likelyValid === "notices_served_on_time" &&
            "A pay less notice appears to have been served on time"}
          {result.likelyValid === "needs_human_review" && "This needs a closer look"}
        </h2>
        <p className="mt-2 text-ink/80">{result.explanation}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-ink/60">Payment notice deadline</dt>
          <dd>{result.paymentNoticeDeadline}</dd>
          <dt className="text-ink/60">Pay less notice deadline</dt>
          <dd>{result.payLessNoticeDeadline}</dd>
        </dl>

        {!leadSent ? (
          <form onSubmit={handleLeadSubmit} className="mt-6 space-y-3">
            <label htmlFor="email" className="block text-sm font-medium">
              Your email
            </label>
            <input
              id="email"
              type="email"
              aria-label="your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink/20 px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
            >
              Send me the referral pack quote
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-accent">
            Thanks — we&apos;ll be in touch about your referral pack.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium">
          Due date
        </label>
        <input
          id="dueDate"
          type="date"
          aria-label="due date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border border-ink/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="finalDateForPayment" className="block text-sm font-medium">
          Final date for payment
        </label>
        <input
          id="finalDateForPayment"
          type="date"
          aria-label="final date for payment"
          required
          value={finalDateForPayment}
          onChange={(e) => setFinalDateForPayment(e.target.value)}
          className="w-full rounded-md border border-ink/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="payLessNoticeServedDate" className="block text-sm font-medium">
          Pay less notice served date (leave blank if none was served)
        </label>
        <input
          id="payLessNoticeServedDate"
          type="date"
          aria-label="pay less notice served date"
          value={payLessNoticeServedDate}
          onChange={(e) => setPayLessNoticeServedDate(e.target.value)}
          className="w-full rounded-md border border-ink/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="notifiedSum" className="block text-sm font-medium">
          Notified sum (£)
        </label>
        <input
          id="notifiedSum"
          type="number"
          aria-label="notified sum"
          required
          min="0"
          step="0.01"
          value={notifiedSumPounds}
          onChange={(e) => setNotifiedSumPounds(e.target.value)}
          className="w-full rounded-md border border-ink/20 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
      >
        Check my notice
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd checker && pnpm test components/__tests__/NoticeForm.test.tsx`
Expected: PASS — 2 tests passed

- [ ] **Step 5: Create the /checker route**

```tsx
// checker/app/checker/page.tsx
import type { Metadata } from "next";
import { NoticeForm } from "@/components/NoticeForm";

export const metadata: Metadata = {
  title: "Free Pay Less Notice Checker",
  description:
    "Check whether your payer served a valid pay less notice in time, and see what you're likely owed.",
};

export default function CheckerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">
        Has your payer served a valid pay less notice?
      </h1>
      <p className="mt-4 text-ink/70">
        Enter your contract dates below for a free, automated read on whether the notified
        sum in your payment application is likely payable in full.
      </p>
      <div className="mt-8">
        <NoticeForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify the app builds**

Run: `cd checker && pnpm build`
Expected: "Compiled successfully"

- [ ] **Step 7: Commit**

```bash
git add checker/app/checker checker/components/NoticeForm.tsx checker/components/__tests__/NoticeForm.test.tsx
git commit -m "feat(checker): notice-validity questionnaire at /checker"
```

---

## Verification (end of plan)

1. `cd checker && pnpm test` — all tests pass (assessNotice, lead route, NoticeForm).
2. `cd checker && pnpm build` succeeds.
3. `cd checker && pnpm dev`, visit `/checker`, fill the form with a due date, final date
   for payment, and notified sum, leave pay-less-notice date blank — confirm the "likely
   payable in full" result appears with correct deadline dates.
4. Submit the follow-up email field, confirm (via `console.warn` in the terminal, since
   `RESEND_API_KEY` won't be set locally) that the lead payload is logged.
