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
