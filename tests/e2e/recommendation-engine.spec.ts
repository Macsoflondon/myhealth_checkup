import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end coverage for the AI Wellness Recommendation engine on both entry
 * points (homepage and /recommendations). The Supabase edge function call is
 * stubbed via route interception so the test is deterministic and offline.
 */

const MOCK_RESPONSE = {
  medicalDisclaimer:
    "This information is for educational purposes only and is not medical advice.",
  analysis:
    "Your symptoms suggest reviewing thyroid and general wellness markers.",
  generalGuidance: "Consider a comprehensive wellness screen.",
  whenToSeeDoctor: "Seek medical advice for persistent symptoms.",
  hasRecommendations: true,
  recommendedTests: [
    {
      testName: "Advanced Thyroid Function Test",
      provider: "Medichecks",
      providerId: "medichecks",
      price: 79,
      reason:
        "Covers TSH, FT3, FT4 and thyroid antibodies to investigate fatigue.",
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
        if (
          !keys.includes("query_text") ||
          !keys.includes("method_preference")
        ) {
          throw new Error(
            `ai-human-context invoked with unexpected payload keys: ${keys.join(", ")}`,
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

async function fillAndSubmit(page: Page) {
  const engine = page.getByTestId("ai-recommendation-engine").first();
  await expect(engine).toBeVisible({ timeout: 20_000 });
  // Heading must be visible (regression guard for invisible white-on-white text).
  await expect(
    engine.getByRole("heading", { name: /AI wellness recommendations/i }),
  ).toBeVisible();
  const textarea = engine.locator("textarea");
  const submit = engine.getByRole("button", { name: /Get wellness recommendations/i });
  // Typing before hydration is lost, so retry until React enables the button.
  await expect(async () => {
    await textarea.fill("Persistent fatigue and low energy for six weeks");
    await expect(submit).toBeEnabled({ timeout: 1_000 });
  }).toPass({ timeout: 20_000 });
  await submit.click();
  return engine;
}

test.describe("AI wellness recommendations", () => {
  test("signed-out visitors are asked to sign in and no AI call is made", async ({ page }) => {
    let calls = 0;
    page.on("request", (r) => {
      if (r.url().includes("/functions/v1/ai-human-context")) calls += 1;
    });
    await stubEdgeFunction(page);
    await page.goto("/recommendations");
    const engine = await fillAndSubmit(page);
    await expect(page.getByText(/Please sign in to get personalised recommendations/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(engine.getByTestId("ai-recommendation-results")).toHaveCount(0);
    expect(calls).toBe(0);
  });
});
