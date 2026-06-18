/**
 * Compare data validation.
 *
 * Verifies that each provider's tests and IDs match what the compare page
 * expects, and reports any missing or malformed entries.
 *
 * Run programmatically via `validateCompareData()` or from the CLI:
 *   bunx tsx src/data/compare/validateCompareData.ts
 */

import { compareData } from './index';
import { realTestData } from './realProviderData';
import { medichecksCompareData } from './medichecksData';
import { londonLabCompareData } from './londonLabData';
import { PROVIDER_NAMES } from '@/constants/providers';
import type { CompareTestData } from '@/types';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  source: string;
  id?: string;
  provider?: string;
  field?: string;
  message: string;
}

export interface ValidationReport {
  ok: boolean;
  totalRecords: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
  providerCounts: Record<string, number>;
}

// Canonical set of provider display names the compare page understands.
const KNOWN_PROVIDER_NAMES = new Set<string>([
  ...Object.values(PROVIDER_NAMES),
  // Legacy/display aliases that historically appear in static datasets.
  'Randox',
  'GoodBody Clinic',
  'Goodbody Clinic',
]);

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isHttpUrl(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function pushMissing(
  issues: ValidationIssue[],
  source: string,
  record: Partial<CompareTestData>,
  field: string,
) {
  issues.push({
    severity: 'error',
    source,
    id: record.id,
    provider: record.provider,
    field,
    message: `Missing or invalid "${field}"`,
  });
}

function validateMappedTest(
  test: CompareTestData,
  source: string,
  seenIds: Map<string, string>,
  issues: ValidationIssue[],
) {
  if (!isNonEmptyString(test.id)) {
    pushMissing(issues, source, test, 'id');
  } else {
    if (!ID_PATTERN.test(test.id)) {
      issues.push({
        severity: 'warning',
        source,
        id: test.id,
        provider: test.provider,
        field: 'id',
        message: `ID "${test.id}" is not kebab-case lowercase`,
      });
    }
    const prev = seenIds.get(test.id);
    if (prev) {
      issues.push({
        severity: 'error',
        source,
        id: test.id,
        provider: test.provider,
        field: 'id',
        message: `Duplicate id (also in ${prev})`,
      });
    } else {
      seenIds.set(test.id, source);
    }
  }

  if (!isNonEmptyString(test.name)) pushMissing(issues, source, test, 'name');
  if (!isNonEmptyString(test.category)) pushMissing(issues, source, test, 'category');
  if (!isNonEmptyString(test.provider)) {
    pushMissing(issues, source, test, 'provider');
  } else if (!KNOWN_PROVIDER_NAMES.has(test.provider)) {
    issues.push({
      severity: 'error',
      source,
      id: test.id,
      provider: test.provider,
      field: 'provider',
      message: `Unknown provider "${test.provider}" — not in PROVIDER_NAMES`,
    });
  }

  if (typeof test.price !== 'number' || !Number.isFinite(test.price) || test.price <= 0) {
    pushMissing(issues, source, test, 'price');
  }

  if (!test.features || typeof test.features !== 'object') {
    pushMissing(issues, source, test, 'features');
  } else {
    for (const f of ['bioMarkers', 'turnaround', 'collection'] as const) {
      if (!isNonEmptyString((test.features as Record<string, unknown>)[f])) {
        pushMissing(issues, source, test, `features.${f}`);
      }
    }
  }

  const url = (test as CompareTestData & { testUrl?: string }).testUrl
    ?? (test.features as Record<string, unknown> | undefined)?.['Real provider URL'];
  if (url !== undefined && !isHttpUrl(url)) {
    issues.push({
      severity: 'warning',
      source,
      id: test.id,
      provider: test.provider,
      field: 'testUrl',
      message: `Malformed URL: ${String(url)}`,
    });
  }
}

export function validateCompareData(): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenIds = new Map<string, string>();
  const providerCounts: Record<string, number> = {};

  // 1) Validate raw realTestData (the upstream source)
  realTestData.forEach((row, i) => {
    const src = `realProviderData[${i}]`;
    if (!isNonEmptyString(row.Provider)) {
      issues.push({ severity: 'error', source: src, field: 'Provider', message: 'Missing Provider' });
    } else if (!KNOWN_PROVIDER_NAMES.has(row.Provider)) {
      issues.push({
        severity: 'error',
        source: src,
        provider: row.Provider,
        field: 'Provider',
        message: `Unknown provider "${row.Provider}"`,
      });
    }
    if (!isNonEmptyString(row['Test Name'])) {
      issues.push({ severity: 'error', source: src, field: 'Test Name', message: 'Missing Test Name' });
    }
    if (typeof row['Price (£)'] !== 'number' || row['Price (£)'] <= 0) {
      issues.push({ severity: 'error', source: src, field: 'Price (£)', message: 'Invalid price' });
    }
    if (!isHttpUrl(row['Test URL'])) {
      issues.push({ severity: 'error', source: src, field: 'Test URL', message: `Malformed URL: ${row['Test URL']}` });
    }
    if (typeof row['Biomarker Count'] !== 'number' || row['Biomarker Count'] < 0) {
      issues.push({ severity: 'warning', source: src, field: 'Biomarker Count', message: 'Invalid biomarker count' });
    }
  });

  // 2) Validate each compare-ready dataset
  const datasets: Array<[string, CompareTestData[]]> = [
    ['mappedTestData', compareData.filter(t => t.id?.startsWith('real-test-'))],
    ['medichecksCompareData', medichecksCompareData],
    ['londonLabCompareData', londonLabCompareData],
  ];

  for (const [name, ds] of datasets) {
    ds.forEach((t) => {
      validateMappedTest(t, name, seenIds, issues);
      if (t.provider) {
        providerCounts[t.provider] = (providerCounts[t.provider] ?? 0) + 1;
      }
    });
  }

  // 3) Cross-check the combined compareData export
  compareData.forEach((t, i) => {
    if (!isNonEmptyString(t.id)) {
      issues.push({ severity: 'error', source: `compareData[${i}]`, field: 'id', message: 'Missing id in combined export' });
    }
  });

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return {
    ok: errorCount === 0,
    totalRecords: compareData.length,
    errorCount,
    warningCount,
    issues,
    providerCounts,
  };
}

export function formatReport(report: ValidationReport): string {
  const lines: string[] = [];
  lines.push(`Compare data validation`);
  lines.push(`  Records: ${report.totalRecords}`);
  lines.push(`  Errors:  ${report.errorCount}`);
  lines.push(`  Warns:   ${report.warningCount}`);
  lines.push(`  Providers:`);
  for (const [p, n] of Object.entries(report.providerCounts).sort()) {
    lines.push(`    - ${p}: ${n}`);
  }
  if (report.issues.length) {
    lines.push('');
    lines.push('Issues:');
    for (const i of report.issues) {
      const idPart = i.id ? ` [${i.id}]` : '';
      const fieldPart = i.field ? ` {${i.field}}` : '';
      lines.push(`  ${i.severity.toUpperCase()} ${i.source}${idPart}${fieldPart}: ${i.message}`);
    }
  }
  return lines.join('\n');
}

// CLI entry — works under `bunx tsx` or `node --import tsx`.
const isCli = typeof process !== 'undefined'
  && Array.isArray(process.argv)
  && process.argv[1]?.includes('validateCompareData');

if (isCli) {
  const report = validateCompareData();
  // eslint-disable-next-line no-console
  console.log(formatReport(report));
  if (!report.ok) process.exit(1);
}
