import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/london-health-company")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "london-health-company" },
      replace: true,
    });
  },
});
