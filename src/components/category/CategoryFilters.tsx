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

      {/* Sort + result count row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
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
    </div>
  );
}
