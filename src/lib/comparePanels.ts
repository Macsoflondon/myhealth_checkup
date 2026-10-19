/**
 * Matching rules for the live-comparison panels shown on the homepage.
 * Each slug resolves to the equivalent test across providers so the
 * "Compare all providers" CTA can rebuild the same set on /compare/results.
 * No new data — this only narrows the existing catalogue.
 */

export interface ComparePanelConfig {
  /** Human label used in copy. */
  readonly label: string;
  /** Optional canonical_category narrowing. */
  readonly canonicals?: readonly string[];
  /** Test-name fragments (OR-matched, case-insensitive). */
  readonly includeNames: readonly string[];
  /** Test-name fragments to exclude. */
  readonly excludeNames?: readonly string[];
}

export const COMPARE_PANELS: Record<string, ComparePanelConfig> = {
  "full-blood-count": {
    label: "Full Blood Count",
    // Standalone haematology profiles are FBC (+ differential) listings under
    // another name; multi-panel biochemistry bundles are excluded.
    includeNames: [
      "full blood count",
      "complete blood count",
      "hematology profile",
      "haematology profile",
    ],
    excludeNames: ["biochemistry", "iron and fbc"],
  },
  thyroid: {
    label: "Thyroid Function",
    canonicals: ["thyroid"],
    includeNames: ["thyroid"],
  },
  "male-hormones": {
    label: "Male Hormone Panel",
    canonicals: ["mens-health"],
    includeNames: ["male hormone"],
  },
  "female-hormones": {
    label: "Female Hormone Panel",
    canonicals: ["womens-health"],
    includeNames: ["female hormone"],
  },
};

export const getComparePanel = (
  slug: string | null | undefined,
): ComparePanelConfig | null => (slug ? (COMPARE_PANELS[slug] ?? null) : null);
