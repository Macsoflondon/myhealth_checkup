import { describe, expect, it } from 'vitest';
import {
  buildRelatedLinks,
  getCompareLinks,
  getProviderLinks,
  getRelatedCategoryLinks,
  resolveCategorySlug,
} from './internal-links';

describe('internal-links', () => {
  it('returns sibling categories without linking to itself', () => {
    const links = getRelatedCategoryLinks('thyroid');
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((l) => l.to !== '/tests/thyroid')).toBe(true);
    expect(links.every((l) => l.to.startsWith('/tests/'))).toBe(true);
  });

  it('excludes the current provider from provider links', () => {
    const links = getProviderLinks('goodbody');
    expect(links.some((l) => l.to === '/provider/goodbody-clinic')).toBe(false);
    expect(links.some((l) => l.to === '/provider/medichecks')).toBe(true);
  });

  it('builds de-duplicated comparison links for a category', () => {
    const links = getCompareLinks('diabetes');
    const targets = links.map((l) => l.to);
    expect(new Set(targets).size).toBe(targets.length);
    expect(targets[0]).toBe('/compare?category=diabetes');
  });

  it('maps provider category wording onto canonical slugs', () => {
    expect(resolveCategorySlug('Hormone Tests')).toBe('hormones');
    expect(resolveCategorySlug('Cancer Screening')).toBe('cancer-screening');
    expect(resolveCategorySlug(null)).toBeNull();
    expect(resolveCategorySlug('Something Unrelated')).toBeNull();
  });

  it('groups links for a test detail page', () => {
    const groups = buildRelatedLinks({ categorySlug: 'hormones', providerId: 'medichecks' });
    expect(groups.map((g) => g.title)).toEqual([
      'Related test categories',
      'Compare side by side',
      'Other accredited providers',
    ]);
  });
});
