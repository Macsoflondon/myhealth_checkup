import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The homepage section sequence is a standing product decision (project memory
 * "Homepage Order"). On 2026-10-24 the site owner swapped "Trusted by users"
 * and "Why myhealth checkup" and asked for "Featured Partner of the Month" to
 * sit above the section that moved up. This guard fails if any of that drifts.
 */

const homepage = readFileSync(join(__dirname, "..", "Index.tsx"), "utf8");
const showcase = readFileSync(
  join(__dirname, "..", "..", "components", "sections", "PartnerShowcaseGrid.tsx"),
  "utf8",
);

const SEQUENCE: readonly (readonly [string, string])[] = [
  ["Partners grid", "<PartnersGrid />"],
  ["Popular tests", "<HeroPopularTests />"],
  ["Start your journey", "<StartJourneySection />"],
  ["Featured partner showcase", "<PartnerShowcaseGrid />"],
  ["Trusted by users", "<TestimonialCarousel />"],
  ["Why myhealth checkup", "<DecisionInfrastructureSection />"],
  ["Clinics and help", "<ClinicAndHelpSection />"],
];

const positionOf = (marker: string): number => homepage.indexOf(marker);

describe("homepage section order", () => {
  it("renders each section exactly once", () => {
    for (const [, marker] of SEQUENCE) {
      expect(homepage.split(marker).length - 1, marker).toBe(1);
    }
  });

  it("keeps the agreed sequence", () => {
    const positions = SEQUENCE.map(([, marker]) => positionOf(marker));

    positions.forEach((position, index) => {
      expect(position, `${SEQUENCE[index][0]} is missing`).toBeGreaterThan(-1);
      if (index > 0) {
        expect(position, `${SEQUENCE[index][0]} is out of order`).toBeGreaterThan(
          positions[index - 1],
        );
      }
    });
  });

  it("opens the showcase block with the featured partner wheel", () => {
    const wheel = showcase.indexOf("<FeaturedPartnerWheel");
    const categories = showcase.indexOf("<TestCategoriesSection");
    const popular = showcase.indexOf("<DreamHealthShowcase");

    expect(wheel).toBeGreaterThan(-1);
    expect(wheel).toBeLessThan(categories);
    expect(wheel).toBeLessThan(popular);
  });
});
