import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useBiomarkersLibrary, BiomarkerDefinition, ReferenceRange } from "@/hooks/useBiomarkersLibrary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronUp, FlaskConical, Activity, Droplet, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import PageBanner from "@/components/sections/PageBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BODY_SYSTEM_LABELS: Record<string, string> = {
  cardiovascular: "Cardiovascular",
  hepatic: "Liver",
  renal: "Kidney",
  endocrine: "Hormones & Thyroid",
  haematology: "Blood",
  metabolic: "Metabolic & Diabetes",
  nutritional: "Vitamins & Minerals",
  immunological: "Immune",
  oncological: "Cancer Markers",
  musculoskeletal: "Bones & Muscles",
  gastrointestinal: "Gut",
  neurological: "Nervous System",
  other: "Other",
};

const BIOMATERIAL_LABELS: Record<string, string> = {
  serum: "Serum",
  plasma: "Plasma",
  whole_blood: "Whole blood",
  urine: "Urine",
  saliva: "Saliva",
  stool: "Stool",
  other: "Other",
};

function formatRange(r: ReferenceRange): string {
  const fmt = (lo: number | null, hi: number | null) =>
    lo != null && hi != null ? `${lo}–${hi}` : lo != null ? `≥ ${lo}` : hi != null ? `≤ ${hi}` : "—";
  return fmt(r.normal_min, r.normal_max);
}
function formatOptimal(r: ReferenceRange): string {
  const fmt = (lo: number | null, hi: number | null) =>
    lo != null && hi != null ? `${lo}–${hi}` : lo != null ? `≥ ${lo}` : hi != null ? `≤ ${hi}` : "—";
  return fmt(r.optimal_min, r.optimal_max);
}

function ReferenceRangeTable({ ranges }: { ranges: ReferenceRange[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15">
      <table className="w-full text-xs sm:text-sm">
        <thead className="bg-white/10 text-white/80">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Sex / Age</th>
            <th className="text-left px-3 py-2 font-medium">Normal</th>
            <th className="text-left px-3 py-2 font-medium text-[#22c0d4]">Optimal</th>
            <th className="text-left px-3 py-2 font-medium">Unit</th>
          </tr>
        </thead>
        <tbody>
          {ranges.map((r, i) => (
            <tr key={i} className="border-t border-white/10 text-white/80">
              <td className="px-3 py-2 capitalize">
                {r.sex === "all" ? "All" : r.sex}
                {r.age_min != null && r.age_max != null && r.age_max < 120 && (
                  <span className="text-white/50"> · {r.age_min}–{r.age_max}y</span>
                )}
                {r.age_min != null && r.age_max === 120 && r.age_min > 18 && (
                  <span className="text-white/50"> · {r.age_min}+</span>
                )}
              </td>
              <td className="px-3 py-2">{formatRange(r)}</td>
              <td className="px-3 py-2 text-[#22c0d4]">{formatOptimal(r)}</td>
              <td className="px-3 py-2 text-white/60">{r.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BiomarkerCard({ biomarker }: { biomarker: BiomarkerDefinition }) {
  const [open, setOpen] = useState(false);
  const hasRichContent = !!(
    biomarker.what_it_measures ||
    biomarker.why_it_matters ||
    biomarker.reference_ranges?.length
  );

  return (
    <div className="bg-[#081129] border-2 border-[#081129] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-heading font-semibold text-white text-base sm:text-lg">
              {biomarker.biomarker_name}
            </h3>
            <Badge className="text-xs font-mono shrink-0 bg-[#e70d69] text-white border-0">
              {biomarker.biomarker_code}
            </Badge>
            {biomarker.biomaterial && (
              <Badge variant="outline" className="text-xs border-white/30 text-white/80">
                <Droplet className="h-3 w-3 mr-1" />
                {BIOMATERIAL_LABELS[biomarker.biomaterial] ?? biomarker.biomaterial}
              </Badge>
            )}
          </div>
          <p className="text-sm text-white/70 line-clamp-2">
            {biomarker.what_it_measures ?? biomarker.description}
          </p>
          {biomarker.synonyms && biomarker.synonyms.length > 0 && (
            <p className="text-[11px] text-white/40 mt-1">
              Also known as: {biomarker.synonyms.join(", ")}
            </p>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-white/60 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/60 shrink-0 mt-1" />
        )}
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-white/20 space-y-4 text-sm">
          {biomarker.why_it_matters && (
            <section>
              <h4 className="font-medium text-white mb-1 flex items-center gap-1.5">
                <HeartPulse className="h-4 w-4 text-[#e70d69]" /> Why it matters
              </h4>
              <p className="text-white/70">{biomarker.why_it_matters}</p>
            </section>
          )}

          {biomarker.reference_ranges && biomarker.reference_ranges.length > 0 ? (
            <section>
              <h4 className="font-medium text-white mb-2">Reference ranges</h4>
              <ReferenceRangeTable ranges={biomarker.reference_ranges} />
              {biomarker.alternate_units && biomarker.alternate_units.length > 1 && (
                <p className="text-[11px] text-white/50 mt-2">
                  Also reported in: {biomarker.alternate_units.map(u => u.unit).join(", ")}
                </p>
              )}
              <p className="text-[11px] text-white/40 mt-1 italic">
                Optimal ranges are educational, drawn from published preventative-health literature, and are not medical advice.
              </p>
            </section>
          ) : (biomarker.normal_range_male || biomarker.normal_range_female) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {biomarker.normal_range_male && (
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="font-medium text-white block text-xs uppercase tracking-wide mb-1">Male</span>
                  <span className="text-white/70">{biomarker.normal_range_male}</span>
                </div>
              )}
              {biomarker.normal_range_female && (
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="font-medium text-white block text-xs uppercase tracking-wide mb-1">Female</span>
                  <span className="text-white/70">{biomarker.normal_range_female}</span>
                </div>
              )}
            </div>
          )}

          {biomarker.what_affects_it && (
            <section>
              <h4 className="font-medium text-white mb-1">What affects it</h4>
              <p className="text-white/70">{biomarker.what_affects_it}</p>
            </section>
          )}

          {biomarker.when_to_retest && (
            <section>
              <h4 className="font-medium text-white mb-1">When to retest</h4>
              <p className="text-white/70">{biomarker.when_to_retest}</p>
            </section>
          )}

          {!hasRichContent && biomarker.clinical_significance && (
            <section>
              <h4 className="font-medium text-white mb-1">Clinical significance</h4>
              <p className="text-white/70">{biomarker.clinical_significance}</p>
            </section>
          )}

          {biomarker.related_conditions && biomarker.related_conditions.length > 0 && (
            <section>
              <h4 className="font-medium text-white mb-1.5">Related conditions</h4>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.related_conditions.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </section>
          )}

          {biomarker.lifestyle_factors && biomarker.lifestyle_factors.length > 0 && (
            <section>
              <h4 className="font-medium text-white mb-1.5">Lifestyle factors</h4>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.lifestyle_factors.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs border-white/30 text-white">
                    {f}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {biomarker.last_reviewed_at && (
            <p className="text-[11px] text-white/40 pt-2 border-t border-white/10">
              Reviewed {new Date(biomarker.last_reviewed_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {biomarker.reviewed_by && ` · ${biomarker.reviewed_by}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BiomarkerDatabasePage() {
  const { biomarkers, isLoading, error } = useBiomarkersLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const bodySystems = useMemo(() => {
    const set = new Set<string>();
    biomarkers.forEach(b => b.body_system && set.add(b.body_system));
    return [...set].sort((a, b) => (BODY_SYSTEM_LABELS[a] ?? a).localeCompare(BODY_SYSTEM_LABELS[b] ?? b));
  }, [biomarkers]);

  const filteredBiomarkers = useMemo(() => {
    let results = biomarkers;
    if (selectedSystem) results = results.filter(b => b.body_system === selectedSystem);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(b =>
        b.biomarker_name.toLowerCase().includes(q) ||
        b.biomarker_code.toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q) ||
        (b.synonyms ?? []).some(s => s.toLowerCase().includes(q))
      );
    }
    return results;
  }, [searchQuery, selectedSystem, biomarkers]);

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
        <title>Biomarker Library | myhealth checkup</title>
        <meta name="description" content="Explore over 200 blood test biomarkers with normal and optimal ranges, what each one measures, why it matters, and when to retest." />
        <link rel="canonical" href="https://www.myhealthcheckup.co.uk/biomarker-database" />
      </Helmet>

      <Header />

      <PageBanner
        title="Biomarker"
        accent="Library"
        subtitle="Search and explore blood test biomarkers. Understand what each marker measures, normal versus optimal ranges, and when to retest."
      />

      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      <div className="min-h-screen bg-[hsl(220_5%_97%)]">
        <section className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          <div className="bg-white border-2 border-[#081129] rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, synonym (try 'HGB' or 'A1c')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {bodySystems.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[#081129] mb-2 uppercase tracking-wide">Body system</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 border-[#081129] min-h-[36px]",
                      !selectedSystem
                        ? "bg-[#e70d69] hover:bg-[#e70d69]/90 text-white"
                        : "bg-[#22c0d4] hover:bg-[#e70d69] text-white"
                    )}
                  >
                    All
                  </button>
                  {bodySystems.map((sys) => (
                    <button
                      key={sys}
                      onClick={() => setSelectedSystem(sys)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 border-[#081129] min-h-[36px]",
                        selectedSystem === sys
                          ? "bg-[#e70d69] hover:bg-[#e70d69]/90 text-white"
                          : "bg-[#22c0d4] hover:bg-[#e70d69] text-white"
                      )}
                    >
                      {BODY_SYSTEM_LABELS[sys] ?? sys}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

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
              <p className="text-muted-foreground text-sm mt-1">Try a different search term or body system.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedByCategory.map(([category, items]) => (
                <Collapsible key={category} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#081129]">
                      {category}
                      <span className="text-sm font-normal text-[#22c0d4] ml-2">({items.length})</span>
                    </h2>
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-3 mt-4">
                      {items.map((b) => <BiomarkerCard key={b.id} biomarker={b} />)}
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
