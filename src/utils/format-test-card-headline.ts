import { normaliseMedicalAcronyms } from "@/lib/medical-acronyms";
/**
 * Shortens a test name for card headlines without changing its catalogue name.
 * Only a terminal "Blood Test" phrase is removed.
 */
export const formatTestCardHeadline = (testName: string): string =>
  normaliseMedicalAcronyms(testName).replace(/\s+blood\s+test\s*$/i, "").trim();
