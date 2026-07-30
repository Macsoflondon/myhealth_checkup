import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tests/fertility")({
  beforeLoad: () => {
    throw redirect({ to: "/fertility-tests", replace: true });
  },
});
