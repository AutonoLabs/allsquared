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
