import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { CategoryHero } from "./CategoryHero";
import { CategoryFilters } from "./CategoryFilters";
import { CategoryCompareDrawer, CompareItem } from "./CategoryCompareDrawer";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";

/* ───────── Types ───────── */
export interface CategoryTestItem {
  id: string | number;
  popular?: boolean;
  badge?: string;
  badgeColor: string;
  provider: string;
  priceNum: number;
  price: string;
  turnaround: string;
  turnaroundDays: number;
  biomarkerCount: number;
  rating: number;
  reviews: number;
  title: string;
  desc: string;
  biomarkers: string[];
  tag: string;
  collection?: string;
  url?: string;
}

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface CategoryPageLayoutProps {
  /* SEO */
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  canonicalUrl: string;
  /* Hero */
  headline: string;
  subtitle: string;
  searchPlaceholder: string;
  trustStats: { value: string; label: string }[];
  /* Filters */
  filters: string[];
  /* Test data */
  tests: CategoryTestItem[];
  /* Bottom section */
  benefitsTitle: string;
  benefits: [BenefitItem, BenefitItem, BenefitItem];
  /* Breadcrumb */
  breadcrumbs: BreadcrumbSegment[];
  breadcrumbBackLabel?: string;
  /* Optional compare URL */
  compareUrl?: string;
}

export function CategoryPageLayout({
  seoTitle,
  seoDescription,
  seoKeywords,
  canonicalUrl,
  headline,
  subtitle,
  searchPlaceholder,
  trustStats,
  filters,
  tests,
  benefitsTitle,
  benefits,
  breadcrumbs,
  breadcrumbBackLabel = "Back",
  compareUrl = "/compare",
}: CategoryPageLayoutProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [compared, setCompared] = useState<CategoryTestItem[]>([]);

  const toggleCompare = (test: CategoryTestItem) => {
    setCompared((prev) => {
      if (prev.find((t) => t.id === test.id))
        return prev.filter((t) => t.id !== test.id);
      if (prev.length >= 3) return prev;
      return [...prev, test];
    });
  };

  const filtered = useMemo(() => {
    let list = tests;
    if (activeFilter !== "All")
      list = list.filter((t) => t.tag === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.biomarkers.some((b) => b.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "biomarkers":
        sorted.sort((a, b) => b.biomarkerCount - a.biomarkerCount);
        break;
      case "turnaround":
        sorted.sort((a, b) => a.turnaroundDays - b.turnaroundDays);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        sorted.sort(
          (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
        );
        break;
    }
    return sorted;
  }, [tests, activeFilter, search, sort]);

  const compareItems: CompareItem[] = compared.map((t) => ({
    id: t.id,
    title: t.title,
    price: t.price,
    badgeColor: t.badgeColor,
  }));

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main
          className="flex-1"
          style={{ paddingBottom: compared.length > 0 ? 80 : 0 }}
        >
          <PageBreadcrumb
            segments={breadcrumbs}
            backLabel={breadcrumbBackLabel}
          />

          <CategoryHero
            headline={headline}
            subtitle={subtitle}
            searchPlaceholder={searchPlaceholder}
            trustStats={trustStats}
            search={search}
            onSearchChange={setSearch}
          />

          {/* Filter + Sort + Cards */}
          <section className="bg-muted/30 py-8 sm:py-10 px-4">
            <div className="max-w-[1100px] mx-auto">
              <CategoryFilters
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                sort={sort}
                onSortChange={setSort}
                resultCount={filtered.length}
                searchTerm={search || undefined}
                compareCount={compared.length}
              />

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center sm:justify-items-stretch">
                {filtered.map((test) => (
                  <UnifiedTestCard
                    key={test.id}
                    category={test.tag}
                    categoryColor={test.badgeColor}
                    badge={test.popular ? "Most Popular" : test.badge}
                    name={test.title}
                    description={test.desc}
                    biomarkers={test.biomarkerCount}
                    results={test.turnaround}
                    collection={test.collection || "Home Kit"}
                    rating={test.rating}
                    reviews={test.reviews}
                    price={test.priceNum}
                    markers={test.biomarkers}
                    provider={test.provider}
                    url={test.url}
                    ctaLabel="Compare"
                    compareSelected={!!compared.find((c) => c.id === test.id)}
                    onCompareToggle={() => toggleCompare(test)}
                    className="w-full max-w-[340px]"
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <div className="text-base font-semibold text-foreground mb-1">
                    No tests found
                  </div>
                  <div className="text-sm">
                    Try a different search term or filter
                  </div>
                </div>
              )}
            </div>
          </section>

          <CategoryPageBottom
            benefitsTitle={benefitsTitle}
            benefits={benefits}
          />
        </main>

        <Footer />
      </div>

      <CategoryCompareDrawer
        selected={compareItems}
        onRemove={(id) =>
          setCompared((prev) => prev.filter((t) => t.id !== id))
        }
        onClear={() => setCompared([])}
        compareUrl={compareUrl}
      />
    </>
  );
}
