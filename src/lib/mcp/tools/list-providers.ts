import { defineTool } from "@lovable.dev/mcp-js";
import {
  anonClient,
  fail,
  ok,
  toNumber,
  type AccreditationFlags,
  withAccreditation,
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
    "List every private diagnostic test provider compared on myhealth checkup. Each provider carries its accreditation flags (lab_ukas_accredited, lab_cqc_regulated, lab_iso15189; null means not yet recorded) and an accreditation_status: confirmed (UKAS and CQC both true), not_confirmed (a flag is not recorded) or failed (a flag is recorded as false). Only treat a provider as accredited when the status is confirmed. Also returns the number of active tests (add-ons excluded, counted exactly) and the latest updated_at date.",
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
    const providers = rows.map((row) =>
      withAccreditation({
        provider_id: row.provider_id,
        provider_name: row.provider_name,
        test_count: toNumber(row.test_count) ?? 0,
        lab_ukas_accredited: row.lab_ukas_accredited,
        lab_cqc_regulated: row.lab_cqc_regulated,
        lab_iso15189: row.lab_iso15189,
        updated_at: row.latest_updated_at,
      }),
    );
    providers.sort((a, b) => b.test_count - a.test_count);
    return ok({ providers });
  },
});
