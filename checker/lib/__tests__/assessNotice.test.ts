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
