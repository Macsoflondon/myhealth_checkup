import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end coverage for the AI Wellness Recommendation engine on both entry
 * points (homepage and /recommendations). The Supabase edge function call is
 * stubbed via route interception so the test is deterministic and offline.
 */

const MOCK_RESPONSE = {
  medicalDisclaimer:
    "This information is for educational purposes only and is not medical advice.",
  analysis: "Your symptoms suggest reviewing thyroid and general wellness markers.",
  generalGuidance: "Consider a comprehensive wellness screen.",
  whenToSeeDoctor: "Seek medical advice for persistent symptoms.",
  hasRecommendations: true,
  recommendedTests: [
    {
      testName: "Advanced Thyroid Function Test",
      provider: "Medichecks",
      providerId: "medichecks",
      price: 79,
      reason: "Covers TSH, FT3, FT4 and thyroid antibodies to investigate fatigue.",
      category: "Thyroid",
      urgency: "medium",
      confidence: 92,
    },
  ],
};

async function stubEdgeFunction(page: Page) {
  await page.route("**/functions/v1/ai-human-context", async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      const payload = request.postDataJSON() as Record<string, unknown> | null;
      // Guard against regressions to the old key names.
      if (payload) {
        const keys = Object.keys(payload);
        if (!keys.includes("query_text") || !keys.includes("method_preference")) {
          throw new Error(
            `ai-human-context invoked with unexpected payload keys: ${keys.join(", ")}`
          );
        }
      }
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(MOCK_RESPONSE),
    });
  });
}

async function submitAndAssert(page: Page) {
  const engine = page.getByTestId("ai-recommendation-engine").first();
  await expect(engine).toBeVisible();

  // Heading must be visible (regression guard for invisible white-on-white text).
  await expect(engine.getByRole("heading", { name: /AI Wellness Recommendations/i }))
    .toBeVisible();

  const textarea = engine.locator("textarea");
  await textarea.fill("Persistent fatigue and low energy for six weeks");

  await engine.getByRole("button", { name: /Get Wellness Recommendations/i }).click();

  const results = engine.getByTestId("ai-recommendation-results");
  await expect(results).toBeVisible({ timeout: 10_000 });
  await expect(results).toContainText("Advanced Thyroid Function Test");
  await expect(results).toContainText("Medichecks");
}

test.describe("AI Wellness Recommendations", () => {
  test("renders recommendations on the homepage", async ({ page }) => {
    await stubEdgeFunction(page);
    await page.goto("/");
    // Scroll the engine into view — it's lazy-loaded below the hero.
    const engine = page.getByTestId("ai-recommendation-engine").first();
    await engine.scrollIntoViewIfNeeded();
    await submitAndAssert(page);
  });

  test("renders recommendations on /recommendations", async ({ page }) => {
    await stubEdgeFunction(page);
    await page.goto("/recommendations");
    await submitAndAssert(page);
  });
});
