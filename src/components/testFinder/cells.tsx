import { Check, Home, Building2, Truck, Droplet, FlaskConical, TestTube, Stethoscope } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CollectionMethod, SampleType, TestRecord } from "@/types/testFinder";
import {
  COLLECTION_METHOD_LABEL,
  SAMPLE_TYPE_LABEL,
  clinicalReviewLabel,
} from "@/lib/testFinder/labels";
import { VerificationMark } from "./VerificationMark";
import { computeTotalCost, formatGBP } from "@/lib/testFinder/cost";

const sampleIcon = (s: SampleType) => {
  switch (s) {
    case "finger_prick":
      return <Droplet className="w-4 h-4" />;
    case "venous":
      return <TestTube className="w-4 h-4" />;
    case "saliva":
    case "urine":
    case "stool":
    case "buccal_swab":
      return <FlaskConical className="w-4 h-4" />;
    default:
      return <FlaskConical className="w-4 h-4" />;
  }
};

const methodIcon = (m: CollectionMethod) => {
  switch (m) {
    case "home_kit":
      return <Home className="w-4 h-4" />;
    case "clinic_appointment":
      return <Building2 className="w-4 h-4" />;
    case "home_visit":
    case "mobile_phlebotomy":
      return <Truck className="w-4 h-4" />;
    default:
      return <Building2 className="w-4 h-4" />;
  }
};

export const SampleTypeCell = ({ test }: { test: TestRecord }) => (
  <div className="flex items-center gap-2 text-ink">
    <span className="text-brand-turquoise">{sampleIcon(test.sample_type)}</span>
    <span className="text-sm">{SAMPLE_TYPE_LABEL[test.sample_type]}</span>
  </div>
);

export const CollectionMethodCell = ({ test }: { test: TestRecord }) => {
  if (!test.collection_method.length)
    return <span className="text-[#B8C1CB]">—</span>;
  const [primary, ...rest] = test.collection_method;
  return (
    <div className="flex items-center gap-2 text-ink">
      <span className="text-brand-turquoise">{methodIcon(primary)}</span>
      <span className="text-sm">{COLLECTION_METHOD_LABEL[primary]}</span>
      {rest.length > 0 && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-turquoise/15 text-brand-turquoise cursor-help">
                +{rest.length} more
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {rest.map((m) => COLLECTION_METHOD_LABEL[m]).join(" · ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export const AdditionalFeesCell = ({ test }: { test: TestRecord }) => {
  const t = test.collection_fee_type;
  if (t === "none") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#1F9D63] text-sm font-medium">
        <Check className="w-4 h-4" /> None
      </span>
    );
  }
  let label = "";
  if (t === "fixed") {
    const amt = typeof test.collection_fee_amount === "number" ? test.collection_fee_amount : 0;
    label = amt > 0 ? `Clinic blood draw +${formatGBP(amt)}` : "Clinic blood draw included";
  } else if (t === "range") {
    const r = test.collection_fee_amount as { min: number; max: number } | null;
    label = r ? `From ${formatGBP(r.min)}` : "Variable";
  } else if (t === "patient_arranged") {
    label = "Patient arranges own phlebotomy";
  } else {
    label = "Price varies by location";
  }
  const inner = (
    <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#FFF4E0] text-[#B26A00] text-xs font-medium">
      {label}
    </span>
  );
  return <VerificationMark status={test.verification.collection_fee}>{inner}</VerificationMark>;
};

export const ClinicalReviewCell = ({ test }: { test: TestRecord }) => {
  const label = clinicalReviewLabel(
    test.clinical_review_type,
    test.clinical_review_professional,
    test.clinical_review_fee,
  );
  const positive = test.clinical_review_type === "included";
  const muted =
    test.clinical_review_type === "not_included" || test.clinical_review_type === "not_available";

  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 text-sm ${
        positive ? "text-[#1F9D63] font-medium" : muted ? "text-[#8A97A6]" : "text-ink"
      }`}
    >
      {positive ? <Check className="w-4 h-4" /> : <Stethoscope className="w-4 h-4 opacity-70" />}
      {label}
    </span>
  );
  return <VerificationMark status={test.verification.clinical_review}>{inner}</VerificationMark>;
};

export const TotalCostCell = ({ test }: { test: TestRecord }) => {
  const c = computeTotalCost(test);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-[#8A97A6]">
        <span>Test price</span>
        <VerificationMark status={test.verification.price}>
          <span className="text-ink font-medium">{formatGBP(c.testPrice)}</span>
        </VerificationMark>
      </div>
      <div className="flex justify-between text-xs text-[#8A97A6]">
        <span>Additional fees</span>
        <VerificationMark status={test.verification.collection_fee}>
          <span className="text-ink">{c.addOnLabel}</span>
        </VerificationMark>
      </div>
      <div className="flex justify-between items-baseline pt-1 border-t border-black/10">
        <span className="text-xs font-semibold text-ink">
          {c.isEstimate ? "Estimate" : "Total"}
        </span>
        {c.tooltip ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-lg font-bold text-brand-pink cursor-help">
                  {formatGBP(c.total)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px] text-xs">{c.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-lg font-bold text-brand-pink">{formatGBP(c.total)}</span>
        )}
      </div>
    </div>
  );
};
