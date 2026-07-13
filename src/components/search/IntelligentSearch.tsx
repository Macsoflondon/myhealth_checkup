/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Brain, TrendingUp, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearchTestsQuery } from '@/hooks/queries/useTestsQuery';

const POPULAR_SEARCHES = [
  "Thyroid function",
  "Vitamin D",
  "Full blood count",
  "Hormone levels",
  "Cholesterol",
  "Diabetes screening",
  "Iron deficiency",
  "Liver function",
];

type SortKey = 'relevance' | 'price-low' | 'price-high';

const IntelligentSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [sortBy, setSortBy] = useState<SortKey>('relevance');

  // Sync URL ?q= into the active query (covers back/forward + header nav).
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearchTerm(q);
    setActiveQuery(q);
  }, [searchParams]);

  const { data: rawResults = [], isFetching } = useSearchTestsQuery(activeQuery, {
    enabled: activeQuery.trim().length >= 2,
  });

  const results = useMemo(() => {
    const arr = [...rawResults];
    if (sortBy === 'price-low') {
      return arr.sort((a: any, b: any) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }
    if (sortBy === 'price-high') {
      return arr.sort((a: any, b: any) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    }
    return arr;
  }, [rawResults, sortBy]);

  const runSearch = (term: string) => {
    const next = term.trim();
    setActiveQuery(next);
    const params = new URLSearchParams(searchParams);
    if (next) params.set('q', next);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    runSearch('');
  };

  const isLoading = isFetching && activeQuery.length >= 2;
  const hasQuery = activeQuery.trim().length >= 2;
  const hasResults = hasQuery && results.length > 0;
  const noResults = hasQuery && !isLoading && results.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-navy">Find Your Perfect Health Test</h1>
        <p className="text-gray-600">
          Search across 540+ tests from 9 UK providers — by name, biomarker, condition or category.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy" />
          <Input
            type="text"
            placeholder="Search for tests, biomarkers, symptoms or health concerns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-24 py-6 text-lg text-gray-900 bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:shadow-lg transition-all duration-200"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="submit"
            disabled={!searchTerm.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-pink hover:bg-brand-pink/90 text-white font-medium"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {!hasQuery && (
        <div className="mb-8 border-2 border-[hsl(var(--navy))] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-health-600" />
            <h2 className="text-lg font-semibold text-[#081129]">Popular Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="px-3 py-2 cursor-pointer hover:bg-health-50 hover:border-health-200"
                onClick={() => {
                  setSearchTerm(s);
                  runSearch(s);
                }}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600 mx-auto mb-4" />
          <p className="text-gray-600">Searching across active tests…</p>
        </div>
      )}

      {hasResults && !isLoading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{activeQuery}"
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((r: any) => (
              <Card
                key={r.id}
                className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-200"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-900">{r.test_name}</h3>
                      {r.canonical_category && (
                        <Badge variant="outline" className="text-xs">
                          {r.canonical_category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                      {r.provider_id && <span className="capitalize">{r.provider_id.replace(/-/g, ' ')}</span>}
                      {r.category && (
                        <>
                          <span>•</span>
                          <span>{r.category}</span>
                        </>
                      )}
                      {r.biomarker_count != null && (
                        <>
                          <span>•</span>
                          <span>{r.biomarker_count} biomarkers</span>
                        </>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{r.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {r.price != null && (
                      <div className="text-2xl font-bold text-health-600 mb-2">£{r.price}</div>
                    )}
                    <Button
                      asChild
                      size="sm"
                      className="bg-brand-pink hover:bg-brand-pink/90 text-white"
                    >
                      <a href={r.url || '#'} target="_blank" rel="noopener noreferrer">
                        View Details
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {noResults && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-navy mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-navy">No matches found</h3>
          <p className="text-navy mb-4">Try a related term or one of these popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR_SEARCHES.slice(0, 4).map((s) => (
              <Button
                key={s}
                size="sm"
                className="bg-[#22c0d4] text-white"
                onClick={() => {
                  setSearchTerm(s);
                  runSearch(s);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentSearch;
