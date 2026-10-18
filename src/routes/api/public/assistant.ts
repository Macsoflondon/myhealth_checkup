import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import {
  convertToModelMessages,
  isStepCount,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  ASSISTANT_INSTRUCTIONS,
  ASSISTANT_MAX_HISTORY,
  ASSISTANT_MODEL,
  createRateLimiter,
  sanitiseUserText,
} from "@/lib/assistant/assistant-prompt";
import {
  createLovableAiGatewayRunIdFetch,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/assistant/run-id";
import type { Database } from "@/integrations/supabase/types";

// Public, sign-in free: bounded by a per-address limit and input caps.
const allow = createRateLimiter(10, 60_000);

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function catalogueClient() {
  const url = process.env["SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (
          key.startsWith("sb_") &&
          headers.get("Authorization") === `Bearer ${key}`
        )
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function sanitiseMessages(raw: unknown): UIMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  return (raw as UIMessage[]).slice(-ASSISTANT_MAX_HISTORY).map((m) =>
    m.role === "user"
      ? {
          ...m,
          parts: m.parts.flatMap((p) =>
            p.type === "text" ? [{ ...p, text: sanitiseUserText(p.text) }] : [],
          ),
        }
      : m,
  );
}

async function handle(request: Request): Promise<Response> {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!allow(ip))
    return json(429, "You're sending messages quickly. Please wait a minute.");

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return json(500, "The assistant is not configured.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = sanitiseMessages(
    typeof body === "object" && body !== null && "messages" in body
      ? (body as { messages: unknown }).messages
      : null,
  );
  if (!messages) return json(400, "Invalid request.");

  const db = catalogueClient();
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(ASSISTANT_MODEL),
    instructions: ASSISTANT_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    maxRetries: 0,
    stopWhen: isStepCount(4),
    tools: {
      search_tests: tool({
        description:
          "Search the live myhealth checkup catalogue by test name or biomarker. Returns up to 8 active tests, cheapest first.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("Test name or biomarker, e.g. 'thyroid' or 'ferritin'"),
          provider_id: z
            .string()
            .nullable()
            .describe("Optional provider id such as 'medichecks', or null"),
        }),
        execute: async ({ query, provider_id }) => {
          if (!db) return { error: "Catalogue unavailable" };
          const term = query
            .replace(/[%,()]/g, " ")
            .trim()
            .slice(0, 80);
          if (!term) return { tests: [] };
          let q = db
            .from("unified_provider_tests")
            .select(
              "id, provider_id, provider_name, test_name, price, total_expected_cost, biomarkers_list, biomarker_count, turnaround_days_text, sample_type, home_kit_available, clinic_visit_available, updated_at",
            )
            .ilike("test_name", `%${term}%`)
            .eq("is_addon", false)
            .gt("price", 0)
            .neq("provider_id", "thriva")
            .order("price")
            .limit(24);
          if (provider_id) q = q.eq("provider_id", provider_id);
          const { data, error } = await q;
          if (error) return { error: "Search failed" };
          const seen = new Set<string>();
          const tests = (data ?? [])
            .filter((r) => r.id && !seen.has(r.id) && seen.add(r.id))
            .slice(0, 8)
            .map((r) => ({
              id: r.id,
              providerId: r.provider_id,
              provider: r.provider_name,
              name: r.test_name,
              priceGbp: r.price,
              totalExpectedCostGbp: r.total_expected_cost ?? r.price,
              biomarkers: Array.isArray(r.biomarkers_list)
                ? r.biomarkers_list.slice(0, 40)
                : [],
              biomarkerCount: r.biomarker_count,
              turnaround: r.turnaround_days_text,
              sampleType: r.sample_type,
              homeKit: r.home_kit_available,
              clinic: r.clinic_visit_available,
              updatedAt: r.updated_at,
            }));
          return { tests };
        },
      }),
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
    }),
    runIdFetch,
  );
}

export const Route = createFileRoute("/api/public/assistant")({
  server: { handlers: { POST: ({ request }) => handle(request) } },
});
