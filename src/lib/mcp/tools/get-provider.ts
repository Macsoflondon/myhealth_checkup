import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  anonClient,
  fail,
  inclusionFailures,
  ok,
  PRICE_NOTE,
  type AccreditationFlags,
} from "../shared";

export default defineTool({
  name: "get_provider",
  title: "Get provider",
  description:
    "Profile for one provider that meets our inclusion rules: name, accreditation flags, number of active tests, home kit and clinic collection options, location options, typical (median) phlebotomy and GP review fees, and the latest updated_at date.",
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
    const reasons = inclusionFailures(provider);
    if (reasons.length > 0)
      return fail(
        `This provider is not listed because it does not yet meet our inclusion rules: ${reasons.join("; ")}.`,
      );
    return ok({ provider, note: PRICE_NOTE });
  },
});
