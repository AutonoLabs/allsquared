// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    waitlist: {
      join: {
        useMutation: () => ({ mutate, isPending: false }),
      },
    },
  },
}));

import Waitlist from "./Waitlist";

describe("Waitlist", () => {
  beforeEach(() => mutate.mockReset());
  afterEach(cleanup);

  it("validates email before submitting", () => {
    render(<Waitlist />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /join the waitlist/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits a valid email to the waitlist mutation", () => {
    render(<Waitlist />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "person@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /join the waitlist/i }));

    expect(mutate).toHaveBeenCalledWith(
      { email: "person@example.com" },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("shows the same success state for a duplicate submission", () => {
    mutate.mockImplementation((_input, options) => {
      options?.onSuccess({ status: "already_registered" });
    });

    render(<Waitlist />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "person@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /join the waitlist/i }));

    expect(screen.getByText(/you're on the list/i)).toBeInTheDocument();
  });
});
