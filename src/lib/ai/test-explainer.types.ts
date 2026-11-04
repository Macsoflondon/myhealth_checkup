/**
 * Client-safe shared types for the homepage test explainer. Both the
 * server-only module and the public server functions import from here so no
 * `.server.ts` file is ever reachable from the client bundle.
 */

export interface ExplainableTest {
  id: string;
  testName: string;
  providerName: string;
  description: string | null;
  price: number | null;
  biomarkerCount: number | null;
  biomarkersList: string[] | null;
  sampleType: string | null;
  collectionMethod: string | null;
  turnaroundText: string | null;
  category: string | null;
}

export interface TestExplanation {
  summary: string;
  whatItMeasures: string[];
  whoMightConsider: string;
  collectionExplained: string;
}

export interface TestExplainerResult {
  explanation: TestExplanation;
  source: "ai" | "fallback";
  disclaimer: string;
  promptVersion: string;
  model: string;
}

/** Returned instead of an explanation when the explainer will not answer. */
export interface TestExplainerRefusal {
  refused: true;
  reason: "disabled";
  message: string;
}

export type TestExplainerResponse =
  TestExplainerResult | TestExplainerRefusal | null;

export function isExplainerRefusal(
  value: TestExplainerResponse,
): value is TestExplainerRefusal {
  return value !== null && "refused" in value && value.refused === true;
}
