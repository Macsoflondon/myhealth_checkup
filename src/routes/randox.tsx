import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/randox")({
  beforeLoad: () => {
    throw redirect({ to: "/providers/randox" });
  },
});
