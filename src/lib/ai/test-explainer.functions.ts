import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  explainTestHandler,
  listExplainableTestsHandler,
  validateExplainInput,
  type ExplainableTestOption,
} from "./test-explainer.handlers";
import type { TestExplainerResponse } from "./test-explainer.types";

export type { ExplainableTestOption } from "./test-explainer.handlers";

/**
 * Public server functions behind the homepage "Understand any test" panel.
 * Both are gated by TEST_EXPLAINER_ENABLED (test-explainer.config.ts): while
 * the section is archived, the list is empty and explain refuses before any
 * catalogue read or model call. Handler bodies live in
 * test-explainer.handlers.ts.
 */

export const listExplainableTests = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExplainableTestOption[]> => listExplainableTestsHandler(),
);

export const explainTestForVisitor = createServerFn({ method: "POST" })
  .inputValidator((input: { testId: string }) => validateExplainInput(input))
  .handler(async ({ data }): Promise<TestExplainerResponse> =>
    explainTestHandler(data, { headers: getRequest().headers }),
  );
