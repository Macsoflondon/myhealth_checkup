/**
 * Structured data builders for the compare detail pages.
 *
 * Search engines cannot infer what a comparison page compares from prose alone,
 * so each detail page emits a schema.org @graph describing the page itself, the
 * ordered list of compared test panels, and the biomarkers each panel covers.
 */

const SITE_URL = "https://myhealthcheckup.co.uk";

export interface ComparedTest {
  readonly name: string;
  readonly why: string;
  readonly keyBiomarkers: readonly string[];
  readonly searchQuery: string;
}

interface CompareDetailInput {
  /** Page kind, drives the breadcrumb trail and item URLs. */
  readonly kind: "goal" | "symptom";
  readonly slug: string;
  /** Display name, e.g. "Longevity" or "Fatigue". */
  readonly name: string;
  /** Long-form editorial explanation used as the page description. */
  readonly explanation: string;
  readonly tests: readonly ComparedTest[];
}

const HUB = {
  goal: { path: "/compare/goals", label: "Compare by goal" },
  symptom: { path: "/compare/symptoms", label: "Compare by symptom" },
} as const;

/**
 * Builds the JSON-LD @graph for a compare detail page: MedicalWebPage,
 * BreadcrumbList and an ItemList of the compared MedicalTest panels.
 */
export const buildCompareDetailStructuredData = ({
  kind,
  slug,
  name,
  explanation,
  tests,
}: CompareDetailInput): Record<string, unknown> => {
  const hub = HUB[kind];
  const pageUrl = `${SITE_URL}${hub.path}/${slug}`;

  const itemListElement = tests.map((test, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "MedicalTest",
      name: test.name,
      description: test.why,
      url: `${SITE_URL}/compare?search=${test.searchQuery}`,
      usedToDiagnose:
        kind === "symptom" ? { "@type": "MedicalSignOrSymptom", name } : undefined,
      additionalProperty: test.keyBiomarkers.map((biomarker) => ({
        "@type": "PropertyValue",
        name: "Biomarker",
        value: biomarker,
      })),
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${pageUrl}#page`,
        name: `Blood tests for ${name}`,
        description: explanation,
        url: pageUrl,
        inLanguage: "en-GB",
        isPartOf: { "@type": "WebSite", name: "myhealth checkup", url: SITE_URL },
        about:
          kind === "symptom"
            ? { "@type": "MedicalSignOrSymptom", name }
            : { "@type": "MedicalCondition", name },
        mainEntity: { "@id": `${pageUrl}#tests` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
          { "@type": "ListItem", position: 3, name: hub.label, item: `${SITE_URL}${hub.path}` },
          { "@type": "ListItem", position: 4, name, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#tests`,
        name: `Test panels compared for ${name}`,
        description: `Private blood test panels commonly used for ${name.toLowerCase()}, with the key biomarkers each panel covers.`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: tests.length,
        itemListElement,
      },
    ],
  };
};
