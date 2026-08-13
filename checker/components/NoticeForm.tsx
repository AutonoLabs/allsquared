"use client";

import { useState } from "react";
import { assessNotice, type NoticeResult } from "@/lib/assessNotice";

export function NoticeForm() {
  const [dueDate, setDueDate] = useState("");
  const [finalDateForPayment, setFinalDateForPayment] = useState("");
  const [payLessNoticeServedDate, setPayLessNoticeServedDate] = useState("");
  const [notifiedSumPounds, setNotifiedSumPounds] = useState("");
  const [result, setResult] = useState<NoticeResult | null>(null);
  const [enteredNotifiedSum, setEnteredNotifiedSum] = useState(0);
  const [email, setEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(notifiedSumPounds);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }
    const notifiedSum = Math.round(parsed * 100);
    const computed = assessNotice({
      dueDate,
      finalDateForPayment,
      payLessNoticeServedDate: payLessNoticeServedDate || undefined,
      notifiedSum,
    });
    setResult(computed);
    setEnteredNotifiedSum(notifiedSum);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        notifiedSum: enteredNotifiedSum,
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
            "Good news for your payment application"}
          {result.likelyValid === "notices_served_on_time" &&
            "Looks like a valuation dispute, not smash-and-grab"}
          {result.likelyValid === "needs_human_review" && "This needs a closer look"}
        </h2>
        <p className="mt-2 text-ink/80">{result.explanation}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-ink/60">Payment notice deadline</dt>
          <dd>{result.paymentNoticeDeadline}</dd>
          <dt className="text-ink/60">Pay less notice deadline</dt>
          <dd>{result.payLessNoticeDeadline}</dd>
        </dl>
        <p className="mt-4 text-xs text-ink/60">
          These dates use calendar days, not the England &amp; Wales bank-holiday calendar —
          treat them as indicative.
        </p>

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
