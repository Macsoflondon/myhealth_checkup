import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/health-blog")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", replace: true });
  },
});
