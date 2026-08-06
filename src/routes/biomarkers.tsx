import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/biomarkers")({
  beforeLoad: () => {
    throw redirect({ to: "/biomarker-database", replace: true });
  },
});
