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
 * Builds the per-route head metadata (title, description, Open Graph, Twitter
 * and canonical) so every public page ships unique, crawlable metadata during
 * server rendering rather than relying on the site-wide defaults.
 */
export const buildRouteHead = ({ title, description, path, type = "website" }: RouteHeadInput) => {
  const url = `${SITE_URL}${path}`;

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
  const url = `${SITE_URL}${path}`;

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
  const url = `${SITE_URL}${path}`;

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
