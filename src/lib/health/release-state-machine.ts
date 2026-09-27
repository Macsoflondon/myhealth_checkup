import type { ReleasePolicy, ReportStatus } from "@/types/health-intelligence";

/**
 * Result release state machine.
 *
 * A report is never visible to the person it belongs to until it reaches
 * `released`, and it only reaches `released` through a transition recorded in
 * `result_release_events`. The machine is pure so it can be exercised in tests
 * without a database.
 */

const ALLOWED_TRANSITIONS: Readonly<Record<ReportStatus, readonly ReportStatus[]>> = {
  draft: ["awaiting_review", "released", "cancelled"],
  awaiting_review: ["reviewed", "draft", "cancelled"],
  reviewed: ["released", "awaiting_review", "cancelled"],
  released: ["superseded"],
  superseded: [],
  cancelled: [],
};

export const canTransition = (from: ReportStatus, to: ReportStatus): boolean =>
  ALLOWED_TRANSITIONS[from].includes(to);

export const isTerminalStatus = (status: ReportStatus): boolean =>
  ALLOWED_TRANSITIONS[status].length === 0;

/** A released report is the only state the record owner may read. */
export const isVisibleToOwner = (status: ReportStatus): boolean =>
  status === "released";

export interface ReleaseTransition {
  readonly from: ReportStatus;
  readonly to: ReportStatus;
  readonly policy: ReleasePolicy;
  /** True when a named clinician is releasing, rather than the system. */
  readonly hasClinicianActor: boolean;
}

export interface TransitionRefusal {
  readonly ok: false;
  readonly reason: string;
}

export type TransitionOutcome = { readonly ok: true } | TransitionRefusal;

/**
 * Validate a proposed transition against both the machine and the release
 * policy configured for the report's source.
 */
export const evaluateTransition = (
  transition: ReleaseTransition,
): TransitionOutcome => {
  const { from, to, policy, hasClinicianActor } = transition;

  if (from === to) {
    return { ok: false, reason: "The report is already in that state." };
  }
  if (!canTransition(from, to)) {
    return { ok: false, reason: `A report cannot move from ${from} to ${to}.` };
  }
  if (to === "released" && policy === "clinician_review") {
    if (from !== "reviewed") {
      return {
        ok: false,
        reason: "This source requires clinician review before release.",
      };
    }
    if (!hasClinicianActor) {
      return {
        ok: false,
        reason: "A named clinician must be recorded as the releasing actor.",
      };
    }
  }
  return { ok: true };
};

/** The state a newly ingested report should start in, given its policy. */
export const initialStatusForPolicy = (policy: ReleasePolicy): ReportStatus =>
  policy === "clinician_review" ? "awaiting_review" : "draft";
