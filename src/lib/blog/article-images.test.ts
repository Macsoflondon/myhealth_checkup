import { describe, expect, it } from "vitest";
import { articleFallbackImage, isArticleImage } from "./article-images";

describe("article image selection", () => {
  it("rejects the Lola logo as article artwork", () => {
    expect(isArticleImage("https://lolahealth.com/cdn/shop/files/lola-health-logo.png")).toBe(false);
  });
  it("accepts a secure provider article photo", () => {
    expect(isArticleImage("https://www.medichecks.com/cdn/shop/articles/heart.jpg")).toBe(true);
  });
  it("uses distinct local imagery for nutrition and clinical topics", () => {
    expect(articleFallbackImage({ title: "Vitamin D", category: "Vitamins" })).not.toBe(articleFallbackImage({ title: "Thyroid markers", category: "Thyroid" }));
  });
});