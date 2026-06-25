import { Helmet } from "react-helmet-async";
import { BASE_URL } from "@/lib/seo";

interface HreflangProps {
  /** Path including leading slash. Defaults to current location. */
  path?: string;
}

export const Hreflang = ({ path }: HreflangProps) => {
  const resolved =
    path ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = `${BASE_URL}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;

  return (
    <Helmet>
      <link rel="alternate" hrefLang="en-gb" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default Hreflang;
