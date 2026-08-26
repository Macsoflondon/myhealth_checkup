import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The quiz renders its recommendations inline, so this legacy standalone page
 * has no way to be populated. Redirect rather than strand visitors.
 */
export const Route = createFileRoute("/find-test/recommendations")({
  beforeLoad: () => {
    throw redirect({ to: "/find-test", replace: true });
  },
});
