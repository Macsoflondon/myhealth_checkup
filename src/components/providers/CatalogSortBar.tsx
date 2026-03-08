import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CatalogSortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "biomarkers-desc" | "popularity";

interface CatalogSortBarProps {
  sortBy: CatalogSortOption;
  onSortChange: (value: CatalogSortOption) => void;
  resultCount: number;
  categoryLabel?: string;
}

export function sortTests<T extends { test_name: string; price?: number | null; biomarker_count?: number | null; is_popular?: boolean | null; popularity_rank?: number | null }>(
  tests: T[],
  sortBy: CatalogSortOption
): T[] {
  return [...tests].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.test_name.localeCompare(b.test_name);
      case "name-desc":
        return b.test_name.localeCompare(a.test_name);
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "biomarkers-desc":
        return (b.biomarker_count || 0) - (a.biomarker_count || 0);
      case "popularity":
        // Popular first, then by popularity_rank (lower = better)
        const aPopular = a.is_popular ? 1 : 0;
        const bPopular = b.is_popular ? 1 : 0;
        if (bPopular !== aPopular) return bPopular - aPopular;
        return (a.popularity_rank || 999) - (b.popularity_rank || 999);
      default:
        return 0;
    }
  });
}

export default function CatalogSortBar({ sortBy, onSortChange, resultCount, categoryLabel }: CatalogSortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-gray-500 text-sm">
        {resultCount} test{resultCount !== 1 ? "s" : ""} found
        {categoryLabel && categoryLabel !== "all" ? ` in ${categoryLabel}` : ""}
      </p>
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as CatalogSortOption)}>
          <SelectTrigger className="w-[200px] bg-white">
            <ArrowUpDown className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A–Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z–A)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="biomarkers-desc">Most Biomarkers</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
