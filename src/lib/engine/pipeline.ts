import { supabase } from "@/integrations/supabase/client";
import { PIPELINE_STAGES, SKILL_REGISTRY, type PipelineStage, type SkillId } from "./skills";
import type { ParseResult } from "./parser";

export interface StageRecord {
  stage: PipelineStage;
  status: "ok" | "fail" | "skipped";
  message: string;
  at: string;
}

export interface RunOutcome {
  runId: string;
  status: "completed" | "failed" | "blocked";
  stages: StageRecord[];
  finalMessage: string;
}

async function log(runId: string, skill: SkillId, stage: string, status: string, message: string, scope?: string) {
  await supabase.from("engine_audit_log").insert({
    run_id: runId, skill, stage, status, message, scope: scope ?? null,
  });
}

type RunPatch = Partial<{
  status: string; current_stage: string; stages: StageRecord[];
  completed_at: string; result: unknown;
}>;
async function updateRun(runId: string, patch: RunPatch) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from("engine_runs").update(patch as any).eq("id", runId);
}

export async function executePipeline(
  parsed: ParseResult,
  command: string,
  onStage?: (s: StageRecord) => void,
): Promise<RunOutcome> {
  const def = SKILL_REGISTRY[parsed.skill];
  const { data: runRow, error: runErr } = await supabase
    .from("engine_runs")
    .insert({
      command, skill: parsed.skill, scope: parsed.scope, notes: parsed.notes,
      parser: parsed.parser, status: "running", current_stage: "INIT", stages: [],
    })
    .select("id")
    .single();

  if (runErr || !runRow) throw new Error(runErr?.message ?? "Failed to create run");
  const runId = runRow.id as string;

  const stages: StageRecord[] = [];
  const record = async (stage: PipelineStage, status: StageRecord["status"], message: string) => {
    const rec: StageRecord = { stage, status, message, at: new Date().toISOString() };
    stages.push(rec);
    onStage?.(rec);
    await log(runId, parsed.skill, stage, status, message, parsed.scope);
    await updateRun(runId, { current_stage: stage, stages });
  };

  await record("INIT", "ok", `Skill ${parsed.skill} · scope: ${parsed.scope} · parser: ${parsed.parser}`);

  if (def.writes && parsed.skill !== "UNFREEZE" && parsed.scope !== "unspecified") {
    const { data: frozen } = await supabase
      .from("engine_freezes")
      .select("path, reason")
      .eq("active", true)
      .eq("path", parsed.scope)
      .maybeSingle();
    if (frozen) {
      await record("ANALYSE", "fail", `Target frozen: ${frozen.path} — ${frozen.reason}. Refusing per skill contract.`);
      await updateRun(runId, { status: "blocked", completed_at: new Date().toISOString() });
      return { runId, status: "blocked", stages, finalMessage: "Blocked: frozen target." };
    }
  }

  if (def.requiresScope && parsed.scope === "unspecified") {
    await record("ANALYSE", "fail", `${parsed.skill} requires an explicit scope (file or path).`);
    await updateRun(runId, { status: "failed", completed_at: new Date().toISOString() });
    return { runId, status: "failed", stages, finalMessage: "Scope required." };
  }

  await record("ANALYSE", "ok", `Rules enforced: ${def.hardRules.join(" · ")}`);
  await record("DESIGN", "ok", def.writes ? "Change plan drafted." : "Read-only plan.");

  try {
    if (parsed.skill === "FREEZE") {
      const { error } = await supabase.from("engine_freezes").upsert({
        path: parsed.scope, reason: parsed.notes || "No reason provided", active: true,
      }, { onConflict: "path" });
      if (error) throw error;
      await record("IMPLEMENT", "ok", `Froze ${parsed.scope}.`);
    } else if (parsed.skill === "UNFREEZE") {
      const { error } = await supabase.from("engine_freezes").update({
        active: false, unfrozen_at: new Date().toISOString(), unfreeze_reason: parsed.notes,
      }).eq("path", parsed.scope);
      if (error) throw error;
      await record("IMPLEMENT", "ok", `Unfroze ${parsed.scope}.`);
    } else if (parsed.skill === "CHECKPOINT") {
      const id = `cp-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12)}`;
      const files = parsed.scope === "unspecified" ? [] : parsed.scope.split(",").map((s) => s.trim());
      const { error } = await supabase.from("engine_checkpoints").insert({
        id, note: parsed.notes || command, files,
      });
      if (error) throw error;
      await record("IMPLEMENT", "ok", `Checkpoint ${id} saved.`);
    } else if (def.writes) {
      await record("IMPLEMENT", "ok", "Write skill acknowledged. Execute the code change in the linked agent.");
    } else {
      await record("IMPLEMENT", "skipped", "Read-only skill — no writes.");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await record("IMPLEMENT", "fail", msg);
    await updateRun(runId, { status: "failed", completed_at: new Date().toISOString() });
    return { runId, status: "failed", stages, finalMessage: msg };
  }

  await record("VERIFY", "ok", "Verification checklist queued: functional, security, perf, regression, data integrity.");
  await record("REGRESSION_CHECK", "ok", "No regressions declared. Manual re-test required for write skills.");
  await record("COMPLETE", "ok", `Run ${runId} complete.`);

  await updateRun(runId, { status: "completed", completed_at: new Date().toISOString() });
  return { runId, status: "completed", stages, finalMessage: `${parsed.skill} completed.` };
}

export { PIPELINE_STAGES };
