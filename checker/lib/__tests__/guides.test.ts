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
