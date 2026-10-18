import { createOpenAI } from "@ai-sdk/openai";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createRunIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER))
      headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    runId ??=
      response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
    return response;
  };
}

/** Responses provider for Lovable AI; create one per request. */
export function createLovableResponsesProvider(apiKey: string) {
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: createRunIdFetch(),
  });
}
