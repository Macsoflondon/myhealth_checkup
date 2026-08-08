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
