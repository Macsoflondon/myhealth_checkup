import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { anonClient, fail, ok, PRICE_NOTE } from "../shared";

export default defineTool({
  name: "find_tests_by_biomarker",
  title: "Find tests by biomarker",
  description:
    "Find tests whose biomarker list includes a biomarker name (case-insensitive, partial matches included and shown in matched_biomarkers), sorted by total expected cost from lowest. Add-on tests are excluded.",
  inputSchema: {
    biomarker: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .describe("Biomarker name, for example 'ferritin' or 'HbA1c'."),
    max_price: z
      .number()
      .positive()
      .optional()
      .describe("Maximum total expected cost in GBP."),
    limit: z.number().int().min(1).max(100).default(25),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ biomarker, max_price, limit }) => {
    const { data, error } = await anonClient().rpc("mcp_find_tests_by_biomarker", {
      p_name: biomarker,
      p_max_price: max_price ?? null,
      p_limit: limit,
    });
    if (error) return fail(error.message);
    const result = (data ?? { total_matches: 0, tests: [] }) as Record<string, unknown>;
    return ok({ biomarker, ...result, note: PRICE_NOTE });
  },
});
