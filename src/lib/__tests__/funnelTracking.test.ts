import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackFunnelEvent } from "@/lib/funnelTracking";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const TEST_ID = "dcc3f301-4eca-4b0c-bf67-33fa13c8854a";
const fetchMock = vi.fn();

function setConsent(analytics: boolean): void {
  window.Cookiebot = {
    consent: { necessary: true, statistics: analytics, marketing: false, preferences: false },
  };
}
const sentBody = (i = 0): Record<string, unknown> =>
  JSON.parse(String((fetchMock.mock.calls[i][1] as RequestInit).body));

describe("trackFunnelEvent", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    delete window.Cookiebot;
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends nothing and stores nothing without analytics consent", async () => {
    await trackFunnelEvent("quiz_start", { quiz_node_id: "gender" });
    setConsent(false);
    await trackFunnelEvent("quiz_start", { quiz_node_id: "gender" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("mhc_session_id")).toBeNull();
  });

  it("deletes the old cross-session id, with or without consent", async () => {
    localStorage.setItem("mhc_anon_id", "old-id");
    await trackFunnelEvent("quiz_start", { quiz_node_id: "gender" });
    expect(localStorage.getItem("mhc_anon_id")).toBeNull();
  });

  it("posts to the server endpoint only, never the database", async () => {
    setConsent(true);
    await trackFunnelEvent("provider_click", { provider_id: "medichecks", test_id: TEST_ID });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/public/quiz-event");
    const body = sentBody();
    expect(Object.keys(body).sort()).toEqual(
      ["event", "occurred_at", "provider_id", "session_id", "test_id"],
    );
    expect(body.session_id).toMatch(UUID);
  });

  it("reuses one session id within the tab session", async () => {
    setConsent(true);
    await trackFunnelEvent("quiz_start", { quiz_node_id: "gender" });
    await trackFunnelEvent("quiz_complete", { quiz_node_id: "f_2" });
    expect(sentBody(1).session_id).toBe(sentBody(0).session_id);
  });

  it("resolves quietly when the server refuses or the request throws", async () => {
    setConsent(true);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));
    await expect(trackFunnelEvent("quiz_start", { quiz_node_id: "gender" })).resolves.toBeUndefined();
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    await expect(trackFunnelEvent("quiz_start", { quiz_node_id: "gender" })).resolves.toBeUndefined();
  });

  it("skips the event when session storage is blocked", async () => {
    setConsent(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "mhc_session_id") throw new Error("SecurityError");
      return null;
    });
    await trackFunnelEvent("quiz_start", { quiz_node_id: "gender" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
