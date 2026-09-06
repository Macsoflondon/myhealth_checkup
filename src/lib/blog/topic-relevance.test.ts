import { describe, expect, it } from "vitest";
import { guidesHeadingFor, selectTopicArticles } from "./topic-relevance";
import type { BlogArticle } from "@/types/blog.types";

const article = (over: Partial<BlogArticle>): BlogArticle => ({
  title: "Title",
  excerpt: "Excerpt",
  url: `https://example.com/${Math.random()}`,
  image: "",
  provider: "Medichecks",
  category: "Wellness",
  date: "2026-01-01",
  ...over,
});

describe("selectTopicArticles", () => {
  it("prefers keyword matches for the topic", () => {
    const pool = [
      article({ title: "Top 3 tests for men", provider: "A" }),
      article({ title: "How to take a finger-prick sample", provider: "B" }),
      article({ title: "Liver foods", provider: "C" }),
    ];
    const picked = selectTopicArticles(pool, "At Home Test Kits", 1);
    expect(picked[0]?.title).toBe("How to take a finger-prick sample");
  });

  it("spreads providers before repeating one", () => {
    const pool = [
      article({ title: "Prostate cancer PSA", provider: "A" }),
      article({ title: "Bowel cancer detection", provider: "A" }),
      article({ title: "Melanoma screening", provider: "B" }),
    ];
    const picked = selectTopicArticles(pool, "Cancer Screening", 2);
    expect(new Set(picked.map((p) => p.provider)).size).toBe(2);
  });

  it("falls back to newest when nothing matches", () => {
    const pool = [
      article({ title: "Old", date: "2020-01-01" }),
      article({ title: "New", date: "2026-05-01" }),
    ];
    const picked = selectTopicArticles(pool, "Zzz Unknown Topic", 1);
    expect(picked[0]?.title).toBe("New");
  });
});

describe("guidesHeadingFor", () => {
  it("builds a page-specific heading", () => {
    expect(guidesHeadingFor("Why Choose At Home Testing?")).toBe("At Home Home Guides".replace("Home Home", "Home"));
    expect(guidesHeadingFor("Women's Health")).toBe("Women's Health Guides");
  });
});
