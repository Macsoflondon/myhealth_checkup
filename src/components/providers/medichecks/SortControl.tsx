import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MedichecksSortOption = 
  | "best-selling" 
  | "name-asc" 
  | "name-desc" 
  | "price-asc" 
  | "price-desc";

interface SortControlProps {
  value: MedichecksSortOption;
  onChange: (value: MedichecksSortOption) => void;
  resultCount?: number;
}

const SortControl = ({ value, onChange, resultCount }: SortControlProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {resultCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          {resultCount} product{resultCount !== 1 ? "s" : ""}
        </p>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sort By
        </span>
        <Select value={value} onValueChange={(v) => onChange(v as MedichecksSortOption)}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Best selling" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="best-selling">Best selling</SelectItem>
            <SelectItem value="name-asc">Alphabetically, A-Z</SelectItem>
            <SelectItem value="name-desc">Alphabetically, Z-A</SelectItem>
            <SelectItem value="price-asc">Price, low to high</SelectItem>
            <SelectItem value="price-desc">Price, high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortControl;
