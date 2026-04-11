import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrustStat {
  value: string;
  label: string;
}

interface CategoryHeroProps {
  headline: string;
  subtitle: string;
  searchPlaceholder: string;
  trustStats: TrustStat[];
  search: string;
  onSearchChange: (value: string) => void;
}

export function CategoryHero({
  headline,
  subtitle,
  searchPlaceholder,
  trustStats,
  search,
  onSearchChange,
}: CategoryHeroProps) {
  return (
    <section className="border-b border-border/50 py-10 sm:py-12 px-4 text-center relative overflow-hidden bg-tertiary text-primary-foreground">
      {/* Subtle decorative glows */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-brand-turquoise/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-brand-pink/4 pointer-events-none" />

      <div className="max-w-[700px] mx-auto relative">
        <h1 className="text-3xl sm:text-4xl leading-tight mb-3 text-[hsl(var(--navy))] tracking-tight text-primary-foreground font-sans font-bold md:text-6xl">
          {headline}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed mb-7 max-w-xl mx-auto text-primary-foreground">
          {subtitle}
        </p>

        {/* Search bar */}
        <div className="flex items-center border border-border rounded-xl px-4 py-1 max-w-[560px] mx-auto mb-7 shadow-sm bg-primary">
          <Search className="h-4 w-4 mr-2 flex-shrink-0 bg-primary-foreground text-primary" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="border-none text-sm flex-1 outline-none py-2 bg-primary text-primary-foreground"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="bg-muted rounded-lg px-3 py-1.5 text-xs text-foreground cursor-pointer border-0 mr-1"
            >
              Clear
            </button>
          )}
          <Button
            size="sm"
            className="bg-brand-turquoise text-[hsl(var(--navy))] font-bold text-xs hover:bg-brand-turquoise/90 rounded-lg"
          >
            Search
          </Button>
        </div>

        {/* Trust stats */}
        <div className="flex justify-center gap-8 sm:gap-10 flex-wrap">
          {trustStats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-xl font-extrabold text-[hsl(var(--navy))] tracking-tight text-primary-foreground">
                {stat.value}
              </div>
              <div className="tracking-wide text-primary-foreground text-lg font-normal">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
