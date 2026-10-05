import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { CategoryStandardHero } from "../CategoryStandardHero";

/**
 * Guards the SEO/content regression where a category page defined descriptive
 * intro copy in code but never showed it: the hero must render the subtitle as
 * visible, crawlable text beneath the category heading.
 */
const INTRO =
  "Compare thyroid function tests — TSH, T3, T4 and antibodies — across UK providers.";

describe("CategoryStandardHero", () => {
  afterEach(() => cleanup());

  it("shows the descriptive intro as visible text beneath the heading", () => {
    render(<CategoryStandardHero pillLabel="Thyroid" subtitle={INTRO} />);

    const intro = screen.getByText(INTRO);
    expect(intro.tagName).toBe("P");
    expect(intro.textContent).toBe(INTRO);
    // Not hidden from readers, assistive tech or crawlers.
    expect(intro.hasAttribute("hidden")).toBe(false);
    expect(intro.getAttribute("aria-hidden")).toBeNull();
  });

  it("renders no intro paragraph when the page supplies no subtitle", () => {
    render(<CategoryStandardHero pillLabel="Thyroid" />);

    expect(screen.queryByText(INTRO)).toBeNull();
    expect(document.querySelectorAll("section p")).toHaveLength(0);
  });

  it("keeps the heading as the section label once the intro is added", () => {
    render(<CategoryStandardHero pillLabel="Thyroid" subtitle={INTRO} />);

    const heading = screen.getByRole("heading", { level: 1, name: "Thyroid" });
    const section = document.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(heading.id);
  });
});
