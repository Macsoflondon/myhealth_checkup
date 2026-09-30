import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { anonClient, fail, ok, PRICE_NOTE   withAccreditation,
  type AccreditationFlags,
} from "../shared";

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
    const result = (data ?? { total_matches: 0, tests: [] }) as {
      total_matches?: number;
      tests?: Array<Record<string, unknown> & { provider_id?: string }>;
    };
    const tests = result.tests ?? [];
    const providerIds = [
      ...new Set(tests.map((t) => t.provider_id).filter((p): p is string => !!p)),
    ];
    const flagsByProvider = new Map<string, AccreditationFlags>();
    if (providerIds.length > 0) {
      const { data: provs, error: pErr } = await anonClient().rpc("mcp_list_providers");
      if (pErr) return fail(pErr.message);
      for (const p of (provs ?? []) as Array<AccreditationFlags & { provider_id: string }>)
        flagsByProvider.set(p.provider_id, p);
    }
    return ok({
      biomarker,
      total_matches: result.total_matches ?? 0,
      tests: tests.map((t) => {
        const f = t.provider_id ? flagsByProvider.get(t.provider_id) : undefined;
        return withAccreditation({
          ...t,
          lab_ukas_accredited: f?.lab_ukas_accredited ?? null,
          lab_cqc_regulated: f?.lab_cqc_regulated ?? null,
          lab_iso15189: f?.lab_iso15189 ?? null,
        });
      }),
      note: PRICE_NOTE,
    });
  },
});
