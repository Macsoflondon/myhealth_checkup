/**
 * Schema.org JSON-LD builders and validation.
 *
 * Every provider and test detail page ships structured data. These helpers
 * guarantee the emitted graph is well formed (no missing @context/@type, no
 * duplicate or empty fields, absolute self-referencing URLs) so a broken
 * node is caught by tests before it reaches production.
 */

export const SITE_URL = "https://myhealthcheckup.co.uk";
export const ORGANISATION = {
  "@type": "Organization",
  name: "MYHEALTHCHECKUP LTD",
  url: SITE_URL,
} as const;

export type JsonLdNode = Record<string, unknown>;

export interface JsonLdIssue {
  readonly node: string;
  readonly message: string;
}

const isPlainObject = (value: unknown): value is JsonLdNode =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Recursively collects nested objects carrying an @type. */
const collectTypedNodes = (value: unknown, out: JsonLdNode[] = []): JsonLdNode[] => {
  if (Array.isArray(value)) {
    value.forEach((v) => collectTypedNodes(v, out));
    return out;
  }
  if (!isPlainObject(value)) return out;
  if ("@type" in value) out.push(value);
  Object.values(value).forEach((v) => collectTypedNodes(v, out));
  return out;
};

interface ValidateOptions {
  /** Absolute URL of the page the graph describes. */
  readonly expectedUrl?: string;
}

/**
 * Validates a JSON-LD graph (a single node, or an array of root nodes).
 * Returns an empty array when the graph is publishable.
 */
export const validateJsonLd = (
  graph: unknown,
  options: ValidateOptions = {},
): readonly JsonLdIssue[] => {
  const issues: JsonLdIssue[] = [];
  const roots = Array.isArray(graph) ? graph : [graph];

  if (roots.length === 0) {
    issues.push({ node: "graph", message: "graph is empty" });
  }

  const seenRootTypes = new Set<string>();

  roots.forEach((root, index) => {
    const label = `root[${index}]`;
    if (!isPlainObject(root)) {
      issues.push({ node: label, message: "root node is not an object" });
      return;
    }
    if (root["@context"] !== "https://schema.org") {
      issues.push({ node: label, message: 'missing or invalid "@context"' });
    }
    const rootType = root["@type"];
    if (typeof rootType !== "string" || rootType.length === 0) {
      issues.push({ node: label, message: 'missing "@type"' });
    } else {
      if (seenRootTypes.has(rootType)) {
        issues.push({ node: label, message: `duplicate root @type "${rootType}"` });
      }
      seenRootTypes.add(rootType);
    }

    const url = root["url"];
    if (typeof url === "string") {
      if (!url.startsWith("https://")) {
        issues.push({ node: label, message: `url must be absolute, got "${url}"` });
      }
      if (url.includes("www.myhealthcheckup.co.uk")) {
        issues.push({ node: label, message: "url uses the www host instead of the apex domain" });
      }
      if (options.expectedUrl && url !== options.expectedUrl) {
        issues.push({
          node: label,
          message: `url "${url}" does not self-reference "${options.expectedUrl}"`,
        });
      }
    }

    collectTypedNodes(root).forEach((node) => {
      const type = typeof node["@type"] === "string" ? (node["@type"] as string) : "unknown";
      Object.entries(node).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          issues.push({ node: `${label}.${type}`, message: `field "${key}" is empty` });
        }
      });
    });
  });

  return issues;
};

/** Throws when the graph is invalid — used by build-time validation scripts. */
export const assertValidJsonLd = (graph: unknown, options: ValidateOptions = {}): void => {
  const issues = validateJsonLd(graph, options);
  if (issues.length > 0) {
    throw new Error(
      `Invalid JSON-LD:\n${issues.map((i) => `  - ${i.node}: ${i.message}`).join("\n")}`,
    );
  }
};

interface ProviderSchemaInput {
  readonly providerName: string;
  readonly url: string;
  readonly description: string;
  readonly rating?: number | null;
  readonly reviewCount?: number | null;
}

/** MedicalBusiness + BreadcrumbList graph for a provider profile page. */
export const buildProviderSchema = ({
  providerName,
  url,
  description,
  rating,
  reviewCount,
}: ProviderSchemaInput): readonly JsonLdNode[] => {
  const provider: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: providerName,
    description,
    url,
    areaServed: "GB",
    isPartOf: { "@type": "WebSite", name: "myhealth checkup", url: SITE_URL },
  };

  if (rating != null && reviewCount != null && reviewCount > 0) {
    provider.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return [provider, buildBreadcrumbSchema([
    { name: "Providers", url: `${SITE_URL}/providers` },
    { name: providerName, url },
  ])];
};

interface TestSchemaInput {
  readonly testName: string;
  readonly providerName: string;
  readonly providerId: string;
  readonly url: string;
  readonly description: string;
  readonly priceGbp?: number | null;
  readonly biomarkerCount?: number | null;
}

/** MedicalTest (+ Offer) and BreadcrumbList graph for a test detail page. */
export const buildTestSchema = ({
  testName,
  providerName,
  providerId,
  url,
  description,
  priceGbp,
  biomarkerCount,
}: TestSchemaInput): readonly JsonLdNode[] => {
  const test: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name: testName,
    description,
    url,
    inLanguage: "en-GB",
    usedToDiagnose: undefined,
    provider: { "@type": "Organization", name: providerName },
  };
  // Never ship undefined placeholders into the graph.
  delete test.usedToDiagnose;

  if (biomarkerCount != null && biomarkerCount > 0) {
    test.subjectOf = {
      "@type": "CreativeWork",
      name: `${biomarkerCount} biomarkers measured`,
    };
  }

  if (priceGbp != null && priceGbp > 0) {
    test.offers = {
      "@type": "Offer",
      price: priceGbp.toFixed(2),
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url,
      seller: { "@type": "Organization", name: providerName },
    };
  }

  return [
    test,
    buildBreadcrumbSchema([
      { name: "Providers", url: `${SITE_URL}/providers` },
      { name: providerName, url: `${SITE_URL}/provider/${providerId}` },
      { name: testName, url },
    ]),
  ];
};

export const buildBreadcrumbSchema = (
  crumbs: readonly { name: string; url: string }[],
): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});
