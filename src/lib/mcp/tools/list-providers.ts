import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";

function anonClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "list_providers",
  title: "List providers",
  description:
    "List all UKAS-accredited, CQC-regulated private diagnostic test providers compared on myhealth checkup, with the number of active tests each has.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await anonClient()
      .from("unified_provider_tests")
      .select("provider_id, provider_name");
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    const counts = new Map<string, { provider_id: string; provider_name: string; test_count: number }>();
    for (const row of data ?? []) {
      const key = row.provider_id ?? row.provider_name ?? "unknown";
      const existing = counts.get(key);
      if (existing) existing.test_count += 1;
      else counts.set(key, { provider_id: row.provider_id, provider_name: row.provider_name, test_count: 1 });
    }
    const providers = [...counts.values()].sort((a, b) => b.test_count - a.test_count);
    return {
      content: [{ type: "text", text: JSON.stringify(providers, null, 2) }],
      structuredContent: { providers },
    };
  },
});
