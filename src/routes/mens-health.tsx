import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mens-health")({
  beforeLoad: () => {
    throw redirect({ to: "/tests/mens-health", replace: true });
  },
});
