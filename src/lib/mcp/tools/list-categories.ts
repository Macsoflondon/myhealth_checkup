import { defineTool } from "@lovable.dev/mcp-js";
import { anonClient, fail, ok, toNumber } from "../shared";

type CategoryRow = {
  slug: string;
  name: string;
  active_tests: number | string;
  providers: number | string;
};

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description:
    "List test category slugs and names with the number of active tests and providers in each. Use these slugs for the category filter in search_tests.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const { data, error } = await anonClient().rpc("mcp_list_categories");
    if (error) return fail(error.message);
    const categories = ((data ?? []) as CategoryRow[]).map((c) => ({
      slug: c.slug,
      name: c.name,
      active_tests: toNumber(c.active_tests) ?? 0,
      providers: toNumber(c.providers) ?? 0,
    }));
    return ok({ categories });
  },
});
