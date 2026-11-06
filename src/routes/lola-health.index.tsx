import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lola-health/")({
  beforeLoad: () => {
    throw redirect({ to: "/provider/$providerId", params: { providerId: "lola-health" }, statusCode: 301 });
  },
});
