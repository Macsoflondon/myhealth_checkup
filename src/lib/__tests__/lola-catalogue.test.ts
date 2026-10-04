import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LOLA_PANEL_BIOMARKERS,
  buildLolaCatalogueSql,
  lolaTurnaround,
} from "../../../supabase/functions/_shared/scrape/lola-catalogue";
import { displayBiomarkerCount } from "@/lib/resolve-test-fields";
import { PROVIDER_TURNAROUND_TIMES } from "@/constants/providers";
import { detailedProviders } from "@/data/compare/detailedProviders";

const EXPECTED_COUNTS: Record<string, number> = {
  "Vital Check 56": 55,
  "Female Hormones Clarity 31": 31,
  "Female Active Boost 39": 39,
  "Male Hormones Clarity 14": 14,
  Urinalysis: 18,
};

describe("Lola panel biomarker lists", () => {
  it.each(Object.entries(EXPECTED_COUNTS))(
    "%s lists %i markers with no duplicates",
    (name, count) => {
      const list = LOLA_PANEL_BIOMARKERS[name];
      expect(list).toHaveLength(count);
      expect(new Set(list).size).toBe(list.length);
    },
  );

  it.each(Object.entries(LOLA_PANEL_BIOMARKERS))(
    "%s displayed count equals its list length, whatever number is stored",
    (_name, list) => {
      expect(
        displayBiomarkerCount({ biomarker_count: 999, biomarkers_list: list }),
      ).toBe(list.length);
    },
  );

  it("male hormones panel includes TSH", () => {
    expect(LOLA_PANEL_BIOMARKERS["Male Hormones Clarity 14"]).toContain(
      "Thyroid-Stimulating Hormone",
    );
  });
});

describe("Lola turnaround", () => {
  it.each([
    ["Albumin", "2 working days"],
    ["Core Health 45", "2 working days"],
    ["Peak Insights 70", "2 working days"],
    ["Urinalysis", "24-48 hours"],
    ["TruAge Test", "3-4 weeks"],
    ["TruHealth Test", "3-4 weeks"],
    ["TruAge + TruHealth Test", "3-4 weeks"],
    ["GutID CMA - Complete Microbiome Assessment", "3-4 weeks"],
    ["GutID CGI - Core Gut Insights", "3-4 weeks"],
  ])("%s → %s", (name, expected) => {
    expect(lolaTurnaround(name)).toBe(expected);
  });

  it("never returns an empty turnaround", () => {
    for (const name of ["", "Anything new", ...Object.keys(LOLA_PANEL_BIOMARKERS)]) {
      expect(lolaTurnaround(name).trim()).not.toBe("");
    }
  });

  it("provider-level values match the product pages", () => {
    expect(PROVIDER_TURNAROUND_TIMES["lola-health"]).toBe("2 working days");
    const lola = detailedProviders.find((p) => p.id === "lola-health");
    expect(lola?.turnaroundTime).toBe(
      "2 working days (3-4 weeks for epigenetic and gut microbiome tests)",
    );
  });
});

describe("Lola migration stays in step with the catalogue", () => {
  it("committed migration equals the generated SQL", () => {
    const sql = readFileSync(
      "supabase/migrations/20261004221500_lola_catalogue_corrections.sql",
      "utf8",
    );
    expect(sql).toBe(buildLolaCatalogueSql());
  });
});

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

describe("Lola accreditation wording", () => {
  it("no file under src calls Lola's labs NHS-accredited", () => {
    const offenders = walk("src")
      .filter((f) => /\.(ts|tsx|json)$/.test(f))
      .filter((f) => {
        const text = readFileSync(f, "utf8");
        return /lola/i.test(text) && /NHS-accredited/i.test(text);
      });
    expect(offenders).toEqual([]);
  });

  it("Lola is described with UKAS-accredited laboratories (ISO 15189)", () => {
    const lola = detailedProviders.find((p) => p.id === "lola-health");
    expect(lola?.accreditation).toBe("UKAS-accredited laboratories (ISO 15189)");
  });
});
