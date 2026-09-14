import { describe, expect, it } from "vitest";
import {
  canTransition,
  evaluateTransition,
  initialStatusForPolicy,
  isTerminalStatus,
  isVisibleToOwner,
} from "@/lib/health/release-state-machine";

describe("release state machine", () => {
  it("only makes a released report visible to its owner", () => {
    expect(isVisibleToOwner("released")).toBe(true);
    for (const status of ["draft", "awaiting_review", "reviewed", "superseded", "cancelled"] as const) {
      expect(isVisibleToOwner(status)).toBe(false);
    }
  });

  it("treats superseded and cancelled as terminal", () => {
    expect(isTerminalStatus("superseded")).toBe(true);
    expect(isTerminalStatus("cancelled")).toBe(true);
    expect(isTerminalStatus("released")).toBe(false);
  });

  it("refuses to un-release a report", () => {
    expect(canTransition("released", "draft")).toBe(false);
    expect(canTransition("released", "superseded")).toBe(true);
  });

  it("refuses a repeated transition", () => {
    const outcome = evaluateTransition({
      from: "draft",
      to: "draft",
      policy: "manual",
      hasClinicianActor: false,
    });
    expect(outcome.ok).toBe(false);
  });

  it("blocks release straight from draft when clinician review is required", () => {
    const outcome = evaluateTransition({
      from: "draft",
      to: "released",
      policy: "clinician_review",
      hasClinicianActor: true,
    });
    expect(outcome).toEqual({
      ok: false,
      reason: "This source requires clinician review before release.",
    });
  });

  it("requires a named clinician actor under a clinician review policy", () => {
    const outcome = evaluateTransition({
      from: "reviewed",
      to: "released",
      policy: "clinician_review",
      hasClinicianActor: false,
    });
    expect(outcome).toEqual({
      ok: false,
      reason: "A named clinician must be recorded as the releasing actor.",
    });
  });

  it("allows a reviewed report to be released by a named clinician", () => {
    expect(
      evaluateTransition({
        from: "reviewed",
        to: "released",
        policy: "clinician_review",
        hasClinicianActor: true,
      }),
    ).toEqual({ ok: true });
  });

  it("allows immediate release when the source policy permits it", () => {
    expect(
      evaluateTransition({
        from: "draft",
        to: "released",
        policy: "immediate",
        hasClinicianActor: false,
      }),
    ).toEqual({ ok: true });
  });

  it("starts clinician-reviewed sources awaiting review", () => {
    expect(initialStatusForPolicy("clinician_review")).toBe("awaiting_review");
    expect(initialStatusForPolicy("immediate")).toBe("draft");
    expect(initialStatusForPolicy("manual")).toBe("draft");
  });
});
