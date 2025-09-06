import { describe, it, expect } from 'vitest';
import { filterAndSortCompareData, CompareItem } from '../compareFilter';

const data: CompareItem[] = [
  { id: '1', category: 'blood-tests', name: 'A Test', provider: 'Medichecks', providerLogo: '', price: 50, features: {} },
  { id: '2', category: 'blood-tests', name: 'B Test', provider: 'Thriva', providerLogo: '', price: 40, features: {} },
  { id: '3', category: 'blood-tests', name: 'C Test', provider: 'Randox', providerLogo: '', price: 60, features: {} },
  { id: '4', category: 'hormones', name: 'D Test', provider: 'Medichecks', providerLogo: '', price: 30, features: {} },
];

describe('filterAndSortCompareData', () => {
  it('filters by search term and provider', () => {
    const result = filterAndSortCompareData(data, {
      category: 'blood-tests',
      providers: ['medichecks'],
      searchTerm: 'A',
      sortOrder: 'asc'
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('sorts by price descending', () => {
    const result = filterAndSortCompareData(data, {
      category: 'blood-tests',
      providers: ['all'],
      sortOrder: 'desc'
    });
    expect(result[0].price).toBe(60);
    expect(result[2].price).toBe(40);
  });
});
