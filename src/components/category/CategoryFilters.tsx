
interface CategoryFiltersProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
  searchTerm?: string;
  compareCount?: number;
  /** Optional per-filter accent colors (hex). Falls back to turquoise. */
  filterColors?: Record<string, string>;
}

export function CategoryFilters({
  filters,
  activeFilter,
  onFilterChange,
  sort,
  onSortChange,
  resultCount,
  searchTerm,
  compareCount = 0,
  filterColors = {},
}: CategoryFiltersProps) {
  return (
    <div className="mb-5">
      {/* Sort + result count row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="min-w-0 text-xs font-semibold text-brand-turquoise-text">
          {resultCount} test{resultCount !== 1 ? "s" : ""} found
          {searchTerm && (
            <span>
              {" "}
              for "<strong>{searchTerm}</strong>"
            </span>
          )}
          {compareCount > 0 && (
            <span className="ml-3">
              · {compareCount} selected for comparison
            </span>
          )}
        </div>

        <select
          aria-label="Sort tests"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="min-h-11 max-w-full rounded-lg px-3 py-2 text-base sm:text-sm font-semibold cursor-pointer outline-hidden border-2 border-brand-turquoise bg-background text-brand-turquoise-text"
        >
          <option value="popular">Most popular</option>
          <option value="rating">Highest rated</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="biomarkers">Most biomarkers</option>
          <option value="turnaround">Fastest results</option>
        </select>
      </div>
    </div>
  );
}
