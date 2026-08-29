import { appendFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const auditScript = "scripts/audit-biomarker-references.mjs";
const ignoredDirectories = new Set([".git", ".output", "dist", "node_modules"]);
const targets = [
  "biomarkers_library",
  "biomarker_knowledge_hub",
  "biomarker_hub",
  "clinical_loinc_mappings",
  "clinical_snomed_mappings",
  "match_biomarkers",
];

const files = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;
    const absolutePath = resolve(directory, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) walk(absolutePath);
    else files.push(absolutePath);
  }
};

walk(root);

const matches = [];
for (const absolutePath of files) {
  const file = relative(root, absolutePath);
  if (file === auditScript) continue;

  let content;
  try {
    content = readFileSync(absolutePath, "utf8");
  } catch {
    continue;
  }

  content.split(/\r?\n/u).forEach((line, index) => {
    for (const target of targets) {
      if (line.includes(target)) matches.push({ file, line: index + 1, target, source: line.trim() });
    }
  });
}

const categoryFor = (file) => {
  if (file === "src/integrations/supabase/types.ts") return "generated type";
  if (file.startsWith("supabase/migrations/")) return "historical migration";
  return "runtime/support reference";
};

const counts = new Map();
for (const match of matches) {
  const category = categoryFor(match.file);
  counts.set(category, (counts.get(category) ?? 0) + 1);
  const annotation = category === "runtime/support reference" ? "warning" : "notice";
  console.log(`::${annotation} file=${match.file},line=${match.line}::${match.target} (${category})`);
  console.log(`${match.file}:${match.line}: ${match.source}`);
}

const summary = [
  "## Biomarker reference audit",
  "",
  `Found **${matches.length}** references across **${new Set(matches.map(({ file }) => file)).size}** files.`,
  "",
  "| Classification | References |",
  "| --- | ---: |",
  ...[...counts.entries()].map(([category, count]) => `| ${category} | ${count} |`),
  "",
  "Runtime/support references are emitted as warnings because they may become stale when biomarker tables or `match_biomarkers` are retired. Generated types and historical migrations are reported as notices.",
  "",
];

console.log(summary.join("\n"));
const stepSummary = process.env.GITHUB_STEP_SUMMARY;
if (stepSummary) appendFileSync(stepSummary, summary.join("\n"));