import {
  buildProviderSchema,
  buildTestSchema,
  type JsonLdNode,
} from "@/lib/seo/structured-data";

const SITE_URL = "https://myhealthcheckup.co.uk";

interface RouteHeadInput {
  /** Page title, under 60 characters including the brand suffix. */
  readonly title: string;
  /** Meta description, under 160 characters. */
  readonly description: string;
  /** Absolute path beginning with a slash, e.g. "/thyroid". */
  readonly path: string;
  /** Open Graph type; defaults to "website". */
  readonly type?: "website" | "article";
}

/**
 * Normalises a route path so canonical and og:url always describe the same
 * page: leading slash enforced, query/hash and trailing slash removed.
 */
export const canonicalUrl = (path: string): string => {
  const withoutQuery = path.split(/[?#]/)[0] ?? "";
  const withSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : "/";
  return `${SITE_URL}${trimmed === "/" ? "" : trimmed}` || SITE_URL;
};

/**
 * Builds the per-route head metadata (title, description, Open Graph, Twitter
 * and canonical) so every public page ships unique, crawlable metadata during
 * server rendering rather than relying on the site-wide defaults.
 */
export const buildRouteHead = ({ title, description, path, type = "website" }: RouteHeadInput) => {
  const url = canonicalUrl(path);


  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

/**
 * Head metadata for private, non-indexable routes (auth, account dashboards).
 * These are intentionally excluded from sitemap.xml and blocked in robots.txt,
 * so they also carry an explicit noindex directive.
 */
export const buildPrivateRouteHead = (title: string) => ({
  meta: [
    { title },
    { name: "robots", content: "noindex, nofollow" },
    { name: "googlebot", content: "noindex, nofollow" },
  ],
});

interface ArticleHeadInput extends RouteHeadInput {
  /** ISO date (YYYY-MM-DD) the article was first published. */
  readonly datePublished: string;
  /** ISO date (YYYY-MM-DD) the article was last reviewed. */
  readonly dateModified?: string;
}

/**
 * Head metadata for editorial articles: adds server-rendered Article JSON-LD
 * on top of the standard per-route tags so rich snippets are crawlable.
 */
export const buildArticleHead = ({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleHeadInput) => {
  const base = buildRouteHead({ title, description, path, type: "article" });
  const url = canonicalUrl(path);

  return {
    ...base,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          url,
          mainEntityOfPage: url,
          inLanguage: "en-GB",
          datePublished,
          dateModified: dateModified ?? datePublished,
          isAccessibleForFree: true,
          author: { "@type": "Organization", name: "myhealth checkup" },
          publisher: { "@type": "Organization", name: "MYHEALTHCHECKUP LTD", url: SITE_URL },
        }),
      },
    ],
  };
};

/**
 * Head metadata for test category pages: adds CollectionPage JSON-LD so search
 * engines understand the page lists comparable diagnostic products.
 */
export const buildCollectionHead = ({ title, description, path }: RouteHeadInput) => {
  const base = buildRouteHead({ title, description, path });
  const url = canonicalUrl(path);

  return {
    ...base,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url,
          inLanguage: "en-GB",
          isPartOf: { "@type": "WebSite", name: "myhealth checkup", url: SITE_URL },
          about: { "@type": "MedicalTest", name: title },
          provider: { "@type": "Organization", name: "MYHEALTHCHECKUP LTD", url: SITE_URL },
        }),
      },
    ],
  };
};

interface ProviderHeadInput {
  readonly providerId: string;
  readonly providerName: string;
  readonly rating?: number | null;
  readonly reviewCount?: number | null;
}

/**
 * Head metadata for a provider profile route. The canonical, og:url and the
 * JSON-LD url are all derived from the same provider id, so a provider page
 * can never advertise another page's path.
 */
export const buildProviderHead = ({
  providerId,
  providerName,
  rating,
  reviewCount,
}: ProviderHeadInput) => {
  const path = `/provider/${providerId}`;
  const url = canonicalUrl(path);
  const title = `${providerName} Reviews & Tests | myhealth checkup`;
  const description = `${providerName} private health tests reviewed and compared. Browse the full test range, prices, accreditations and typical turnaround times.`;
  const base = buildRouteHead({ title, description, path });

  return {
    ...base,
    scripts: toJsonLdScripts(
      buildProviderSchema({ providerName, url, description, rating, reviewCount }),
    ),
  };
};

interface TestHeadInput {
  readonly providerId: string;
  readonly providerName: string;
  readonly testId: string;
  readonly testName: string;
  readonly priceGbp?: number | null;
  readonly biomarkerCount?: number | null;
}

/**
 * Head metadata for a provider test detail route, including MedicalTest and
 * BreadcrumbList structured data pinned to this exact test path.
 */
export const buildTestHead = ({
  providerId,
  providerName,
  testId,
  testName,
  priceGbp,
  biomarkerCount,
}: TestHeadInput) => {
  const path = `/provider/${providerId}/tests/${testId}`;
  const url = canonicalUrl(path);
  const title = `${testName} — ${providerName} | myhealth checkup`;
  const description = `Compare the ${testName} from ${providerName} against other accredited UK providers. Biomarkers, sample method, typical turnaround and pricing side-by-side.`;
  const base = buildRouteHead({ title, description, path });

  return {
    ...base,
    scripts: toJsonLdScripts(
      buildTestSchema({
        testName,
        providerName,
        providerId,
        url,
        description,
        priceGbp,
        biomarkerCount,
      }),
    ),
  };
};

const toJsonLdScripts = (graph: readonly JsonLdNode[]) =>
  graph.map((node) => ({
    type: "application/ld+json",
    children: JSON.stringify(node),
  }));
