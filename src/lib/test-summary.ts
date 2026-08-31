/**
 * Builds a factual, human-readable summary for a test listing when the
 * provider has not published its own description.
 *
 * Every clause is derived from data we hold for that listing (measurement
 * count, sample method, turnaround, provider name) — nothing is invented, so
 * the copy stays compliant and useful for both visitors and crawlers.
 */

export interface TestSummaryInput {
  readonly testName: string;
  readonly providerName?: string | null;
  readonly measurementCount?: number | null;
  /** biomarkers | cancers | allergens | conditions */
  readonly measurementType?: string | null;
  readonly sampleType?: string | null;
  readonly collectionMethod?: string | null;
  readonly turnaroundText?: string | null;
  readonly category?: string | null;
  readonly homeKitAvailable?: boolean | null;
  readonly clinicVisitAvailable?: boolean | null;
}

const MEASUREMENT_LABELS: Record<string, [string, string]> = {
  biomarkers: ["biomarker", "biomarkers"],
  cancers: ["cancer signal", "cancer signals"],
  allergens: ["allergen", "allergens"],
  conditions: ["condition", "conditions"],
};

const measurementLabel = (count: number, type?: string | null): string => {
  const key = (type ?? "biomarkers").toLowerCase();
  const pair = MEASUREMENT_LABELS[key] ?? MEASUREMENT_LABELS["biomarkers"]!;
  return count === 1 ? pair[0] : pair[1];
};

const tidy = (value?: string | null): string => (value ?? "").trim().replace(/\s+/g, " ");

const lowerFirst = (value: string): string =>
  value.length > 1 && value.slice(1) === value.slice(1).toLowerCase()
    ? value.charAt(0).toLowerCase() + value.slice(1)
    : value;

/**
 * Returns a summary sentence for a listing, or an empty string when we hold
 * too little data to say anything substantive.
 */
export const buildTestSummary = (input: TestSummaryInput): string => {
  const name = tidy(input.testName);
  if (!name) return "";

  const provider = tidy(input.providerName);
  const sentences: string[] = [];

  const count = input.measurementCount ?? null;
  const category = tidy(input.category);

  const opening = provider
    ? `${name} is a private ${category ? `${lowerFirst(category)} ` : ""}test from ${provider}`
    : `${name} is a private ${category ? `${lowerFirst(category)} ` : ""}test`;

  sentences.push(
    count && count > 0
      ? `${opening}, covering ${count} ${measurementLabel(count, input.measurementType)}.`
      : `${opening}.`,
  );

  const collection = tidy(input.collectionMethod) || tidy(input.sampleType);
  const collectionOptions: string[] = [];
  if (input.homeKitAvailable) collectionOptions.push("an at-home kit");
  if (input.clinicVisitAvailable) collectionOptions.push("a clinic appointment");

  if (collection) {
    sentences.push(
      collectionOptions.length > 0
        ? `Sample collection is by ${lowerFirst(collection)}, available via ${collectionOptions.join(" or ")}.`
        : `Sample collection is by ${lowerFirst(collection)}.`,
    );
  } else if (collectionOptions.length > 0) {
    sentences.push(`Available via ${collectionOptions.join(" or ")}.`);
  }

  const turnaround = tidy(input.turnaroundText)
    // Provider feeds prefix their own wording ("Results typically within 2
    // days"), which would otherwise duplicate the sentence stem below.
    .replace(/^results?\b[:,-]?\s*/i, "")
    .replace(/^(are\s+)?(typically|usually|generally|normally)\s+/i, "")
    .replace(/^(returned|available|delivered|back)\s+/i, "")
    .replace(/^(in|within)\s+/i, "")
    .replace(/\s+results?$/i, "");
  if (turnaround && (/\d/.test(turnaround) || /next day/i.test(turnaround))) {
    sentences.push(`Results are typically returned in ${lowerFirst(turnaround)}.`);
  }



  // A lone opening sentence with no count or logistics adds nothing beyond the
  // card title, so treat it as no summary at all.
  if (sentences.length === 1 && !(count && count > 0)) return "";

  return sentences.join(" ");
};

/**
 * Summary for display: the provider's own description when present, otherwise
 * a generated factual summary, otherwise an empty string.
 */

/**
 * Provider-level boilerplate that some feeds repeat verbatim across dozens of
 * listings. It says nothing about the individual test, so we generate a
 * factual summary from the listing's own data instead.
 */
const GENERIC_DESCRIPTION_PATTERNS: readonly RegExp[] = [
  /^lola health offers home blood testing/i,
  /^price includes the premium report\.?$/i,
];

export const isGenericDescription = (description?: string | null): boolean => {
  const value = tidy(description);
  if (!value) return true;
  return GENERIC_DESCRIPTION_PATTERNS.some((re) => re.test(value));
};

export const resolveTestSummary = (
  description: string | null | undefined,
  input: TestSummaryInput,
): string => {
  const provided = tidy(description);
  if (provided && !isGenericDescription(provided)) return provided;
  return buildTestSummary(input) || provided;
};

