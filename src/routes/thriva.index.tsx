import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/thriva/")({
  beforeLoad: () => {
    throw redirect({ to: "/providers/thriva" });
  },
});
