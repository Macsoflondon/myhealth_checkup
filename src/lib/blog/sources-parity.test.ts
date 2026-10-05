import { describe, expect, it } from "vitest";
import * as web from "./sources";
import * as deno from "../../../supabase/functions/_shared/blog/sources";

const serialiseRules = (rules: { category: string; pattern: RegExp }[]) =>
  rules.map((r) => ({ category: r.category, pattern: r.pattern.toString() }));

describe("blog sources parity (app vs blog-aggregate edge function)", () => {
  it("BLOG_SOURCES are identical", () => {
    expect(deno.BLOG_SOURCES).toEqual(web.BLOG_SOURCES);
  });

  it("BLOG_SOURCES_UNAVAILABLE are identical", () => {
    expect(deno.BLOG_SOURCES_UNAVAILABLE).toEqual(web.BLOG_SOURCES_UNAVAILABLE);
  });

  it("category rules are identical", () => {
    expect(serialiseRules(deno.CATEGORY_RULES)).toEqual(
      serialiseRules(web.CATEGORY_RULES),
    );
  });

  it("categoriseArticle agrees on sample inputs", () => {
    const samples = [
      "Prostate cancer and PSA",
      "TSH explained",
      "Menopause and HRT",
      "Cholesterol basics",
      "HbA1c",
      "Gut microbiome",
      "Vitamin D levels",
      "Sleep and stress",
      "Hydration tips",
    ];
    for (const s of samples) {
      expect(deno.categoriseArticle(s)).toBe(web.categoriseArticle(s));
    }
  });
});
