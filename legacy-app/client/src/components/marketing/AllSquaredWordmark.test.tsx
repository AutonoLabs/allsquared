// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AllSquaredWordmark } from "./AllSquaredWordmark";

// The recalibrated, contained tick path. Centered inside the lower-right grid
// cell of the 36x36 viewBox (bounds 17.01..29.06, 18.09..28.06) so it never
// protrudes past the rounded frame like the previous path did.
const TICK_D = "M17.01 22.99L22.08 28.06L29.06 19.91L26.94 18.09L21.92 23.94L18.99 21.01Z";

// The legacy, protruding tick path — kept here so a regression test can
// assert we never silently swap back to it.
const LEGACY_TICK_D = "m18.2 23.8 3.1 3.1L31 17.2l2.8 2.8-12.5 12.5-5.9-5.9 2.8-2.8Z";

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

  it("uses the recalibrated tick path that stays inside the rounded frame", () => {
    // Direct regression guard: pin the exact `d` value of the contained tick
    // so any future edit to the SVG geometry must update this assertion on
    // purpose. Also guard against silently reverting to the legacy path.
    render(<AllSquaredWordmark />);

    const tick = screen
      .getByRole("link", { name: "AllSquared" })
      .querySelector('[data-part="verification"]');

    expect(tick).toHaveAttribute("d", TICK_D);
    expect(tick).not.toHaveAttribute("d", LEGACY_TICK_D);
  });
});