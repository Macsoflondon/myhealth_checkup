import { BiomarkerChipList } from "@/components/tests/BiomarkerChipList";
import {
  formatCatalogueMoney,
  type EducationalProvider,
} from "@/services/educational-test-catalogue";

export function EducationalProviderDetails({
  provider,
}: {
  provider: EducationalProvider;
}) {
  return (
    <div className="min-w-0 space-y-2 text-xs text-on-dark-muted break-words">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          {provider.biomarkers === null
            ? "Not stated"
            : `${provider.biomarkers} biomarkers`}
        </span>
        <span className="min-w-0 break-words">{provider.turnaround}</span>
        <span className="min-w-0 break-words">{provider.collection}</span>
      </div>
      <p>Locations: {provider.locations}</p>
      <p>
        Test price: {formatCatalogueMoney(provider.testPrice)} · Collection fee:{" "}
        {provider.collectionFee} · Clinical review: {provider.reviewFee}
      </p>
      <details className="[&_h4]:text-on-dark [&_button]:text-brand-turquoise [&_span]:text-brand-navy">
        <summary className="inline-flex min-h-6 cursor-pointer items-center underline">
          Biomarkers included
        </summary>
        <BiomarkerChipList
          biomarkers={provider.biomarkerNames}
          publishedCount={provider.biomarkers}
        />
      </details>
      <p>
        Source: {provider.name} · Last updated{" "}
        {provider.checkedAt
          ? new Date(provider.checkedAt).toLocaleDateString("en-GB")
          : "Not stated"}
      </p>
    </div>
  );
}
