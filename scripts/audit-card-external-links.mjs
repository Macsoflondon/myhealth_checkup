#!/usr/bin/env node
/**
 * Test-card external-link honesty audit.
 *
 * Card contract rule (.claude/skills/mhc-audit-loop/references/card-contract.md,
 * "Link rules"): the primary click target of a test card is our own internal
 * test-detail page, never the provider's external URL. The provider's URL may
 * appear only on an explicit, separately labelled booking action.
 *
 * This script scans the known card-rendering surfaces for `target="_blank"`
 * and `window.open(` — the two ways an external navigation gets wired up —
 * and requires each one to sit near the word "book" (an aria-label, visible
 * button text, or a `handleBook`-style identifier), the one honest label for
 * "this leaves the site to buy something". Anything else is flagged: it's
 * either an unlabelled external link (the DreamHealthShowcase filmstrip bug,
 * fixed 2026-09-14) or a mislabelled one (the TestListCard "View details"
 * bug, fixed the same day).
 *
 * This is a scoped, high-signal check over the card surfaces specifically —
 * not a repo-wide external-link auditor. Legitimate external links elsewhere
 * (footer, legal, admin tooling, tel:/mailto:) are out of scope on purpose.
 *
 * Exit 0 when every match is honestly labelled. Exit 1 otherwise, printing
 * file:line and the surrounding context that failed to justify it.
 */

import { readFileSync } from "node:fs";

const CARD_SURFACES = [
  "src/components/cards/UniversalTestCard.tsx",
  "src/components/cards/UnifiedTestCard.tsx",
  "src/components/providers/ProviderTestCard.tsx",
  "src/components/providers/ProviderTestsGrid.tsx",
  "src/components/providers/ProviderTestDetailModal.tsx",
  "src/components/providers/medichecks/MedichecksTestCard.tsx",
  "src/components/compare/TestListCard.tsx",
  "src/components/category/CategoryPageLayout.tsx",
  "src/components/sections/MostPopularTestsSection.tsx",
  "src/components/sections/HeroPopularTests.tsx",
  "src/components/sections/ClinicTestsSection.tsx",
  "src/components/sections/DreamHealthShowcase.tsx",
  "src/components/compare/RecommendedTestsCarousel.tsx",
  "src/components/ai/RecommendationEngine.tsx",
  "src/pages/CompareTests.tsx",
];

const EXTERNAL_NAV_PATTERNS = [
  /target=["']_blank["']/,
  /window\.open\(/,
  /\.\.\.externalLinkProps/, // src/utils/urlTracking.ts — sets target="_blank" via spread
];
const BOOK_WORD_RE = /book/i;

// Known limitation: the "book" check is a best-effort static proxy. A helper
// name like `buildProviderBookingUrl` contains "book" too, so this can pass
// a match whose *visible* label is still wrong even though something nearby
// mentions booking. This script catches the unlabelled case reliably (the
// DreamHealthShowcase filmstrip bug it was written for); it does not replace
// an actual render/E2E check of the on-screen text (the TestListCard
// mislabelled-button bug this same audit found had to be caught by hand).
const CONTEXT_WINDOW = 25; // lines of context checked before/after a match —
// generous because this codebase's inline `style={{...}}` objects routinely
// run 15-20 lines between a tag's opening attributes and its visible text

let failures = 0;
let checked = 0;

for (const relPath of CARD_SURFACES) {
  let text;
  try {
    text = readFileSync(relPath, "utf8");
  } catch {
    // A surface that's been renamed/removed is a card-contract inventory
    // problem, not this script's — but don't silently skip it either.
    console.error(`SKIP (not found): ${relPath} — update CARD_SURFACES in this script`);
    continue;
  }

  const lines = text.split("\n");

  lines.forEach((line, idx) => {
    const isExternalNav = EXTERNAL_NAV_PATTERNS.some((re) => re.test(line));
    if (!isExternalNav) return;

    checked++;
    const start = Math.max(0, idx - CONTEXT_WINDOW);
    const end = Math.min(lines.length, idx + CONTEXT_WINDOW + 1);
    const context = lines.slice(start, end).join("\n");

    if (!BOOK_WORD_RE.test(context)) {
      failures++;
      console.error(
        `FAIL ${relPath}:${idx + 1} — external navigation with no "book" label nearby (±${CONTEXT_WINDOW} lines):\n` +
          `    ${line.trim()}\n`,
      );
    }
  });
}

console.log(`\nCard external-link audit: ${checked} external navigation(s) checked, ${failures} unlabelled.`);

if (failures > 0) {
  console.error(
    "\nAn external navigation on a test-card surface has no nearby \"book\" label. " +
      "Per the card contract, the provider's URL may only appear on an explicit, " +
      "separately labelled booking action — never as an unlabelled or mislabelled " +
      "primary link. See .claude/skills/mhc-audit-loop/references/card-contract.md.",
  );
  process.exit(1);
}

process.exit(0);
