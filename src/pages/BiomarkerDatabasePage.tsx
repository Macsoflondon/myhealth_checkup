import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useBiomarkersLibrary, BiomarkerDefinition } from "@/hooks/useBiomarkersLibrary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronUp, FlaskConical, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import PageBanner from "@/components/sections/PageBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function BiomarkerCard({ biomarker }: { biomarker: BiomarkerDefinition }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border-2 border-[#081129] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-heading font-semibold text-[#081129] text-base sm:text-lg">
              {biomarker.biomarker_name}
            </h3>
            <Badge variant="outline" className="text-xs font-mono shrink-0 border-[#081129]">
              {biomarker.biomarker_code}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{biomarker.description}</p>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
        )}
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-[#081129]/10 space-y-3 text-sm">
          {biomarker.unit_of_measurement && (
            <div>
              <span className="font-medium text-[#081129]">Unit:</span>{" "}
              <span className="text-muted-foreground">{biomarker.unit_of_measurement}</span>
            </div>
          )}
          {(biomarker.normal_range_male || biomarker.normal_range_female) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {biomarker.normal_range_male && (
                <div className="bg-[#081129]/5 rounded-lg p-3">
                  <span className="font-medium text-[#081129] block text-xs uppercase tracking-wide mb-1">Male Range</span>
                  <span className="text-muted-foreground">{biomarker.normal_range_male}</span>
                </div>
              )}
              {biomarker.normal_range_female && (
                <div className="bg-[#081129]/5 rounded-lg p-3">
                  <span className="font-medium text-[#081129] block text-xs uppercase tracking-wide mb-1">Female Range</span>
                  <span className="text-muted-foreground">{biomarker.normal_range_female}</span>
                </div>
              )}
            </div>
          )}
          {biomarker.clinical_significance && (
            <div>
              <span className="font-medium text-[#081129]">Clinical Significance:</span>
              <p className="text-muted-foreground mt-1">{biomarker.clinical_significance}</p>
            </div>
          )}
          {biomarker.related_conditions && biomarker.related_conditions.length > 0 && (
            <div>
              <span className="font-medium text-[#081129] block mb-1">Related Conditions:</span>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.related_conditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {biomarker.lifestyle_factors && biomarker.lifestyle_factors.length > 0 && (
            <div>
              <span className="font-medium text-[#081129] block mb-1">Lifestyle Factors:</span>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.lifestyle_factors.map((factor) => (
                  <Badge key={factor} variant="outline" className="text-xs border-[#081129]">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BiomarkerDatabasePage() {
  const { biomarkers, isLoading, error, categories, searchBiomarkers, getBiomarkersByCategory } = useBiomarkersLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBiomarkers = useMemo(() => {
    let results: BiomarkerDefinition[];
    if (searchQuery.trim()) {
      results = searchBiomarkers(searchQuery);
    } else if (selectedCategory) {
      results = getBiomarkersByCategory(selectedCategory);
    } else {
      results = biomarkers;
    }
    return results;
  }, [searchQuery, selectedCategory, biomarkers, searchBiomarkers, getBiomarkersByCategory]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, BiomarkerDefinition[]> = {};
    filteredBiomarkers.forEach((b) => {
      if (!groups[b.category]) groups[b.category] = [];
      groups[b.category].push(b);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredBiomarkers]);

  return (
    <>
      <Helmet>
        <title>Biomarker Database | myhealth checkup</title>
        <meta name="description" content="Explore our comprehensive biomarker database. Search by name, code, or category to understand what each blood test marker measures and why it matters." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/biomarker-database" />
      </Helmet>

      <Header />

      <PageBanner
        title="Biomarker"
        accent="Database"
        subtitle="Search and explore blood test biomarkers. Understand what each marker measures, normal ranges, and clinical significance."
      />

      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="min-h-screen bg-[hsl(220_5%_97%)]">
        {/* Search & Filters */}
        <section className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          <div className="bg-white border-2 border-[#081129] rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search biomarkers by name, code, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) setSelectedCategory(null);
                }}
                className="pl-10"
              />
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 border-[#081129] min-h-[36px]",
                    !selectedCategory
                      ? "bg-[#e70d69] hover:bg-[#e70d69]/90 text-white"
                      : "bg-[#22c0d4] hover:bg-[#e70d69] text-white"
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchQuery(""); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 border-[#081129] min-h-[36px]",
                      selectedCategory === cat
                        ? "bg-[#e70d69] hover:bg-[#e70d69]/90 text-white"
                        : "bg-[#22c0d4] hover:bg-[#e70d69] text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto px-4 pb-8 sm:pb-12 max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Unable to load biomarkers. Please try again later.</p>
            </div>
          ) : filteredBiomarkers.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No biomarkers found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search term or category.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedByCategory.map(([category, items]) => (
                <Collapsible key={category} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#081129]">
                      {category}
                      <span className="text-sm font-normal text-[#22c0d4] ml-2">
                        ({items.length})
                      </span>
                    </h2>
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-3 mt-4">
                      {items.map((biomarker) => (
                        <BiomarkerCard key={biomarker.id} biomarker={biomarker} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredBiomarkers.length > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              Showing {filteredBiomarkers.length} biomarker{filteredBiomarkers.length !== 1 ? "s" : ""}
            </p>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
