/**
 * Shared normaliser for `provider_tests.biomarkers_list`.
 *
 * The column holds two shapes across providers:
 *   - a plain string array:      ["Ferritin", "TSH"]
 *   - an array of value objects: [{ value: "Ferritin" }, { value: "TSH" }]
 *
 * Every card, modal and adapter must go through this so a published list is
 * never rendered as "not published" (or as "[object Object]") purely because
 * of the stored shape.
 */
export type BiomarkerListInput =
  | ReadonlyArray<string | { value?: string | null } | null | undefined>
  | null
  | undefined
  | unknown;

export function normalizeBiomarkers(list: BiomarkerListInput): string[] {
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  for (const entry of list) {
    if (typeof entry === "string") {
      const v = entry.trim();
      if (v) out.push(v);
      continue;
    }
    if (entry && typeof entry === "object") {
      const value = (entry as { value?: unknown }).value;
      if (typeof value === "string" && value.trim()) out.push(value.trim());
    }
  }
  return out;
}
