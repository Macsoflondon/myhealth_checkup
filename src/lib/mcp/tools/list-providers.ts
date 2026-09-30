import { defineTool } from "@lovable.dev/mcp-js";
import {
  anonClient,
  fail,
  inclusionFailures,
  ok,
  toNumber,
  type AccreditationFlags,
} from "../shared";

type ProviderRow = AccreditationFlags & {
  provider_id: string;
  provider_name: string | null;
  test_count: number | string;
  latest_updated_at: string | null;
};

export default defineTool({
  name: "list_providers",
  title: "List providers",
  description:
    "List the private diagnostic test providers compared on myhealth checkup that meet our inclusion rules (UKAS accreditation and CQC registration confirmed; ISO 15189 where applicable). Returns each provider's accreditation flags, number of active tests (add-ons excluded, counted exactly) and the latest updated_at date. Providers whose accreditation is not yet confirmed in our data are listed separately under excluded_providers with the reason.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const { data, error } = await anonClient().rpc("mcp_list_providers");
    if (error) return fail(error.message);
    const rows = (data ?? []) as ProviderRow[];
    const providers: Array<Record<string, unknown>> = [];
    const excluded: Array<Record<string, unknown>> = [];
    for (const row of rows) {
      const entry = {
        provider_id: row.provider_id,
        provider_name: row.provider_name,
        test_count: toNumber(row.test_count) ?? 0,
        lab_ukas_accredited: row.lab_ukas_accredited,
        lab_cqc_regulated: row.lab_cqc_regulated,
        lab_iso15189: row.lab_iso15189,
        updated_at: row.latest_updated_at,
      };
      const reasons = inclusionFailures(row);
      if (reasons.length === 0) providers.push(entry);
      else excluded.push({ provider_id: row.provider_id, reasons });
    }
    providers.sort((a, b) => Number(b.test_count) - Number(a.test_count));
    return ok({ providers, excluded_providers: excluded });
  },
});
