import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy address kept for old inbound links: one permanent hop to the
// canonical provider profile.
export const Route = createFileRoute("/providers/clinilabs")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "clinilabs" },
      statusCode: 301,
      replace: true,
    });
  },
});
