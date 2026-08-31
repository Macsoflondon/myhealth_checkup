#!/usr/bin/env node
/**
 * Heuristic dark-surface / dark-text contrast auditor.
 *
 * Walks JSX className strings, tracks the nearest enclosing dark surface by
 * brace depth, and flags descendants that set a dark foreground colour.
 * Purely static: confirm real hits visually before/after fixing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const DARK_SURFACE = [
  /\bbg-\[#0[0-9a-f]{5}\]/i,
  /\bbg-\[#1[0-3][0-9a-f]{4}\]/i,
  /\bbg-navy\b/,
  /\bbg-brand-navy\b/,
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:8|9)00\b/,
  /\bbg-black\b/,
  /\bfrom-\[#0[0-9a-f]{5}\]/i,
  /\bfrom-navy\b/,
  /\bfrom-brand-navy\b/,
  /\bfrom-(?:slate|gray|zinc|neutral|stone)-(?:8|9)00\b/,
];

const LIGHT_SURFACE = [
  /\bbg-white\b/,
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:50|100|200)\b/,
  /\bbg-background\b/,
  /\bbg-card\b/,
  /\bbg-\[#f[0-9a-f]{5}\]/i,
  /\bbg-\[#e[0-9a-f]{5}\]/i,
];

const DARK_TEXT = [
  /\btext-\[#0[0-9a-f]{5}\]/i,
  /\btext-navy\b/,
  /\btext-brand-navy\b/,
  /\btext-black\b/,
  /\btext-(?:slate|gray|zinc|neutral|stone)-(?:7|8|9)00\b/,
  /\btext-foreground\b/,
  /\btext-muted-foreground\b/,
];

const any = (patterns, s) => patterns.some((r) => r.test(s));

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'ui') continue;
      walkFiles(full, out);
    } else if (/\.tsx$/.test(entry) && !/\.(test|spec)\.tsx$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const CLASS_RE = /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{[^}]*?"([^"]*)"[^}]*?\})/g;

function auditFile(file) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const findings = [];
  /** stack of { depth, line } for open dark surfaces */
  const darkStack = [];
  let depth = 0;

  lines.forEach((line, i) => {
    const opens = (line.match(/</g) || []).length;
    const closes = (line.match(/<\//g) || []).length + (line.match(/\/>/g) || []).length;

    let m;
    CLASS_RE.lastIndex = 0;
    while ((m = CLASS_RE.exec(line)) !== null) {
      const cls = m[1] || m[2] || m[3] || m[4] || '';
      if (any(LIGHT_SURFACE, cls)) {
        // a light surface closes out the dark context for this subtree
        while (darkStack.length && darkStack[darkStack.length - 1].depth >= depth) darkStack.pop();
        continue;
      }
      if (any(DARK_SURFACE, cls)) {
        darkStack.push({ depth, line: i + 1 });
        continue;
      }
      if (darkStack.length && any(DARK_TEXT, cls)) {
        const token = DARK_TEXT.map((r) => (line.match(r) || [])[0]).filter(Boolean)[0];
        findings.push({
          file: relative(ROOT, file),
          line: i + 1,
          token,
          surfaceLine: darkStack[darkStack.length - 1].line,
        });
      }
    }

    depth += opens - closes;
    while (darkStack.length && darkStack[darkStack.length - 1].depth > depth) darkStack.pop();
  });

  return findings;
}

const all = walkFiles(SRC).flatMap(auditFile);

if (all.length === 0) {
  console.log('Contrast audit: no dark text on dark surfaces found.');
  process.exit(0);
}

const byFile = new Map();
for (const f of all) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

console.log(`Contrast audit: ${all.length} potential dark-on-dark hits in ${byFile.size} files\n`);
for (const [file, hits] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${file} (${hits.length})`);
  for (const h of hits) console.log(`  ${file}:${h.line}  ${h.token}  (surface at line ${h.surfaceLine})`);
}

process.exit(process.env['CONTRAST_AUDIT_STRICT'] === '1' ? 1 : 0);
