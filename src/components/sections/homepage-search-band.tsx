import { Search } from "lucide-react";

/** Navy search band joining the providers strip and the mission section. */
export const HomepageSearchBand = () => (
  <section aria-label="Search tests" className="w-full bg-brand-navy sm:bg-transparent sm:py-4">
    <div className="homepage-section-inner py-4 sm:py-5 sm:rounded-2xl sm:bg-brand-navy">
      <form action="/search" method="get" role="search" className="mx-auto flex w-full max-w-2xl items-center gap-2">
        <label htmlFor="homepage-search" className="sr-only">
          Search tests, biomarkers or symptoms
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/50" aria-hidden="true" />
          <input
            id="homepage-search"
            name="q"
            type="search"
            required
            placeholder="Search tests, biomarkers or symptoms"
            className="h-12 w-full rounded-full border border-white/20 bg-white pl-11 pr-4 text-base text-brand-navy placeholder:text-brand-navy/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise"
          />
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-brand-turquoise px-5 font-heading text-sm font-bold text-brand-navy shadow-lg transition-colors hover:bg-brand-pink hover:text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  </section>
);
