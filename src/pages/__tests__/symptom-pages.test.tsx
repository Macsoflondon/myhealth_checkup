import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { symptomPages } from "@/data/symptomPages";

let currentSlug = "fatigue";

vi.mock("@/lib/router-compat", () => ({
  Link: ({ children, to }: { children?: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useParams: () => ({ symptomSlug: currentSlug }),
}));
vi.mock("@/layouts/MainLayout", () => ({
  default: ({ children }: { children?: ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/pages/NotFound", () => ({ default: () => <p>Not found</p> }));
vi.mock("@/components/sections/CategoryGuides", () => ({
  default: ({ heading }: { heading: string }) => <h2>{heading}</h2>,
}));
vi.mock("@/components/sections/QuizCTABanner", () => ({
  default: () => null,
}));

import SymptomDetailPage from "@/pages/SymptomDetailPage";

const renderSymptom = (slug: string) => {
  currentSlug = slug;
  return render(
    <HelmetProvider>
      <SymptomDetailPage />
    </HelmetProvider>,
  );
};

const bySlug = (slug: string) => {
  const symptom = symptomPages.find((s) => s.slug === slug);
  if (!symptom) throw new Error(`missing symptom ${slug}`);
  return symptom;
};

const mentionsAllergy = (test: {
  name: string;
  why: string;
  searchQuery: string;
  keyBiomarkers: string[];
}) =>
  /allerg|\bige\b/i.test(
    [test.name, test.searchQuery, ...test.keyBiomarkers].join(" "),
  );

describe("symptom page data", () => {
  it("has unique slugs", () => {
    const slugs = symptomPages.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(symptomPages.map((s) => [s.slug, s] as const))(
    "%s has unique recommended test names and a search query for each",
    (_slug, symptom) => {
      const names = symptom.recommendedTests.map((t) => t.name.toLowerCase());
      expect(names.length).toBeGreaterThan(0);
      expect(new Set(names).size).toBe(names.length);
      for (const test of symptom.recommendedTests) {
        expect(test.searchQuery.trim()).not.toBe("");
      }
    },
  );

  it.each(symptomPages.map((s) => [s.slug, s] as const))(
    "%s states its limitations and copy has no em dashes or semicolons",
    (_slug, symptom) => {
      expect(symptom.limitations?.trim()).toBeTruthy();
      const copy = [
        symptom.name,
        symptom.shortDescription,
        symptom.clinicalExplanation,
        symptom.limitations ?? "",
        symptom.whenToSeeGP,
        ...symptom.recommendedTests.flatMap((t) => [t.name, t.why]),
      ].join(" ");
      expect(copy).not.toMatch(/[—;]/);
    },
  );

  it("does not recommend allergy (IgE) tests for bloating or adult acne", () => {
    for (const slug of ["bloating", "skin-breakouts"]) {
      expect(bySlug(slug).recommendedTests.filter(mentionsAllergy)).toEqual([]);
    }
  });

  it("does not recommend a cortisol test for sleep problems", () => {
    const tests = bySlug("sleep-problems").recommendedTests;
    expect(
      tests.filter((t) =>
        /cortisol/i.test([t.name, t.searchQuery, ...t.keyBiomarkers].join(" ")),
      ),
    ).toEqual([]);
  });
});

describe("SymptomDetailPage", () => {
  it.each(symptomPages.map((s) => [s.slug] as const))(
    "%s renders no duplicate headings",
    (slug) => {
      const { unmount } = renderSymptom(slug);
      const headings = screen
        .getAllByRole("heading")
        .map((h) => h.textContent?.trim().toLowerCase() ?? "");
      const duplicates = headings.filter((h, i) => headings.indexOf(h) !== i);
      expect(duplicates).toEqual([]);
      unmount();
    },
  );

  it("points Compare all at the symptom mode, not the first test's search", () => {
    renderSymptom("brain-fog");
    const link = screen.getByRole("link", {
      name: /compare all brain fog tests/i,
    });
    expect(link).toHaveAttribute("href", "/compare?symptom=brain-fog");
  });

  it("shows the limitations text", () => {
    renderSymptom("sleep-problems");
    expect(
      screen.getByRole("heading", { name: "What these tests cannot tell you" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(bySlug("sleep-problems").limitations!),
    ).toBeInTheDocument();
  });
});
