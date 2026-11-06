import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/womens-health")({
  // Keep ?subcategory= (and any other query) so menu links such as
  // "Menopause tests" land on the filtered page, not the unfiltered one.
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/tests/womens-health${location.searchStr}`, replace: true, statusCode: 301 });
  },
});
