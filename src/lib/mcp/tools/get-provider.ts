import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  anonClient,
  fail,
  ok,
  PRICE_NOTE,
  type AccreditationFlags,
  withAccreditation,
} from "../shared";

export default defineTool({
  name: "get_provider",
  title: "Get provider",
  description:
    "Profile for one provider: name, accreditation flags with accreditation_status (confirmed, not_confirmed or failed; only confirmed means UKAS and CQC are both recorded as true), number of active tests, home kit and clinic collection options, location options, typical (median) phlebotomy and GP review fees, and the latest updated_at date.",
  inputSchema: {
    provider_id: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .describe("Provider id from list_providers, for example 'randox'."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ provider_id }) => {
    const { data, error } = await anonClient().rpc("mcp_get_provider", {
      p_provider_id: provider_id,
    });
    if (error) return fail(error.message);
    if (!data) return fail("Provider not found.");
    const provider = data as AccreditationFlags & Record<string, unknown>;
    return ok({ provider: withAccreditation(provider), note: PRICE_NOTE });
  },
});
