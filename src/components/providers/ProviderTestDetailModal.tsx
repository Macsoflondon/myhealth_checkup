import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, TestTube2, Check } from "lucide-react";
import { getBranding } from "@/data/providerBranding";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { getGoodbodyTestByName } from "@/data/goodbodyTestDetails";
import type { ProviderTestCardData } from "./ProviderTestCard";
import { formatTestPrice } from "@/lib/utils";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import type { CompareTestData } from "@/types";


interface ProviderTestDetailModalProps {
  test: ProviderTestCardData | null;
  providerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getAccreditations = (providerId: string): string[] => {
  const map: Record<string, string[]> = {
    medichecks: ["UKAS", "ISO 15189", "CQC"],
    goodbody: ["CQC", "ISO 15189"],
    "goodbody-clinic": ["CQC", "ISO 15189"],
    "randox-health": ["UKAS", "ISO 15189", "40+ Clinics UK"],
    randox: ["UKAS", "ISO 15189", "40+ Clinics UK"],
    thriva: ["ISO 13485", "CQC regulated labs", "CE-marked"],
    "lola-health": ["CQC", "UKAS"],
    lola: ["CQC", "UKAS"],
    "london-medical-laboratory": ["CQC", "ISO 15189"],
    "tuli-health": ["CQC", "UKAS"],
    tuli: ["CQC", "UKAS"],
  };
  return map[providerId.toLowerCase()] || ["CQC"];
};

const getProviderTagline = (providerId: string): string => {
  const provider = detailedProviders.find(
    (p) => p.id.toLowerCase() === providerId.toLowerCase() ||
      providerId.toLowerCase().startsWith(p.id.toLowerCase())
  );
  if (provider?.keyDifferentiators) {
    return provider.keyDifferentiators.split(",")[0].trim();
  }
  return "Trusted UK health testing provider";
};

const formatTurnaround = (providerId: string): string => {
  const defaults: Record<string, string> = {
    medichecks: "2-3 working days",
    "goodbody-clinic": "3–5 working days",
    goodbody: "3–5 working days",
    "randox-health": "24 hours",
    randox: "24 hours",
    thriva: "2–4 days",
    "lola-health": "3–5 working days",
    "london-medical-laboratory": "3 working days",
    "tuli-health": "Same day – 24 hrs",
    tuli: "Same day – 24 hrs",
  };
  return defaults[providerId.toLowerCase()] || "2–5 working days";
};

/**
 * Standard collection-option fallbacks per provider, used when the test row has
 * no `collection_options` JSON. Keeps the modal layout consistent across all
 * providers (matches the Lola Health reference design).
 */
type CollectionOption = {
  method: string;
  price_modifier?: number;
  price?: number;
  note?: string;
};

const PROVIDER_DEFAULT_COLLECTION_OPTIONS: Record<string, CollectionOption[]> = {
  "lola-health": [
    { method: "In-clinic phlebotomy", price_modifier: 35 },
    { method: "At-home phlebotomy", price_modifier: 35 },
    { method: "Self-arranged phlebotomist", price_modifier: 0, note: "Free" },
  ],
  medichecks: [
    { method: "Finger-prick home kit", price_modifier: 0, note: "Included" },
    { method: "Venous home phlebotomist", price_modifier: 35 },
    { method: "Clinic phlebotomy", price_modifier: 25 },
  ],
  "london-medical-laboratory": [
    { method: "Finger-prick home kit", price_modifier: 0, note: "Included" },
    { method: "Venous clinic draw", price_modifier: 35 },
    { method: "Home phlebotomist visit", price_modifier: 45 },
  ],
  "goodbody-clinic": [
    { method: "In-clinic venous draw", price_modifier: 0, note: "Included" },
  ],
  goodbody: [
    { method: "In-clinic venous draw", price_modifier: 0, note: "Included" },
  ],
  randox: [
    { method: "In-clinic appointment", price_modifier: 0, note: "Included" },
    { method: "Home visit (selected areas)", price_modifier: 0, note: "POA" },
  ],
  "randox-health": [
    { method: "In-clinic appointment", price_modifier: 0, note: "Included" },
    { method: "Home visit (selected areas)", price_modifier: 0, note: "POA" },
  ],
  thriva: [
    { method: "Finger-prick home kit", price_modifier: 0, note: "Included" },
    { method: "Venous home phlebotomist", price_modifier: 35 },
  ],
  "tuli-health": [
    { method: "In-clinic appointment", price_modifier: 0, note: "Included" },
  ],
  tuli: [
    { method: "In-clinic appointment", price_modifier: 0, note: "Included" },
  ],
};

const parseBiomarkersList = (biomarkersList: any): string[] => {
  if (!biomarkersList) return [];
  if (Array.isArray(biomarkersList)) {
    return biomarkersList.map((b: any) => (typeof b === "string" ? b : b.name || b.biomarker_name || String(b)));
  }
  if (typeof biomarkersList === "object") {
    return Object.values(biomarkersList).map(String);
  }
  return [];
};

const getSampleBadges = (sampleType?: string | null) => {
  const badges: { label: string; type: "venous" | "finger-prick" }[] = [];
  const st = (sampleType || "").toLowerCase();
  if (st.includes("finger") || st.includes("prick")) {
    badges.push({ label: "Finger-prick", type: "finger-prick" });
  }
  if (st.includes("venous") || st.includes("blood")) {
    badges.push({ label: "Venous", type: "venous" });
  }
  if (badges.length === 0 && sampleType) {
    badges.push({ label: sampleType, type: "venous" });
  }
  return badges;
};

const getProviderInitial = (name: string) => name.charAt(0).toUpperCase();

export default function ProviderTestDetailModal({
  test,
  providerName,
  open,
  onOpenChange,
}: ProviderTestDetailModalProps) {
  const navigate = useNavigate();
  const compareItems = useCompareItems();
  const [showAllBiomarkers, setShowAllBiomarkers] = useState(false);
  if (!test) return null;
  const inCompare = compareStore.has(test.id);


  const branding = getBranding(test.provider_id);
  const brandColor = branding?.primary || "#22c0d4";
  const accreditations = getAccreditations(test.provider_id);
  const tagline = getProviderTagline(test.provider_id);

  // For Goodbody, prioritize static curated data over database data
  const isGoodbody = test.provider_id.toLowerCase().includes("goodbody");
  const goodbodyStatic = isGoodbody ? getGoodbodyTestByName(test.test_name) : undefined;

  const biomarkers = goodbodyStatic?.biomarkers || parseBiomarkersList(test.biomarkers_list);
  const sampleBadges = getSampleBadges(goodbodyStatic?.sampleType || test.sample_type);
  const turnaround = test.turnaround_days_text || goodbodyStatic?.turnaround || formatTurnaround(test.provider_id);
  const collectionOptions: CollectionOption[] | null =
    goodbodyStatic?.collectionOptions && goodbodyStatic.collectionOptions.length > 0
      ? goodbodyStatic.collectionOptions
      : Array.isArray(test.collection_options) && test.collection_options.length > 0
        ? (test.collection_options as CollectionOption[])
        : PROVIDER_DEFAULT_COLLECTION_OPTIONS[test.provider_id.toLowerCase()] ?? null;

  // Authoritative biomarker count: the list is the source of truth when present.
  // Only fall back to the stored count when there is no list at all.
  const displayedBiomarkerCount = biomarkers.length > 0
    ? biomarkers.length
    : (test.biomarker_count ?? 0);

  // Pricing: show "from £X" when a base price is set (lowest available tier)
  const headerPrice = test.base_price ?? goodbodyStatic?.price ?? test.price;
  const priceIsFrom = test.base_price != null && test.base_price > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-2xl p-0 rounded-2xl gap-0 max-h-[90vh] overflow-y-auto overflow-x-hidden [&>button.absolute]:text-white [&>button.absolute]:opacity-90 [&>button.absolute]:hover:opacity-100 [&>button.absolute]:focus:ring-white/60">
        {/* Branded header */}
        <div className="p-6 pb-5 pr-14 text-white relative" style={{ backgroundColor: brandColor }}>
          <p className="text-sm text-white/80 mb-1">
            {providerName} · {goodbodyStatic?.category || test.category || "General Health"}
          </p>
          <DialogTitle className="text-2xl font-bold text-white mb-3 break-words pr-2">
            {goodbodyStatic?.name || test.test_name}
          </DialogTitle>

          <div className="flex flex-wrap gap-2">
            {headerPrice != null && (headerPrice as number) > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
                {priceIsFrom ? "from " : ""}
                {formatTestPrice({ ...test, price: headerPrice as number }) || `£${(headerPrice as number).toFixed(0)}`}
              </span>
            )}
            {displayedBiomarkerCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
                <TestTube2 className="w-3.5 h-3.5" />
                {displayedBiomarkerCount} biomarkers
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
              <Clock className="w-3.5 h-3.5" />
              {turnaround}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {(goodbodyStatic?.description || test.description) && (
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line break-words">
              {goodbodyStatic?.description || test.description}
            </p>
          )}

          {/* Collection method */}
          {collectionOptions && collectionOptions.length > 0 ? (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Collection Options
              </h4>
              <ul className="space-y-1.5">
                {collectionOptions.map((opt) => (
                  <li
                    key={opt.method}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <span className="min-w-0 break-words">{opt.method}</span>
                    <span className="font-semibold whitespace-nowrap" style={{ color: brandColor }}>
                      {opt.note
                        ?? (typeof opt.price === "number"
                          ? `£${opt.price}`
                          : (opt.price_modifier ?? 0) > 0
                            ? `+£${opt.price_modifier}`
                            : "Free")}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Choose your preferred way to provide the sample at checkout.
              </p>
            </div>
          ) : sampleBadges.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Collection Method
              </h4>
              <div className="flex flex-wrap gap-2">
                {sampleBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${
                      badge.type === "finger-prick"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    <span>{badge.type === "finger-prick" ? "💧" : "🩸"}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Biomarkers */}
          {biomarkers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Biomarkers Included
              </h4>
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {(showAllBiomarkers ? biomarkers : biomarkers.slice(0, 24)).map((b, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-full text-sm text-gray-700 bg-gray-100 border border-gray-200 break-words"
                  >
                    {b}
                  </span>
                ))}
              </div>
              {biomarkers.length > 24 && (
                <button
                  type="button"
                  onClick={() => setShowAllBiomarkers((v) => !v)}
                  className="mt-2 text-xs font-semibold underline"
                  style={{ color: brandColor }}
                >
                  {showAllBiomarkers ? "Show fewer" : `Show all ${biomarkers.length}`}
                </button>
              )}
            </div>
          )}

          {/* Provider info card */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: `${brandColor}08` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: brandColor }}
              >
                {getProviderInitial(providerName)}
              </span>
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>
                  {providerName}
                </p>
                <p className="text-sm text-gray-500">{tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {accreditations.map((acc) => (
                <span
                  key={acc}
                  className="inline-block px-2.5 py-1 rounded-md text-xs font-medium border"
                  style={{ borderColor: `${brandColor}40`, color: brandColor }}
                >
                  {acc}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {test.url ? (
              <Button
                className="h-12 text-sm font-semibold text-white"
                style={{ backgroundColor: brandColor }}
                asChild
              >
                <a href={test.url} target="_blank" rel="noopener noreferrer">
                  Book test →
                </a>
              </Button>
            ) : (
              <Button
                className="h-12 text-sm font-semibold text-white"
                style={{ backgroundColor: brandColor }}
                disabled
              >
                Book test →
              </Button>
            )}
            <Button
              variant="outline"
              className="h-12 text-sm font-semibold border-gray-200 hover:bg-gray-50"
              asChild
            >
              <Link to={`/compare?test=${encodeURIComponent(test.test_name)}`}>
                + Compare
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="h-12 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              ← Back
            </Button>
          </div>

          {test.url && (
            <p className="text-center text-xs text-gray-400">
              You'll be taken to {providerName}'s website to complete your booking.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
