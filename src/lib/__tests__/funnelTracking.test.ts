import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ insert })) },
}));

import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelTracking";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function setConsent(analytics: boolean): void {
  window.Cookiebot = {
    consent: {
      necessary: true,
      statistics: analytics,
      marketing: false,
      preferences: false,
    },
  };
}

describe("trackFunnelEvent", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    delete window.Cookiebot;
    insert.mockReset();
    insert.mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("records nothing and stores nothing without analytics consent", async () => {
    await trackFunnelEvent("quiz_start");
    setConsent(false);
    await trackFunnelEvent("quiz_start");

    expect(insert).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("mhc_session_id")).toBeNull();
  });

  it("deletes the old cross-session id, with or without consent", async () => {
    localStorage.setItem("mhc_anon_id", "old-id");
    await trackFunnelEvent("quiz_start");
    expect(localStorage.getItem("mhc_anon_id")).toBeNull();
  });

  it("records the event with a per-session id and no persistent id once consent is given", async () => {
    setConsent(true);
    await trackFunnelEvent("provider_click", {
      provider_id: "medichecks",
      entity_type: "test",
      entity_id: "t-1",
      entity_name: "Thyroid Function Blood Test",
    });

    expect(supabase.from).toHaveBeenCalledWith("funnel_events");
    expect(insert).toHaveBeenCalledTimes(1);
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({
      funnel_stage: "provider_click",
      anonymous_id: null,
      provider_id: "medichecks",
      entity_type: "test",
      entity_id: "t-1",
      entity_name: "Thyroid Function Blood Test",
      revenue_amount: null,
    });
    expect(row.session_id).toMatch(UUID);
    expect(localStorage.getItem("mhc_anon_id")).toBeNull();
  });

  it("reuses one session id within the tab session", async () => {
    setConsent(true);
    await trackFunnelEvent("quiz_start");
    await trackFunnelEvent("quiz_complete");

    const [first, second] = insert.mock.calls.map((c) => c[0].session_id);
    expect(first).toMatch(UUID);
    expect(second).toBe(first);
  });

  it("resolves quietly when the database refuses the row", async () => {
    setConsent(true);
    insert.mockResolvedValue({
      error: { message: "new row violates row-level security policy" },
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(trackFunnelEvent("quiz_start")).resolves.toBeUndefined();
  });

  it("resolves quietly when the request throws", async () => {
    setConsent(true);
    insert.mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(trackFunnelEvent("quiz_start")).resolves.toBeUndefined();
  });

  it("skips the event when session storage is blocked", async () => {
    setConsent(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "mhc_session_id") throw new Error("SecurityError");
      return null;
    });

    await expect(trackFunnelEvent("quiz_start")).resolves.toBeUndefined();
    expect(insert).not.toHaveBeenCalled();
  });
});
