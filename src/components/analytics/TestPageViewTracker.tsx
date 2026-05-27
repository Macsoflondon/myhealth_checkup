import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "@/lib/analytics";

/**
 * Fires `test_page_view` whenever the route changes to a test page.
 * Matches `/test/:slug` (single-test pages) and `/tests/:category`
 * (category landing pages). Rendered once at the router level.
 */
const TestPageViewTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const single = pathname.match(/^\/test\/([^/?#]+)/);
    const category = pathname.match(/^\/tests\/([^/?#]+)/);

    if (single) {
      analytics.testPageView({ path: pathname, test_slug: single[1] });
    } else if (category) {
      analytics.testPageView({ path: pathname, category: category[1] });
    }
  }, [pathname]);

  return null;
};

export default TestPageViewTracker;
