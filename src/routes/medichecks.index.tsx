import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/medichecks/")({
  beforeLoad: () => {
    throw redirect({ to: "/provider/$providerId", params: { providerId: "medichecks" }, statusCode: 301 });
  },
});
