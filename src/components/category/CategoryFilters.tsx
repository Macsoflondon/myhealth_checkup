import { useState } from "react";

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

const TURQUOISE = "#22c0d4";

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
  const [hovered, setHovered] = useState<string | null>(null);

  const colorFor = (f: string) => filterColors[f] || TURQUOISE;

  return (
    <div className="mb-5">
      {/* Filter + sort row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const isActive = activeFilter === f;
            const isHover = hovered === f;
            const color = colorFor(f);
            const highlight = isActive || isHover;
            return (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                onMouseEnter={() => setHovered(f)}
                onMouseLeave={() => setHovered(null)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border"
                style={{
                  background: highlight ? `${color}1A` : "hsl(var(--background))",
                  color: highlight ? color : "hsl(var(--muted-foreground))",
                  borderColor: highlight ? color : "hsl(var(--border))",
                  boxShadow: isActive
                    ? `0 0 12px ${color}40`
                    : "none",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer outline-none border-2"
          style={{
            background: "hsl(var(--background))",
            color: TURQUOISE,
            borderColor: TURQUOISE,
          }}
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
      <div className="text-xs font-semibold" style={{ color: TURQUOISE }}>
        {resultCount} test{resultCount !== 1 ? "s" : ""} found
        {searchTerm && (
          <span>
            {" "}for "<strong>{searchTerm}</strong>"
          </span>
        )}
        {compareCount > 0 && (
          <span className="ml-3">
            · {compareCount} selected for comparison
          </span>
        )}
      </div>
    </div>
  );
}
