import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/find-clinic")({
  beforeLoad: () => {
    throw redirect({ to: "/trusted-providers", replace: true });
  },
});
