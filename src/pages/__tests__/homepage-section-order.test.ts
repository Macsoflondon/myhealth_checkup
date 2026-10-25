import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The homepage section sequence is a standing product decision (project memory
 * "Homepage Order"). On 2026-10-24 the site owner swapped "Trusted by users"
 * and "Why myhealth checkup" and asked for "Featured Partner of the Month" to
 * sit above the section that moved up. This guard fails if any of that drifts.
 *
 * Sections are declared as module-level elements (DEFERRED_SECTIONS,
 * DECISION_SECTION) and dropped into the page as placeholders, so the check
 * reads each block on its own instead of trusting raw file positions.
 */

const homepage = readFileSync(join(__dirname, "..", "Index.tsx"), "utf8");
const showcase = readFileSync(
  join(
    __dirname,
    "..",
    "..",
    "components",
    "sections",
    "PartnerShowcaseGrid.tsx",
  ),
  "utf8",
);

/** Text between the first `start` marker and the next `end` marker. */
const sliceBetween = (source: string, start: string, end: string): string => {
  const from = source.indexOf(start);
  if (from === -1) throw new Error(`Missing block: ${start}`);
  const to = source.indexOf(end, from);
  if (to === -1) throw new Error(`Unterminated block: ${start}`);
  return source.slice(from, to);
};

const deferredBlock = sliceBetween(
  homepage,
  "const DEFERRED_SECTIONS = (",
  "\n);\n",
);
const pageBody = homepage.slice(homepage.indexOf("const Index = () => {"));

const DEFERRED_ORDER: readonly string[] = [
  "<AccreditedProvidersBar />",
  "<HeroPopularTests />",
  "<StartJourneySection />",
];

const BODY_ORDER: readonly string[] = [
  "<HeroMasthead />",
  "<PartnersGrid />",
  "{DEFERRED_SECTIONS}",
  "<PartnerShowcaseGrid />",
  "<TestimonialCarousel />",
  "{DECISION_SECTION}",
  "<ClinicAndHelpSection />",
];

const assertAscending = (
  source: string,
  markers: readonly string[],
  block: string,
): void => {
  markers.forEach((marker, index) => {
    const position = source.indexOf(marker);
    expect(position, `${marker} is missing from ${block}`).toBeGreaterThan(-1);
    expect(
      source.split(marker).length - 1,
      `${marker} renders more than once in ${block}`,
    ).toBe(1);
    if (index > 0) {
      expect(position, `${marker} is out of order in ${block}`).toBeGreaterThan(
        source.indexOf(markers[index - 1]),
      );
    }
  });
};

describe("homepage section order", () => {
  it("keeps the scrolled-in sections in order", () => {
    assertAscending(deferredBlock, DEFERRED_ORDER, "DEFERRED_SECTIONS");
  });

  it("puts the featured partner above the testimonials and the why section last", () => {
    assertAscending(pageBody, BODY_ORDER, "the page body");
  });

  it("opens the showcase block with the featured partner wheel", () => {
    const wheel = showcase.indexOf("<FeaturedPartnerWheel");
    const categories = showcase.indexOf("<TestCategoriesSection");
    const popular = showcase.indexOf("<DreamHealthShowcase");

    expect(wheel).toBeGreaterThan(-1);
    expect(wheel).toBeLessThan(categories);
    expect(wheel).toBeLessThan(popular);
  });

  it("still renders the moved section's own component", () => {
    const decisionBlock = sliceBetween(
      homepage,
      "const DECISION_SECTION = (",
      "\n);\n",
    );
    expect(decisionBlock).toContain("<DecisionInfrastructureSection />");
  });
});
