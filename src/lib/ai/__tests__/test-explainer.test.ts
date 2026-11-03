import { describe, expect, it } from "vitest";
import {
  buildFallbackExplanation,
  extractJsonObject,
  isRateLimited,
  TEST_EXPLAINER_DISCLAIMER,
  TEST_EXPLAINER_MODEL,
  TEST_EXPLAINER_PROMPT_VERSION,
} from "../test-explainer.server";
import type { ExplainableTest } from "../test-explainer.types";

const sampleTest: ExplainableTest = {
  id: "11111111-2222-3333-4444-555555555555",
  testName: "Full Blood Count",
  providerName: "Medichecks",
  description: "A test measuring the cells in your blood.",
  price: 39,
  biomarkerCount: 18,
  biomarkersList: ["Haemoglobin", "White cell count", "Platelets"],
  sampleType: "Blood",
  collectionMethod: "Finger-prick home kit or clinic visit",
  turnaroundText: "2 working days",
  category: "general-wellness",
};

describe("buildFallbackExplanation", () => {
  it("builds a catalogue-only explanation with no model text", () => {
    const result = buildFallbackExplanation(sampleTest);
    expect(result.summary).toContain("Full Blood Count");
    expect(result.summary).toContain("Medichecks");
    expect(result.summary).toContain("18 biomarkers");
    expect(result.whatItMeasures).toEqual([
      "Haemoglobin",
      "White cell count",
      "Platelets",
    ]);
    expect(result.collectionExplained).toContain("Blood");
    expect(result.collectionExplained).toContain("2 working days");
  });

  it("caps the biomarker list at eight entries", () => {
    const many = {
      ...sampleTest,
      biomarkersList: Array.from({ length: 20 }, (_, i) => `Marker ${i}`),
    };
    expect(buildFallbackExplanation(many).whatItMeasures).toHaveLength(8);
  });

  it("handles missing optional fields without fabricating detail", () => {
    const sparse: ExplainableTest = {
      ...sampleTest,
      biomarkerCount: null,
      biomarkersList: null,
      sampleType: null,
      collectionMethod: null,
      turnaroundText: null,
      category: null,
    };
    const result = buildFallbackExplanation(sparse);
    expect(result.summary).toContain("Full Blood Count");
    expect(result.collectionExplained).toContain("provider's listing");
    expect(result.whatItMeasures).toHaveLength(1);
  });
});

describe("extractJsonObject", () => {
  it("parses a bare JSON object", () => {
    expect(extractJsonObject('{"summary":"ok"}')).toEqual({ summary: "ok" });
  });

  it("strips markdown fences before parsing", () => {
    expect(extractJsonObject('```json\n{"summary":"ok"}\n```')).toEqual({
      summary: "ok",
    });
  });

  it("returns null for non-JSON model text", () => {
    expect(extractJsonObject("Sorry, I cannot help with that.")).toBeNull();
  });
});

describe("isRateLimited", () => {
  it("allows the first six calls in a window and blocks the seventh", () => {
    const base = 1_000_000;
    for (let i = 0; i < 6; i += 1) {
      expect(isRateLimited(`test-ip-${base}`, base + i)).toBe(false);
    }
    expect(isRateLimited(`test-ip-${base}`, base + 6)).toBe(true);
  });

  it("resets after the window passes", () => {
    const base = 2_000_000;
    isRateLimited(`test-ip-reset-${base}`, base);
    expect(isRateLimited(`test-ip-reset-${base}`, base + 61_000)).toBe(false);
  });
});

describe("explainer constants", () => {
  it("uses a Claude model through the gateway", () => {
    expect(TEST_EXPLAINER_MODEL).toMatch(/^anthropic\/claude-/);
  });

  it("attaches a fixed, non-diagnostic disclaimer", () => {
    expect(TEST_EXPLAINER_DISCLAIMER).toContain("not medical advice");
    expect(TEST_EXPLAINER_DISCLAIMER).toContain("GP");
  });

  it("carries a prompt version for logging", () => {
    expect(TEST_EXPLAINER_PROMPT_VERSION).toMatch(/^test-explainer-v\d+$/);
  });
});
