export interface CompareItem {
  id: string;
  category: string;
  name: string;
  provider: string;
  providerLogo: string;
  price: number;
  features: Record<string, string | boolean>;
}

export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  category: string;
  providers: string[];
  searchTerm?: string;
  sortOrder?: SortOrder;
}

export function filterAndSortCompareData<T extends CompareItem>(data: T[], options: FilterOptions): T[] {
  const { category, providers, searchTerm = '', sortOrder = 'asc' } = options;
  const isAll = providers.includes('all');
  const search = searchTerm.toLowerCase();

  const filtered = data.filter(item => {
    if (item.category !== category) return false;
    if (!isAll && !providers.includes(item.provider.toLowerCase())) return false;
    if (search && !item.name.toLowerCase().includes(search)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  return sorted;
}
