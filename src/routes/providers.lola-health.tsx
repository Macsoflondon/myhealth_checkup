import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/lola-health")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "lola-health" },
      replace: true,
    });
  },
});
