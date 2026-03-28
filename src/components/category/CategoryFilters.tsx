interface CategoryFiltersProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
  searchTerm?: string;
  compareCount?: number;
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
}: CategoryFiltersProps) {
  return (
    <div className="mb-5">
      {/* Filter + sort row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                activeFilter === f
                  ? "bg-brand-turquoise text-[hsl(var(--navy))] border-brand-turquoise shadow-[0_0_12px_rgba(34,192,212,0.25)]"
                  : "bg-background text-muted-foreground border-border hover:border-brand-turquoise/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground cursor-pointer outline-none"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="biomarkers">Most Biomarkers</option>
          <option value="turnaround">Fastest Results</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        {resultCount} test{resultCount !== 1 ? "s" : ""} found
        {searchTerm && (
          <span>
            {" "}for "<strong>{searchTerm}</strong>"
          </span>
        )}
        {compareCount > 0 && (
          <span className="ml-3 text-brand-turquoise font-semibold">
            · {compareCount} selected for comparison
          </span>
        )}
      </div>
    </div>
  );
}
