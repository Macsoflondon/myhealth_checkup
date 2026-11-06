import { describe, expect, it } from "vitest";
import {
  handleQuizEvent,
  QUIZ_EVENTS_PER_WINDOW,
  type FunnelRow,
  type QuizEventDeps,
} from "../quiz-event";
import { QUIZ_NODE_IDS } from "../quiz-node-ids";

const NOW = Date.parse("2026-11-06T15:00:00Z");
const SESSION = "8b0e0e5e-1111-4222-8333-444455556666";
const TEST_ID = "dcc3f301-4eca-4b0c-bf67-33fa13c8854a";

function deps(over: Partial<QuizEventDeps> = {}) {
  const rows: FunnelRow[] = [];
  let hits = 0;
  const d: QuizEventDeps = {
    secret: "s",
    now: () => NOW,
    withinLimit: async () => ++hits <= QUIZ_EVENTS_PER_WINDOW,
    testBelongsTo: async (t, p) => t === TEST_ID && p === "medichecks",
    insert: async (r) => (rows.push(r), true),
    ...over,
  };
  return { d, rows };
}
const post = (body: unknown) =>
  new Request("http://x/api/public/quiz-event", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const start = { event: "quiz_start", session_id: SESSION, occurred_at: new Date(NOW).toISOString(), quiz_node_id: "gender" };
const click = { event: "provider_click", session_id: SESSION, occurred_at: new Date(NOW).toISOString() };

describe("quiz event endpoint", () => {
  it("records a valid quiz event with only the allowed columns", async () => {
    const { d, rows } = deps();
    expect((await handleQuizEvent(post(start), d)).status).toBe(204);
    expect(rows[0]).toEqual({
      session_id: SESSION, funnel_stage: "quiz_start", entity_type: "quiz_node",
      entity_id: "gender", provider_id: null, created_at: "2026-11-06T15:00:00.000Z",
    });
  });
  it("records a provider click for a catalogue test of that provider", async () => {
    const { d, rows } = deps();
    const r = await handleQuizEvent(post({ ...click, provider_id: "medichecks", test_id: TEST_ID }), d);
    expect(r.status).toBe(204);
    expect(rows[0]).toMatchObject({ entity_type: "test", entity_id: TEST_ID, provider_id: "medichecks" });
  });
  it("knows all 27 quiz nodes", () => expect(QUIZ_NODE_IDS).toHaveLength(27));

  it.each([
    ["unknown event", { ...start, event: "page_view" }],
    ["unknown quiz node", { ...start, quiz_node_id: "not_a_node" }],
    ["non-UUID session", { ...start, session_id: "abc" }],
    ["email field", { ...start, email: "a@b.com" }],
    ["free-text name", { ...start, entity_name: "Thyroid test" }],
    ["missing timestamp", { ...start, occurred_at: undefined }],
    ["stale timestamp", { ...start, occurred_at: "2026-11-06T13:00:00Z" }],
    ["click without test", { ...click, provider_id: "medichecks" }],
    ["banned provider", { ...click, provider_id: "thriva", test_id: TEST_ID }],
    ["test of another provider", { ...click, provider_id: "randox", test_id: TEST_ID }],
    ["malformed JSON", "{not json"],
  ])("rejects %s with 400", async (_n, body) => {
    const { d, rows } = deps();
    expect((await handleQuizEvent(post(body), d)).status).toBe(400);
    expect(rows).toHaveLength(0);
  });

  it("rejects bodies over 4 KB with 413", async () => {
    const { d } = deps();
    expect((await handleQuizEvent(post({ ...start, pad: "x".repeat(5000) }), d)).status).toBe(413);
  });

  it("allows 60 events per window and refuses the 61st with 429", async () => {
    const { d, rows } = deps();
    const codes: number[] = [];
    for (let i = 0; i < 61; i++) codes.push((await handleQuizEvent(post(start), d)).status);
    expect(codes.slice(0, 60).every((c) => c === 204)).toBe(true);
    expect(codes[60]).toBe(429);
    expect(rows).toHaveLength(60);
  });
});
