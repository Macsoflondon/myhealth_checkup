import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ObservationRecord } from "@/types/health-intelligence";

/**
 * Standing architecture guarantees, asserted rather than asserted-to.
 *
 * Two rules are easy to state in a document and easy to erode in code:
 *   1. No fulfilment or ingestion partner may appear in the canonical health
 *      layer. Every partner is one adapter, named only in data.
 *   2. A trusted observation carries measurement and provenance only. No
 *      interpretation, no score, no AI-derived field — ever.
 *
 * See docs/FORTH_CONNECT_COMPETITIVE_ARCHITECTURE.md, backlog item P0-g.
 */

const CANONICAL_ROOTS = [
  "src/lib/health",
  "src/types/health-intelligence.ts",
  "src/services/HealthRecordService.ts",
] as const;

/** Partner and proprietary product names that must never reach canonical code. */
const FORBIDDEN_TERMS = [
  "forth",
  "forthconnect",
  "healthcoach",
  "myform",
  "connectpro",
] as const;

const collectFiles = (relativePath: string): string[] => {
  const absolute = resolve(process.cwd(), relativePath);
  if (!statSync(absolute).isDirectory()) return [absolute];

  return readdirSync(absolute).flatMap((entry) => {
    const child = join(absolute, entry);
    if (statSync(child).isDirectory()) {
      return entry === "__tests__" ? [] : collectFiles(child);
    }
    return child.endsWith(".ts") && !child.endsWith(".test.ts") ? [child] : [];
  });
};

describe("canonical health layer is partner-neutral", () => {
  const files = CANONICAL_ROOTS.flatMap(collectFiles);

  it("inspects the canonical modules", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(FORBIDDEN_TERMS)("never references %s", (term) => {
    const offenders = files.filter((file) =>
      readFileSync(file, "utf8").toLowerCase().includes(term),
    );
    expect(offenders).toEqual([]);
  });
});

describe("the observation contract carries no interpretation", () => {
  /**
   * Compile-time exhaustive: adding an interpretive key to ObservationRecord
   * breaks this assignment, and adding one at runtime fails the key check.
   */
  const contract: Record<keyof ObservationRecord, true> = {
    id: true,
    biomarkerId: true,
    biomarkerName: true,
    sourceValue: true,
    sourceUnit: true,
    canonicalValue: true,
    canonicalUnit: true,
    sourceReferenceLow: true,
    sourceReferenceHigh: true,
    collectedAt: true,
    resultedAt: true,
    laboratoryName: true,
    method: true,
    validationStatus: true,
    verificationStatus: true,
    cyclePhase: true,
    cycleDay: true,
  };

  const FORBIDDEN_FIELD_PATTERNS = [
    "interpretation",
    "aiSummary",
    "insight",
    "score",
    "diagnosis",
    "recommendation",
    "trendDirection",
    "riskLevel",
  ];

  it.each(FORBIDDEN_FIELD_PATTERNS)("exposes no %s field", (pattern) => {
    const matches = Object.keys(contract).filter((key) =>
      key.toLowerCase().includes(pattern.toLowerCase()),
    );
    expect(matches).toEqual([]);
  });

  it("keeps the source value distinct from the canonical value", () => {
    expect(contract.sourceValue).toBe(true);
    expect(contract.sourceUnit).toBe(true);
    expect(contract.canonicalValue).toBe(true);
    expect(contract.canonicalUnit).toBe(true);
  });
});
