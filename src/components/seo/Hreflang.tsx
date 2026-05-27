/**
 * <Hreflang /> — emits per-route hreflang + canonical alternates.
 *
 * Why: The site targets en-GB only. Google needs an explicit `hreflang="en-gb"`
 * on every URL so it does not surface en-US or en-AU duplicates of our pages.
 * `x-default` pins the fallback to the same URL (we don't serve other locales).
 *
 * Use this on every page-level component that already uses <Helmet>. Pair it
 * with the existing canonical <link> from src/lib/seo.ts.
 *
 *   <Hreflang path="/trusted-providers" />
 *
 * If `path` is omitted we fall back to window.location.pathname (safe at
 * runtime; on prerender the snapshot will capture whatever path Playwright
 * navigated to).
 */
import { Helmet } from "react-helmet-async";

const BASE = "https://www.myhealthcheckup.co.uk";

interface HreflangProps {
  /** Path including leading slash. Defaults to current location. */
  path?: string;
}

export const Hreflang = ({ path }: HreflangProps) => {
  const resolved =
    path ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = `${BASE}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;

  return (
    <Helmet>
      <link rel="alternate" hrefLang="en-gb" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default Hreflang;
