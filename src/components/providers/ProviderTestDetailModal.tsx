import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock, TestTube2, ExternalLink } from "lucide-react";
import { getBranding } from "@/data/providerBranding";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { getGoodbodyTestByName } from "@/data/goodbodyTestDetails";
import type { ProviderTestCardData } from "./ProviderTestCard";

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
    medichecks: "2 working days",
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
  if (!test) return null;

  const branding = getBranding(test.provider_id);
  const brandColor = branding?.primary || "#22c0d4";
  const accreditations = getAccreditations(test.provider_id);
  const tagline = getProviderTagline(test.provider_id);

  // For Goodbody, prioritize static curated data over database data
  const isGoodbody = test.provider_id.toLowerCase().includes("goodbody");
  const goodbodyStatic = isGoodbody ? getGoodbodyTestByName(test.test_name) : undefined;

  const biomarkers = goodbodyStatic?.biomarkers || parseBiomarkersList(test.biomarkers_list);
  const sampleBadges = getSampleBadges(goodbodyStatic?.sampleType || test.sample_type);
  const turnaround = goodbodyStatic?.turnaround || formatTurnaround(test.provider_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl gap-0 max-h-[90vh] overflow-y-auto">
        {/* Branded header */}
        <div className="p-6 pb-5 text-white relative" style={{ backgroundColor: brandColor }}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <p className="text-sm text-white/80 mb-1">
            {providerName} · {goodbodyStatic?.category || test.category || "General Health"}
          </p>
          <DialogTitle className="text-2xl font-bold text-white mb-3">
            {goodbodyStatic?.name || test.test_name}
          </DialogTitle>

          <div className="flex flex-wrap gap-2">
            {(goodbodyStatic?.price ?? test.price) != null && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
                £{(goodbodyStatic?.price ?? test.price!).toFixed(0)}
              </span>
            )}
            {(biomarkers.length > 0 || (test.biomarker_count && test.biomarker_count > 0)) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
                <TestTube2 className="w-3.5 h-3.5" />
                {biomarkers.length || test.biomarker_count} biomarkers
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
            <p className="text-base text-gray-700 leading-relaxed">{goodbodyStatic?.description || test.description}</p>
          )}

          {/* Collection method */}
          {sampleBadges.length > 0 && (
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
              <div className="flex flex-wrap gap-2">
                {biomarkers.map((b, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-full text-sm text-gray-700 bg-gray-100 border border-gray-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
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
          <div className="flex gap-3">
            {test.url ? (
              <Button
                className="flex-1 h-12 text-base font-semibold text-white"
                style={{ backgroundColor: brandColor }}
                asChild
              >
                <a href={test.url} target="_blank" rel="noopener noreferrer">
                  Book with {providerName} →
                </a>
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 text-base font-semibold text-white"
                style={{ backgroundColor: brandColor }}
                disabled
              >
                Book with {providerName} →
              </Button>
            )}
            <Button
              variant="outline"
              className="h-12 text-base font-semibold border-gray-200 hover:bg-gray-50"
              asChild
            >
              <Link to={`/compare?test=${encodeURIComponent(test.test_name)}`}>
                + Compare
              </Link>
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
