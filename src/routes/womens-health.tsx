import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/womens-health")({
  beforeLoad: () => {
    throw redirect({ to: "/tests/womens-health", replace: true });
  },
});
