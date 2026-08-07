import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lola-health/")({
  beforeLoad: () => {
    throw redirect({ to: "/providers/lola-health" });
  },
});
