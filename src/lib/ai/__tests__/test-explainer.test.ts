import { beforeEach, describe, expect, it, vi } from "vitest";

const { streamTextMock, anthropicModelMock } = vi.hoisted(() => ({
  streamTextMock: vi.fn(),
  anthropicModelMock: vi.fn((id: string) => ({ modelId: id })),
}));

vi.mock("ai", () => ({ streamText: streamTextMock }));
vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: vi.fn(() => anthropicModelMock),
}));

import {
  buildFallbackExplanation,
  explainTest,
  explanationSchema,
  extractJsonObject,
  isRateLimited,
  TEST_EXPLAINER_DISCLAIMER,
  TEST_EXPLAINER_MAX_OUTPUT_TOKENS,
  TEST_EXPLAINER_MODEL,
  TEST_EXPLAINER_PROMPT_VERSION,
} from "../test-explainer.server";
import {
  isTestExplainerEnabled,
  TEST_EXPLAINER_ENABLED,
  TEST_EXPLAINER_SHARED_RATE_LIMIT,
} from "../test-explainer.config";
import {
  EXPLAINER_REFUSAL,
  explainTestHandler,
  listExplainableTestsHandler,
  validateExplainInput,
} from "../test-explainer.handlers";
import {
  normaliseIp,
  resolveClientAddress,
  trustedClientAddress,
} from "../client-address";
import {
  isExplainerRefusal,
  type ExplainableTest,
} from "../test-explainer.types";

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

describe("feature flag", () => {
  it("ships disabled", () => {
    expect(TEST_EXPLAINER_ENABLED).toBe(false);
    expect(TEST_EXPLAINER_SHARED_RATE_LIMIT).toBe(false);
    expect(isTestExplainerEnabled()).toBe(false);
  });

  it("fails closed until a shared rate limiter exists", () => {
    expect(
      isTestExplainerEnabled({ enabled: true, sharedRateLimit: false }),
    ).toBe(false);
    expect(
      isTestExplainerEnabled({ enabled: false, sharedRateLimit: true }),
    ).toBe(false);
    expect(
      isTestExplainerEnabled({ enabled: true, sharedRateLimit: true }),
    ).toBe(true);
  });
});

describe("server function handlers", () => {
  const validId = "11111111-2222-3333-4444-555555555555";

  it("still validates input while disabled", () => {
    expect(() => validateExplainInput({ testId: "nope" })).toThrow();
    expect(() => validateExplainInput(null)).toThrow();
    expect(validateExplainInput({ testId: validId })).toEqual({
      testId: validId,
    });
  });

  it("explain refuses by default without reading data or calling the model", async () => {
    const getClient = vi.fn();
    const explain = vi.fn();
    const result = await explainTestHandler(
      { testId: validId },
      {
        headers: new Headers({ "cf-connecting-ip": "203.0.113.9" }),
        getClient,
        explain,
      },
    );
    expect(result).toEqual(EXPLAINER_REFUSAL);
    expect(isExplainerRefusal(result)).toBe(true);
    expect(getClient).not.toHaveBeenCalled();
    expect(explain).not.toHaveBeenCalled();
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("list returns [] by default without reading data", async () => {
    const getClient = vi.fn();
    await expect(listExplainableTestsHandler({ getClient })).resolves.toEqual(
      [],
    );
    expect(getClient).not.toHaveBeenCalled();
  });

  it("passes only the trusted address to the explainer when enabled", async () => {
    const row = {
      id: validId,
      provider_name: "Medichecks",
      test_name: "Full Blood Count",
      description: null,
      price: 39,
      biomarker_count: 18,
      biomarkers_list: ["Haemoglobin"],
      sample_type: "Blood",
      collection_method: null,
      turnaround_days_text: null,
      category_primary: null,
      url: "https://example.test",
    };
    const query = {
      select: () => query,
      eq: () => query,
      maybeSingle: async () => ({ data: row, error: null }),
    };
    const client = { from: () => query };
    const explain = vi.fn(async (test: ExplainableTest) => ({
      explanation: buildFallbackExplanation(test),
      source: "fallback" as const,
      disclaimer: TEST_EXPLAINER_DISCLAIMER,
      promptVersion: TEST_EXPLAINER_PROMPT_VERSION,
      model: TEST_EXPLAINER_MODEL,
    }));
    await explainTestHandler(
      { testId: validId },
      {
        enabled: true,
        headers: new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }),
        getClient: () => client as never,
        explain,
      },
    );
    expect(explain).toHaveBeenCalledWith(
      expect.objectContaining({ id: validId }),
      null,
    );
  });
});

describe("explainTest model call", () => {
  const validJson = JSON.stringify({
    summary: "A full blood count looks at the cells in your blood.",
    whatItMeasures: ["Haemoglobin"],
    whoMightConsider: "People who want a general health check.",
    collectionExplained: "Blood sample, results in 2 working days.",
  });

  beforeEach(() => {
    streamTextMock.mockReset();
    streamTextMock.mockReturnValue({ text: Promise.resolve(validJson) });
    vi.stubEnv("LOVABLE_API_KEY", "test-key");
  });

  it("caps output tokens to what the schema needs", async () => {
    expect(TEST_EXPLAINER_MAX_OUTPUT_TOKENS).toBeGreaterThanOrEqual(700);
    expect(TEST_EXPLAINER_MAX_OUTPUT_TOKENS).toBeLessThanOrEqual(900);

    const result = await explainTest(
      { ...sampleTest, id: "cap-test-1" },
      "203.0.113.10",
      { enabled: true },
    );
    expect(result.source).toBe("ai");
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    const call = streamTextMock.mock.calls[0]?.[0] as {
      maxOutputTokens: number;
    };
    expect(call.maxOutputTokens).toBe(TEST_EXPLAINER_MAX_OUTPUT_TOKENS);
    expect(anthropicModelMock).toHaveBeenCalledWith(TEST_EXPLAINER_MODEL);
  });

  it("covers the longest answer the schema accepts", () => {
    const longest = {
      summary: "a".repeat(600),
      whatItMeasures: Array.from({ length: 8 }, () => "b".repeat(200)),
      whoMightConsider: "c".repeat(400),
      collectionExplained: "d".repeat(300),
    };
    expect(explanationSchema.safeParse(longest).success).toBe(true);
    const chars = JSON.stringify(longest).length;
    // About 4 characters per token for English prose.
    expect(Math.ceil(chars / 4)).toBeLessThanOrEqual(
      TEST_EXPLAINER_MAX_OUTPUT_TOKENS,
    );
  });

  it("keeps zod validation: invalid model output falls back", async () => {
    streamTextMock.mockReturnValue({
      text: Promise.resolve('{"summary":"too short"}'),
    });
    const result = await explainTest(
      { ...sampleTest, id: "cap-test-2" },
      "203.0.113.11",
      { enabled: true },
    );
    expect(result.source).toBe("fallback");
  });

  it("does not call the model when disabled", async () => {
    const result = await explainTest(
      { ...sampleTest, id: "cap-test-3" },
      "203.0.113.12",
    );
    expect(result.source).toBe("fallback");
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("does not call the model without a trusted address", async () => {
    const result = await explainTest(
      { ...sampleTest, id: "cap-test-4" },
      null,
      { enabled: true },
    );
    expect(result.source).toBe("fallback");
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});

describe("trusted client address", () => {
  it("prefers cf-connecting-ip over forwarded headers", () => {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.5",
      "x-forwarded-for": "1.1.1.1, 198.51.100.2",
      "x-real-ip": "9.9.9.9",
    });
    expect(resolveClientAddress(headers)).toEqual({
      address: "203.0.113.5",
      source: "cf-connecting-ip",
      trusted: true,
    });
    expect(trustedClientAddress(headers)).toBe("203.0.113.5");
  });

  it("never uses the caller-controlled first x-forwarded-for entry", () => {
    const headers = new Headers({
      "x-forwarded-for": "1.1.1.1, 198.51.100.2",
    });
    expect(resolveClientAddress(headers)).toEqual({
      address: "198.51.100.2",
      source: "x-forwarded-for-last",
      trusted: false,
    });
    expect(trustedClientAddress(headers)).toBeNull();
  });

  it("gives a forged x-forwarded-for no way to rotate the trusted key", () => {
    for (const forged of ["1.1.1.1", "2.2.2.2", "3.3.3.3"]) {
      expect(
        trustedClientAddress(
          new Headers({
            "cf-connecting-ip": "203.0.113.5",
            "x-forwarded-for": `${forged}, 198.51.100.2`,
          }),
        ),
      ).toBe("203.0.113.5");
    }
  });

  it("ignores x-real-ip and true-client-ip", () => {
    expect(
      resolveClientAddress(
        new Headers({ "x-real-ip": "9.9.9.9", "true-client-ip": "8.8.8.8" }),
      ),
    ).toBeNull();
  });

  it("rejects malformed header values", () => {
    expect(
      trustedClientAddress(new Headers({ "cf-connecting-ip": "evil" })),
    ).toBeNull();
    expect(normaliseIp("1.2.3.4:80")).toBeNull();
    expect(normaliseIp("999.1.1.1")).toBeNull();
    expect(normaliseIp("x".repeat(60))).toBeNull();
    expect(normaliseIp(" 192.0.2.1 ")).toBe("192.0.2.1");
    expect(normaliseIp("2001:DB8::1")).toBe("2001:db8::1");
    expect(normaliseIp("::ffff:192.0.2.1")).toBe("::ffff:192.0.2.1");
  });

  it("returns null when no header is present", () => {
    expect(resolveClientAddress(new Headers())).toBeNull();
    expect(trustedClientAddress(new Headers())).toBeNull();
  });
});
