import { afterEach, describe, expect, it, vi } from "vitest";
import { assistantChatFetch, ChatHistoryRejectedError } from "../chat-transport";

describe("assistant rejection transport", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("signals a restart for rejected history HTTP 400", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ error: "Invalid request." }),
      { status: 400, headers: { "X-Chat-Restart": "true" } },
    )));
    await expect(assistantChatFetch("/api/public/assistant")).rejects.toBeInstanceOf(ChatHistoryRejectedError);
  });

  it("preserves successful HTTP 200 responses", async () => {
    const response = new Response("ok", { status: 200 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    expect(await assistantChatFetch("/api/public/assistant")).toBe(response);
  });

  it("does not reset history for unrelated request errors", async () => {
    const response = new Response("Invalid request.", { status: 400 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    expect(await assistantChatFetch("/api/public/assistant")).toBe(response);
  });
});