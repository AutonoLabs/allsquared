import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DisclaimerBanner } from "../DisclaimerBanner";

describe("DisclaimerBanner", () => {
  it("renders the not-legal-advice disclaimer", () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
  });
});
