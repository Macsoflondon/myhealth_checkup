#!/usr/bin/env node
/**
 * Dark-surface / dark-text contrast auditor.
 *
 * Parses each .tsx file with the TypeScript compiler API, walks the real JSX
 * tree, tracks the nearest enclosing background surface, and reports any
 * element that paints a dark foreground colour inside a dark surface.
 *
 * Usage:
 *   node scripts/audit-contrast.mjs            # report only
 *   CONTRAST_AUDIT_STRICT=1 node ...           # non-zero exit on findings (CI)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const DARK_SURFACE = [
  /\bbg-\[#0[0-9a-f]{5}\]/i,
  /\bbg-\[#1[0-2][0-9a-f]{4}\]/i,
  /\bbg-navy\b/,
  /\bbg-brand-navy\b/,
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:800|900|950)\b/,
  /\bbg-black\b/,
  /\bbg-gradient-to-[a-z]{1,2}\b(?=[^"']*\bfrom-(?:\[#0|navy|brand-navy|slate-9|slate-8|gray-9|gray-8))/,
];

const LIGHT_SURFACE = [
  /\bbg-white\b/,
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:50|100|200|300)\b/,
  /\bbg-background\b/,
  /\bbg-card\b/,
  /\bbg-popover\b/,
  /\bbg-muted\b/,
  /\bbg-\[#[def][0-9a-f]{5}\]/i,
  /\bbg-\[#[A-F][0-9A-F]{5}\]/,
];

const DARK_TEXT = [
  /\btext-\[#0[0-9a-f]{5}\]/i,
  /\btext-navy\b/,
  /\btext-brand-navy\b/,
  /\btext-black\b/,
  /\btext-(?:slate|gray|zinc|neutral|stone)-(?:700|800|900|950)\b/,
  /\btext-foreground\b/,
  /\btext-muted-foreground\b/,
];

const firstMatch = (patterns, s) => {
  for (const r of patterns) {
    const m = s.match(r);
    if (m) return m[0];
  }
  return null;
};

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules') continue;
      walkFiles(full, out);
    } else if (entry.endsWith('.tsx') && !/\.(test|spec)\.tsx$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** Collect every string literal inside a className attribute value. */
function classNameOf(node) {
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  if (!attrs) return null;
  let out = '';
  for (const attr of attrs.properties) {
    if (!ts.isJsxAttribute(attr) || !attr.name) continue;
    const name = attr.name.getText();
    if (name !== 'className' && name !== 'class') continue;
    const init = attr.initializer;
    if (!init) continue;
    const collect = (n) => {
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out += ' ' + n.text;
      else if (ts.isTemplateExpression(n)) {
        out += ' ' + n.head.text;
        for (const span of n.templateSpans) {
          out += ' ' + span.literal.text;
          collect(span.expression);
        }
      } else n.forEachChild(collect);
    };
    collect(init);
  }
  return out.trim() || null;
}

function auditFile(file) {
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings = [];

  const visit = (node, darkSurface) => {
    let nextDark = darkSurface;
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const cls = classNameOf(node);
      if (cls) {
        const light = firstMatch(LIGHT_SURFACE, cls);
        const dark = firstMatch(DARK_SURFACE, cls);
        if (dark) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
          nextDark = { cls: dark, line: line + 1 };
        } else if (light) {
          nextDark = null;
        }
        if (nextDark) {
          const badText = firstMatch(DARK_TEXT, cls);
          // white-on-dark overrides on the same element are fine
          const hasLightText = /\btext-white\b|\btext-\[#f[0-9a-f]{5}\]/i.test(cls);
          if (badText && !hasLightText && !(dark && badText)) {
            const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
            findings.push({
              file: relative(ROOT, file),
              line: line + 1,
              token: badText,
              surface: nextDark.cls,
              surfaceLine: nextDark.line,
            });
          }
        }
      }
    }
    node.forEachChild((c) => visit(c, nextDark));
  };

  visit(sf, null);
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

console.log(`Contrast audit: ${all.length} dark-on-dark hits in ${byFile.size} files\n`);
for (const [file, hits] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${file} (${hits.length})`);
  for (const h of hits) {
    console.log(`  :${h.line}  ${h.token}  on  ${h.surface}  (line ${h.surfaceLine})`);
  }
}

process.exit(process.env['CONTRAST_AUDIT_STRICT'] === '1' ? 1 : 0);
