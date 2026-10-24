/**
 * Plain-English display names for abbreviated provider test names.
 *
 * Code-reviewed on purpose: each entry changes the page title, H1 and meta
 * description, so add entries only for unambiguous abbreviations. The
 * provider's exact name is always shown alongside the display name.
 */
interface DisplayNameRule {
  readonly pattern: RegExp;
  readonly displayName: string;
  readonly relatedLinks?: readonly RelatedTestLink[];
}

export interface RelatedTestLink {
  readonly label: string;
  readonly href: string;
}

const GLUCOSE_LINKS: readonly RelatedTestLink[] = [
  { label: "Diabetes and blood sugar tests", href: "/tests/diabetes" },
  { label: "Glucose biomarker", href: "/biomarker-database?search=glucose" },
  { label: "HbA1c biomarker", href: "/biomarker-database?search=HbA1c" },
];

const RULES: readonly DisplayNameRule[] = [
  {
    pattern: /^\s*OGTT\b/i,
    displayName: "Oral Glucose Tolerance Test (OGTT)",
    relatedLinks: GLUCOSE_LINKS,
  },
];

const findRule = (testName: string | null | undefined) =>
  typeof testName === "string"
    ? RULES.find((rule) => rule.pattern.test(testName))
    : undefined;

/** Display name for headings and metadata; the raw name when no rule applies. */
export const getTestDisplayName = (testName: string): string =>
  findRule(testName)?.displayName ?? testName;

/** True when the display name differs from the provider's own test name. */
export const hasPlainEnglishName = (testName: string): boolean =>
  findRule(testName) !== undefined;

/** Hand-picked related pages for mapped tests; empty when none apply. */
export const getRelatedTestLinks = (
  testName: string,
): readonly RelatedTestLink[] => findRule(testName)?.relatedLinks ?? [];
