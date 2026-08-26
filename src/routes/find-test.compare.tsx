import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy quiz-comparison surface. Comparison now lives at /compare, so send
 * visitors there instead of an empty page.
 */
export const Route = createFileRoute("/find-test/compare")({
  beforeLoad: () => {
    throw redirect({ to: "/compare", replace: true });
  },
});
