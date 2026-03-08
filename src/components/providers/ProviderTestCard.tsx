import { Clock, TestTube2, Star } from "lucide-react";
import { getBranding } from "@/data/providerBranding";

export interface ProviderTestCardData {
  id: string;
  provider_id: string;
  test_name: string;
  description?: string | null;
  price?: number | null;
  category?: string | null;
  sample_type?: string | null;
  biomarker_count?: number | null;
  is_popular?: boolean | null;
  url?: string | null;
  biomarkers_list?: any;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
}

interface ProviderTestCardProps {
  test: ProviderTestCardData;
  providerName: string;
  turnaroundTime?: string;
  onClick: () => void;
}

const getSampleBadges = (sampleType?: string | null, homeKit?: boolean | null, clinicVisit?: boolean | null) => {
  const badges: { label: string; type: "venous" | "finger-prick" }[] = [];
  const st = (sampleType || "").toLowerCase();

  if (st.includes("finger") || st.includes("prick") || homeKit) {
    badges.push({ label: "Finger-prick", type: "finger-prick" });
  }
  if (st.includes("venous") || st.includes("blood") || clinicVisit) {
    badges.push({ label: "Venous", type: "venous" });
  }
  if (badges.length === 0 && sampleType) {
    badges.push({ label: sampleType, type: "venous" });
  }
  return badges;
};

const formatTurnaround = (provider_id: string): string => {
  // Default turnaround estimates by provider
  const defaults: Record<string, string> = {
    medichecks: "2 working days",
    "goodbody-clinic": "3–5 working days",
    goodbody: "3–5 working days",
    "randox-health": "24 hours",
    randox: "24 hours",
    thriva: "2–4 days",
    "lola-health": "3–5 working days",
    lola: "3–5 working days",
    "london-medical-laboratory": "3 working days",
    "tuli-health": "Same day – 24 hrs",
    tuli: "Same day – 24 hrs",
  };
  return defaults[provider_id.toLowerCase()] || "2–5 working days";
};

const getProviderInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

export default function ProviderTestCard({ test, providerName, turnaroundTime, onClick }: ProviderTestCardProps) {
  const branding = getBranding(test.provider_id);
  const brandColor = branding?.primary || "#22c0d4";
  const sampleBadges = getSampleBadges(test.sample_type, test.home_kit_available, test.clinic_visit_available);
  const turnaround = turnaroundTime || formatTurnaround(test.provider_id);

  return (
    <article
      className="bg-white rounded-xl border-2 overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all duration-200"
      style={{ borderColor: `${brandColor}30` }}
      onClick={onClick}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: brandColor }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: Provider badge + Popular tag */}
        <div className="flex items-start justify-between mb-3">
          {/* Provider badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: brandColor }}
            >
              {getProviderInitial(providerName)}
            </span>
            {providerName}
          </div>

          {/* Popular badge */}
          {test.is_popular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Popular
            </span>
          )}
        </div>

        {/* Test name */}
        <h3 className="text-lg font-bold text-[#081129] leading-tight mb-2 line-clamp-2">
          {test.test_name}
        </h3>

        {/* Description */}
        {test.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {test.description}
          </p>
        )}

        {/* Sample type badges */}
        {sampleBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleBadges.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  badge.type === "finger-prick"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                <span className="text-xs">
                  {badge.type === "finger-prick" ? "💧" : "🩸"}
                </span>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + turnaround + biomarkers row */}
        <div className="flex items-end justify-between mt-2 mb-3">
          <span className="text-2xl font-bold" style={{ color: brandColor }}>
            {test.price ? `£${test.price.toFixed(0)}` : "Price on request"}
          </span>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 justify-end">
              <Clock className="w-3.5 h-3.5" />
              <span>{turnaround}</span>
            </div>
            {test.biomarker_count && test.biomarker_count > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 justify-end">
                <TestTube2 className="w-3.5 h-3.5" />
                <span className="font-medium">{test.biomarker_count} biomarkers</span>
              </div>
            )}
          </div>
        </div>

        {/* Category badge */}
        {test.category && (
          <span
            className="self-start inline-block px-2.5 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${brandColor}10`,
              color: brandColor,
            }}
          >
            {test.category}
          </span>
        )}
      </div>
    </article>
  );
}
