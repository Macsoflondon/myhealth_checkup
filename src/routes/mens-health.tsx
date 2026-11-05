import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mens-health")({
  // Keep ?subcategory= (and any other query) so menu links such as
  // "Menopause tests" land on the filtered page, not the unfiltered one.
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/tests/mens-health${location.searchStr}`, replace: true });
  },
});
