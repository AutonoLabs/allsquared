// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AllSquaredWordmark } from "./AllSquaredWordmark";

afterEach(cleanup);

describe("AllSquaredWordmark", () => {
  it("renders the light verified-square mark inside an accessible home link", () => {
    render(<AllSquaredWordmark />);

    const link = screen.getByRole("link", { name: "AllSquared" });
    expect(link).toHaveAttribute("href", "/");

    const mark = link.querySelector("svg");
    expect(mark).toHaveAttribute("viewBox", "0 0 36 36");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("focusable", "false");
    expect(mark?.querySelector('[data-part="frame"]')).toHaveAttribute("fill", "#0b1b33");
    expect(mark?.querySelector('[data-part="verification"]')).toHaveAttribute("fill", "#1f6b3f");
  });

  it("uses the high-contrast dark palette without changing the accessible name", () => {
    render(<AllSquaredWordmark dark />);

    const link = screen.getByRole("link", { name: "AllSquared" });
    const mark = link.querySelector("svg");
    expect(mark?.querySelector('[data-part="frame"]')).toHaveAttribute("fill", "#ffffff");
    expect(mark?.querySelector('[data-part="verification"]')).toHaveAttribute("fill", "#8fd1aa");
  });
});
