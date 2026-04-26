import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CompareItem {
  id: string | number;
  title: string;
  price: string;
  badgeColor?: string;
}

interface CategoryCompareDrawerProps {
  selected: CompareItem[];
  onRemove: (id: string | number) => void;
  onClear: () => void;
  compareUrl?: string;
  maxItems?: number;
}

export function CategoryCompareDrawer({
  selected,
  onRemove,
  onClear,
  compareUrl = "/compare",
  maxItems = 3,
}: CategoryCompareDrawerProps) {
  if (selected.length === 0) return null;

  const compareLink = `${compareUrl}${compareUrl.includes("?") ? "&" : "?"}tests=${selected.map((s) => s.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--navy))] border-t-2 border-brand-turquoise shadow-[0_-8px_40px_rgba(0,200,200,0.15)]">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-bold tracking-wider uppercase text-brand-turquoise whitespace-nowrap">
          Comparing {selected.length}/{maxItems}
        </span>

        <div className="flex gap-2 flex-wrap flex-1">
          {selected.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 border"
              style={{
                backgroundColor: "hsl(var(--navy) / 0.8)",
                borderColor: (item.badgeColor || "#22c0d4") + "60",
              }}
            >
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {item.title}
              </span>
              <span className="text-xs font-bold text-brand-turquoise">
                {item.price}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                aria-label={`Remove ${item.title}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-xs border-white/20 text-white/60 bg-transparent hover:bg-white/10"
          >
            Clear
          </Button>
          <Button
            asChild
            size="sm"
            className="text-xs font-bold text-white bg-gradient-to-r from-brand-turquoise to-brand-pink hover:opacity-90 border-0"
          >
            <Link to={compareLink}>Compare Now →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
