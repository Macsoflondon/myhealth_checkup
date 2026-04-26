/**
 * <GlobalHreflang /> — emits hreflang en-gb + x-default for the current route.
 *
 * Mounted once inside <BrowserRouter> so every route automatically gets the
 * UK targeting signal without per-page boilerplate. Uses useLocation so it
 * reacts to client-side navigation and so prerender snapshots capture the
 * right URL per route.
 */
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://www.myhealthcheckup.co.uk";

export const GlobalHreflang = () => {
  const { pathname } = useLocation();
  const url = `${BASE}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;

  return (
    <Helmet>
      <link rel="alternate" hrefLang="en-gb" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default GlobalHreflang;
