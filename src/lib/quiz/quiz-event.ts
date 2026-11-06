import { z } from "zod";
import { AFFILIATE_PROVIDERS } from "@/lib/affiliate/affiliate-config";
import { isQuizNodeId } from "./quiz-node-ids";

export const QUIZ_EVENT_NAMES = ["quiz_start", "quiz_complete", "provider_click"] as const;
export type QuizEventName = (typeof QUIZ_EVENT_NAMES)[number];

export const QUIZ_EVENT_ENDPOINT = "/api/public/quiz-event";
export const MAX_QUIZ_EVENT_BYTES = 4_096;
/** Events allowed per visitor (hashed address) per 10-minute window. */
export const QUIZ_EVENTS_PER_WINDOW = 60;
/** Accepted clock difference between the browser timestamp and the server. */
export const QUIZ_EVENT_CLOCK_SKEW_MS = 10 * 60_000;

const uuid = z.string().uuid();

/** Strict shape: unknown keys (email, name, free text…) are rejected, not dropped. */
export const quizEventSchema = z
  .object({
    event: z.enum(QUIZ_EVENT_NAMES),
    session_id: uuid,
    occurred_at: z.string().datetime({ offset: true }),
    quiz_node_id: z.string().refine(isQuizNodeId).optional(),
    provider_id: z
      .string()
      .refine((p) => Object.prototype.hasOwnProperty.call(AFFILIATE_PROVIDERS, p))
      .optional(),
    test_id: uuid.optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const isClick = v.event === "provider_click";
    const ok = isClick
      ? v.provider_id !== undefined && v.test_id !== undefined && v.quiz_node_id === undefined
      : v.quiz_node_id !== undefined && v.provider_id === undefined && v.test_id === undefined;
    if (!ok) ctx.addIssue({ code: "custom", message: "fields do not match event" });
  });

export type QuizEvent = z.infer<typeof quizEventSchema>;

export type FunnelRow = {
  session_id: string;
  funnel_stage: QuizEventName;
  entity_type: "quiz_node" | "test";
  entity_id: string;
  provider_id: string | null;
  created_at: string;
};

/** The only columns written. No user, name, email, IP or user agent. */
export function toFunnelRow(e: QuizEvent): FunnelRow {
  const isClick = e.event === "provider_click";
  return {
    session_id: e.session_id,
    funnel_stage: e.event,
    entity_type: isClick ? "test" : "quiz_node",
    entity_id: (isClick ? e.test_id : e.quiz_node_id) ?? "",
    provider_id: isClick ? (e.provider_id ?? null) : null,
    created_at: new Date(e.occurred_at).toISOString(),
  };
}

export type QuizEventDeps = {
  secret: string;
  withinLimit: (request: Request) => Promise<boolean>;
  testBelongsTo: (testId: string, providerId: string) => Promise<boolean>;
  insert: (row: FunnelRow) => Promise<boolean>;
  now?: () => number;
};

export async function handleQuizEvent(request: Request, deps: QuizEventDeps): Promise<Response> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_QUIZ_EVENT_BYTES) return new Response(null, { status: 413 });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_QUIZ_EVENT_BYTES) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = quizEventSchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });
  const now = (deps.now ?? Date.now)();
  if (Math.abs(new Date(parsed.data.occurred_at).getTime() - now) > QUIZ_EVENT_CLOCK_SKEW_MS) {
    return new Response(null, { status: 400 });
  }
  const e = parsed.data;
  if (e.event === "provider_click" && e.test_id && e.provider_id) {
    if (!(await deps.testBelongsTo(e.test_id, e.provider_id))) {
      return new Response(null, { status: 400 });
    }
  }
  if (!(await deps.withinLimit(request))) {
    return new Response(null, { status: 429, headers: { "retry-after": "600" } });
  }
  const ok = await deps.insert(toFunnelRow(e));
  return new Response(null, { status: ok ? 204 : 502 });
}
