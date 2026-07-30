import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/most-popular-tests")({
  beforeLoad: () => {
    throw redirect({ to: "/popular-tests", replace: true });
  },
});
