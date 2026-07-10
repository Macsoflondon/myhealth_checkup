import { SKILLS, type SkillId } from "./skills";
import { supabase } from "@/integrations/supabase/client";

export interface ParseResult {
  skill: SkillId;
  scope: string;
  notes: string;
  confidence: number;
  parser: "deterministic" | "ai" | "explicit";
  rationale: string;
}

const BRACKET_RX = /^\s*\[(\w+)\]\s*(.*)$/s;
const SEPARATOR_RX = /\s+[—–-]\s+/;

const KEYWORD_MAP: Array<{ skill: SkillId; patterns: RegExp[] }> = [
  { skill: "FREEZE", patterns: [/\bfreeze\b/i, /\block\s+(this|the)\s+/i] },
  { skill: "UNFREEZE", patterns: [/\bunfreeze\b/i, /\bunlock\b/i] },
  { skill: "CHECKPOINT", patterns: [/\bcheckpoint\b/i, /\bsnapshot\b/i, /\bsave\s+state\b/i] },
  { skill: "REVERT", patterns: [/\brevert\b/i, /\broll\s*back\b/i, /\brestore\s+(the\s+)?checkpoint\b/i] },
  { skill: "RESUME", patterns: [/\bresume\b/i, /\bcontinue\s+from\b/i] },
  { skill: "COMPLETE", patterns: [/\bcomplete\b/i, /\bclose\s+(the\s+)?task\b/i, /\bmark\s+done\b/i] },
  { skill: "AUDIT", patterns: [/\baudit\b/i, /\binspect\b/i, /\breview\s+(the\s+)?(code|system)\b/i, /\bscan\b/i] },
  { skill: "VERIFY", patterns: [/\bverify\b/i, /\bvalidate\b/i, /\btest\s+that\b/i] },
  { skill: "REGRESSION", patterns: [/\bregression\b/i, /\bre-?test\b/i] },
  { skill: "SECURE", patterns: [/\bsecure\b/i, /\bharden\b/i, /\bsecurity\s+fix\b/i, /\bowasp\b/i] },
  { skill: "OPTIMISE", patterns: [/\boptimi[sz]e\b/i, /\bperformance\b/i, /\bspeed\s+up\b/i] },
  { skill: "POLISH", patterns: [/\bpolish\b/i, /\bui\s+tweak\b/i, /\bspacing\b/i, /\bux\b/i] },
  { skill: "DEBUG", patterns: [/\bdebug\b/i, /\bdiagnose\b/i, /\bwhy\s+is\b/i, /\broot\s+cause\b/i] },
  { skill: "PATCH", patterns: [/\bpatch\b/i, /\bfix\b/i, /\bupdate\b/i, /\bchange\b/i, /\bedit\b/i, /\bmodify\b/i] },
];

export function parseDeterministic(command: string): ParseResult | null {
  const trimmed = command.trim();
  if (!trimmed) return null;

  const bracket = BRACKET_RX.exec(trimmed);
  if (bracket) {
    const raw = bracket[1].toUpperCase() as SkillId;
    if (SKILLS.includes(raw)) {
      const rest = (bracket[2] ?? "").trim();
      const sepMatch = rest.match(SEPARATOR_RX);
      let scope = "";
      let notes = "";
      if (sepMatch && sepMatch.index !== undefined) {
        scope = rest.slice(0, sepMatch.index).trim();
        notes = rest.slice(sepMatch.index + sepMatch[0].length).trim();
      } else {
        scope = rest;
      }
      return {
        skill: raw,
        scope: scope || "unspecified",
        notes: notes || scope || trimmed,
        confidence: 1,
        parser: "explicit",
        rationale: "Explicit bracket command.",
      };
    }
  }

  for (const { skill, patterns } of KEYWORD_MAP) {
    if (patterns.some((p) => p.test(trimmed))) {
      return {
        skill,
        scope: extractScope(trimmed),
        notes: trimmed,
        confidence: 0.7,
        parser: "deterministic",
        rationale: `Matched keyword pattern for ${skill}.`,
      };
    }
  }
  return null;
}

function extractScope(text: string): string {
  const path = /([a-zA-Z0-9_\-./]+\.[a-zA-Z]{1,5})/.exec(text);
  if (path) return path[1];
  const quoted = /["'`]([^"'`]+)["'`]/.exec(text);
  if (quoted) return quoted[1];
  return "unspecified";
}

export async function parseWithAiFallback(command: string): Promise<ParseResult> {
  const det = parseDeterministic(command);
  if (det && det.confidence >= 0.7) return det;

  const { data, error } = await supabase.functions.invoke("parse-command", { body: { command } });
  if (error || !data || typeof data !== "object" || !("skill" in data)) {
    return det ?? {
      skill: "AUDIT", scope: "unspecified", notes: command, confidence: 0,
      parser: "deterministic", rationale: "No match; defaulting to AUDIT (read-only).",
    };
  }
  const d = data as { skill: SkillId; scope: string; notes: string; confidence: number; rationale: string };
  return {
    skill: d.skill, scope: d.scope || "unspecified", notes: d.notes || command,
    confidence: d.confidence ?? 0.5, parser: "ai", rationale: d.rationale ?? "AI-parsed.",
  };
}
