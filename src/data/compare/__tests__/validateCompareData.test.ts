import { describe, it, expect } from 'vitest';
import { validateCompareData, formatReport } from '../validateCompareData';

describe('compare data validation', () => {
  const report = validateCompareData();

  it('produces a report with no errors', () => {
    if (!report.ok) {
      // Surface details in CI output for quick triage.
       
      console.error(formatReport(report));
    }
    expect(report.errorCount).toBe(0);
  });

  it('contains records', () => {
    expect(report.totalRecords).toBeGreaterThan(0);
  });

  it('covers expected providers', () => {
    expect(Object.keys(report.providerCounts).length).toBeGreaterThan(0);
  });
});
