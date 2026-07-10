// Skill registry — hard limit 14, no additions permitted.
export type SkillId =
  | "PATCH" | "AUDIT" | "VERIFY" | "REGRESSION" | "SECURE" | "OPTIMISE"
  | "POLISH" | "DEBUG" | "FREEZE" | "UNFREEZE" | "REVERT" | "CHECKPOINT"
  | "RESUME" | "COMPLETE";

export interface SkillDef {
  id: SkillId;
  purpose: string;
  writes: boolean;
  requiresScope: boolean;
  hardRules: string[];
}

export const SKILL_REGISTRY: Record<SkillId, SkillDef> = {
  PATCH: { id: "PATCH", purpose: "Modify existing code", writes: true, requiresScope: true,
    hardRules: ["Touch only affected files", "Preserve unrelated logic", "No refactors outside scope", "Must run VERIFY after"] },
  AUDIT: { id: "AUDIT", purpose: "Full system inspection", writes: false, requiresScope: false,
    hardRules: ["Read-only", "Identify bugs, risks, regressions, perf, a11y", "No writes"] },
  VERIFY: { id: "VERIFY", purpose: "Validate implementation", writes: false, requiresScope: true,
    hardRules: ["Test functionality, security, UI, API", "No code changes"] },
  REGRESSION: { id: "REGRESSION", purpose: "Confirm prior functionality intact", writes: false, requiresScope: false,
    hardRules: ["Re-test all confirmed features", "Block COMPLETE if any regression"] },
  SECURE: { id: "SECURE", purpose: "Security hardening", writes: true, requiresScope: true,
    hardRules: ["OWASP ASVS / NCSC / Cyber Essentials Plus", "No functional change unless security-critical"] },
  OPTIMISE: { id: "OPTIMISE", purpose: "Performance", writes: true, requiresScope: true,
    hardRules: ["Behaviour must not change", "Perf only"] },
  POLISH: { id: "POLISH", purpose: "UI/UX refinement", writes: true, requiresScope: true,
    hardRules: ["Visual, spacing, animation, UX consistency only", "No logic"] },
  DEBUG: { id: "DEBUG", purpose: "Diagnose", writes: false, requiresScope: true,
    hardRules: ["Identify + root-cause only", "No fixes"] },
  FREEZE: { id: "FREEZE", purpose: "Lock stable component", writes: true, requiresScope: true,
    hardRules: ["Immutable until UNFREEZE", "Recorded in engine_freezes"] },
  UNFREEZE: { id: "UNFREEZE", purpose: "Unlock frozen component", writes: true, requiresScope: true,
    hardRules: ["Must state reason"] },
  REVERT: { id: "REVERT", purpose: "Roll back to last CHECKPOINT", writes: true, requiresScope: true,
    hardRules: ["Restore exact prior state"] },
  CHECKPOINT: { id: "CHECKPOINT", purpose: "Save state", writes: true, requiresScope: false,
    hardRules: ["Immutable reference for recovery", "Recorded in engine_checkpoints"] },
  RESUME: { id: "RESUME", purpose: "Continue from CHECKPOINT", writes: false, requiresScope: true,
    hardRules: ["Restore full context before continuing"] },
  COMPLETE: { id: "COMPLETE", purpose: "Close task", writes: false, requiresScope: false,
    hardRules: ["Only after all pipeline stages + verifications pass"] },
};

export const SKILLS: SkillId[] = Object.keys(SKILL_REGISTRY) as SkillId[];

export const NO_INTERPRETATION_DOMAINS = [
  "Clinical safety logic",
  "Consent & GDPR logic",
  "NHS integration workflows",
  "Security architecture boundaries",
  "AI output constraints",
] as const;

export const PIPELINE_STAGES = [
  "INIT", "ANALYSE", "DESIGN", "IMPLEMENT", "VERIFY", "REGRESSION_CHECK", "COMPLETE",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
