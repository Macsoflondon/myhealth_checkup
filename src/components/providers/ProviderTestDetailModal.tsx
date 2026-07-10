/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TestTube2, Home, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { getBranding } from "@/data/providerBranding";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { getGoodbodyTestByName } from "@/data/goodbodyTestDetails";
import type { ProviderTestCardData } from "./ProviderTestCard";
import { formatTestPrice } from "@/lib/utils";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import type { CompareTestData } from "@/types";
import { getProviderLogo } from "@/constants/providers";


interface ProviderTestDetailModalProps {
  test: ProviderTestCardData | null;
  providerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getAccreditations = (providerId: string): string[] => {
  const map: Record<string, string[]> = {
    medichecks: ["UKAS accredited lab", "ISO 15189", "CQC regulated"],
    goodbody: ["CQC regulated", "ISO 15189", "GP-reviewed"],
    "goodbody-clinic": ["CQC regulated", "ISO 15189", "GP-reviewed"],
    "randox-health": ["UKAS accredited lab", "ISO 15189", "50+ UK clinics"],
    randox: ["UKAS accredited lab", "ISO 15189", "50+ UK clinics"],
    thriva: ["ISO 13485", "CQC regulated labs", "CE-marked"],
    "lola-health": ["UKAS accredited lab", "ISO 15189", "GMC-reviewed"],
    lola: ["CQC regulated", "UKAS accredited lab"],
    "london-medical-laboratory": ["UKAS accredited lab", "ISO 15189", "GDPR compliant"],
    "tuli-health": ["CQC regulated", "UKAS accredited lab"],
    tuli: ["CQC regulated", "UKAS accredited lab"],
  };
  return map[providerId.toLowerCase()] || ["CQC regulated", "GDPR compliant"];
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
    "london-medical-laboratory": "Next day (in-store)",
    "tuli-health": "Same day – 24 hrs",
    tuli: "Same day – 24 hrs",
  };
  return defaults[providerId.toLowerCase()] || "2–5 working days";
};

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

const getCollectionLabel = (sampleType?: string | null, collectionOptions?: CollectionOption[] | null): string => {
  const st = (sampleType || "").toLowerCase();
  if (collectionOptions && collectionOptions.length > 0) {
    const m = collectionOptions[0].method.toLowerCase();
    if (m.includes("finger") || m.includes("home kit")) return "At-home kit";
    if (m.includes("clinic")) return "In-clinic";
    if (m.includes("home")) return "Home visit";
    return collectionOptions[0].method;
  }
  if (st.includes("finger") || st.includes("home")) return "At-home kit";
  if (st.includes("clinic") || st.includes("venous")) return "In-clinic";
  if (sampleType) return sampleType;
  return "See provider";
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

  const isGoodbody = test.provider_id.toLowerCase().includes("goodbody");
  const goodbodyStatic = isGoodbody ? getGoodbodyTestByName(test.test_name) : undefined;

  const biomarkers = goodbodyStatic?.biomarkers || parseBiomarkersList(test.biomarkers_list);
  const turnaround = test.turnaround_days_text || goodbodyStatic?.turnaround || formatTurnaround(test.provider_id);
  const collectionOptions: CollectionOption[] | null =
    goodbodyStatic?.collectionOptions && goodbodyStatic.collectionOptions.length > 0
      ? goodbodyStatic.collectionOptions
      : Array.isArray(test.collection_options) && test.collection_options.length > 0
        ? (test.collection_options as CollectionOption[])
        : PROVIDER_DEFAULT_COLLECTION_OPTIONS[test.provider_id.toLowerCase()] ?? null;

  const displayedBiomarkerCount = biomarkers.length > 0
    ? biomarkers.length
    : (test.biomarker_count ?? 0);

  const headerPrice = test.base_price ?? goodbodyStatic?.price ?? test.price;
  const priceIsFrom = test.base_price != null && test.base_price > 0;
  const priceFormatted = headerPrice != null && (headerPrice as number) > 0
    ? (formatTestPrice({ ...test, price: headerPrice as number }) || `£${(headerPrice as number).toFixed(2)}`)
    : null;

  const collectionLabel = getCollectionLabel(goodbodyStatic?.sampleType || test.sample_type, collectionOptions);
  const providerLogo = getProviderLogo(test.provider_id);

  const handleCompare = () => {
    const compareTest: CompareTestData = {
      id: test.id,
      name: test.test_name,
      provider: providerName,
      price: (test.base_price ?? test.price ?? 0) as number,
      category: test.category || "General Health",
      description: test.description || "",
      available: true,
      features: {
        turnaround,
        collection: test.sample_type || "See provider",
      },
      providerLogo: "",
      biomarkerCount: displayedBiomarkerCount,
      url: test.url || undefined,
    };
    if (inCompare) {
      compareStore.remove(test.id);
    } else {
      compareStore.add(compareTest);
    }
    onOpenChange(false);
    navigate("/compare?openCompare=1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-2xl p-0 rounded-2xl gap-0 max-h-[90vh] overflow-y-auto overflow-x-hidden bg-[#f6f7fb] [&>button.absolute]:text-white [&>button.absolute]:opacity-90 [&>button.absolute]:hover:opacity-100 [&>button.absolute]:focus:ring-white/60">
        {/* Navy header */}
        <div className="bg-[#081129] text-white p-6 pb-7 pr-14">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
              <img
                src={providerLogo}
                alt={providerName}
                loading="lazy"
                decoding="async"
                className="max-h-10 max-w-12 object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling?.removeAttribute("hidden");
                }}
              />
              <span hidden className="text-xl font-bold" style={{ color: brandColor }}>
                {getProviderInitial(providerName)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#22c0d4] mb-1 truncate">
                {providerName}
              </p>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white leading-tight break-words">
                {goodbodyStatic?.name || test.test_name}
              </DialogTitle>
            </div>
          </div>

          {/* Price + info chips row */}
          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
            {priceFormatted && (
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#e70d69] leading-none">
                  {priceIsFrom ? <span className="text-2xl font-bold">from </span> : null}
                  {priceFormatted}
                </p>
                <p className="text-xs text-white/70 mt-1.5">{collectionLabel}</p>
              </div>
            )}

            {displayedBiomarkerCount > 0 && (
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full border border-[#22c0d4]/40 flex items-center justify-center text-[#22c0d4]">
                  <TestTube2 className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">{displayedBiomarkerCount} biomarkers</p>
                  <p className="text-xs text-white/60">Measured</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full border border-[#22c0d4]/40 flex items-center justify-center text-[#22c0d4]">
                <Home className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">{collectionLabel}</p>
                <p className="text-xs text-white/60">Collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 bg-[#f6f7fb]">
          {/lola\s*health/i.test(providerName) && (
            <div className="rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
              <strong className="block mb-0.5">Add-on only</strong>
              This test can only be purchased when bundled with one of Lola Health's full test panels.
            </div>
          )}

          {/* About */}
          {(goodbodyStatic?.description || test.description) && (
            <section>
              <h4 className="text-xs font-bold text-[#081129] uppercase tracking-[0.15em] mb-2">
                About this test
              </h4>
              <p className="text-[15px] text-[#081129]/80 leading-relaxed whitespace-pre-line break-words">
                {goodbodyStatic?.description || test.description}
              </p>
            </section>
          )}

          {/* Standards & accreditation */}
          <section>
            <h4 className="text-xs font-bold text-[#081129] uppercase tracking-[0.15em] mb-3">
              Standards &amp; Accreditation
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {accreditations.map((acc) => (
                <span key={acc} className="inline-flex items-center gap-2 text-sm text-[#081129]/85">
                  <span className="w-5 h-5 rounded-full border border-[#22c0d4] flex items-center justify-center text-[#22c0d4]">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {acc}
                </span>
              ))}
            </div>
          </section>

          {/* Collection options (when multiple) */}
          {collectionOptions && collectionOptions.length > 1 && (
            <section>
              <h4 className="text-xs font-bold text-[#081129] uppercase tracking-[0.15em] mb-2">
                Collection Options
              </h4>
              <ul className="space-y-1.5">
                {collectionOptions.map((opt) => (
                  <li
                    key={opt.method}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-[#081129]/85 border border-[#081129]/10 bg-white rounded-lg px-3 py-2"
                  >
                    <span className="min-w-0 break-words">{opt.method}</span>
                    <span className="font-semibold whitespace-nowrap text-[#22c0d4]">
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
            </section>
          )}

          {/* Biomarkers */}
          {biomarkers.length > 0 && (
            <section>
              <h4 className="text-xs font-bold text-[#081129] uppercase tracking-[0.15em] mb-2">
                Biomarkers Included
              </h4>
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {(showAllBiomarkers ? biomarkers : biomarkers.slice(0, 24)).map((b, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-full text-sm text-[#081129]/80 bg-white border border-[#081129]/10 break-words"
                  >
                    {b}
                  </span>
                ))}
              </div>
              {biomarkers.length > 24 && (
                <button
                  type="button"
                  onClick={() => setShowAllBiomarkers((v) => !v)}
                  className="mt-2 text-xs font-semibold underline text-[#22c0d4]"
                >
                  {showAllBiomarkers ? "Show fewer" : `Show all ${biomarkers.length}`}
                </button>
              )}
            </section>
          )}

          {/* Disclaimer */}
          <div className="border-l-4 border-[#22c0d4] bg-[#22c0d4]/10 rounded-r-lg px-4 py-3">
            <p className="text-sm text-[#081129]/80 leading-relaxed flex gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22c0d4] shrink-0 mt-0.5" />
              <span>
                myhealth checkup is an independent comparison platform. We do not provide medical advice. Always confirm test details, pricing, and availability directly with the provider before booking.
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              variant="outline"
              onClick={handleCompare}
              className="flex-1 h-14 text-sm font-semibold rounded-full bg-white border-2 border-[#22c0d4] text-[#22c0d4] hover:bg-[#22c0d4] hover:text-white transition-colors"
            >
              {inCompare ? (
                <><Check className="w-4 h-4 mr-1.5" /> In compare — view list</>
              ) : (
                <>+ Compare this test</>
              )}
            </Button>

            {test.url ? (
              <Button
                asChild
                className="flex-1 h-14 text-base font-semibold rounded-full bg-[#e70d69] hover:bg-[#22c0d4] text-white transition-colors duration-300 shadow-md"
              >
                <a href={test.url} target="_blank" rel="noopener noreferrer">
                  Book
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            ) : (
              <Button
                disabled
                className="flex-1 h-14 text-base font-semibold rounded-full bg-[#e70d69] text-white opacity-60"
              >
                Book
              </Button>
            )}
          </div>

          {test.url && (
            <p className="text-center text-xs text-[#081129]/50">
              You'll be taken to {providerName}'s website to complete your booking.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
