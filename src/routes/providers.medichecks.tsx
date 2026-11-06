import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy address kept for old inbound links: one permanent hop to the
// canonical provider profile.
export const Route = createFileRoute("/providers/medichecks")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "medichecks" },
      statusCode: 301,
      replace: true,
    });
  },
});
