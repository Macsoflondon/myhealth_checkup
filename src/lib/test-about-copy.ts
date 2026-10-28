/**
 * Platform-written "About this test" sentence. Never replaces or edits the
 * provider's own description.
 *
 * - 1 to 3 biomarkers: states plainly what the test measures.
 * - 4 or more biomarkers: the provider's broad-coverage text applies.
 * - No biomarker list: no fallback paragraph, so nothing contradicts the page.
 */
const MAX_NAMED = 3;

const joinNames = (names: readonly string[]): string => {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

export const buildTestAboutCopy = ({
  testName,
  providerName,
  biomarkers,
  biomarkerCount,
  panelAboutText,
}: {
  testName: string;
  providerName: string;
  biomarkers: readonly string[] | null | undefined;
  biomarkerCount?: number | null;
  panelAboutText: string;
}): string | null => {
  const names = (biomarkers ?? [])
    .map((b) => (typeof b === "string" ? b.trim() : ""))
    .filter((b) => b.length > 0);
  const count = Math.max(names.length, biomarkerCount ?? 0);

  if (names.length > 0 && count <= MAX_NAMED) {
    const noun = names.length === 1 ? "biomarker" : "biomarkers";
    return `The ${testName} from ${providerName} measures ${names.length} ${noun}: ${joinNames(names)}.`;
  }
  if (count > MAX_NAMED) {
    return `The ${testName} from ${providerName} is a ${panelAboutText}`;
  }
  return null;
};
