import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy address kept for old inbound links: one permanent hop to the
// canonical provider profile.
export const Route = createFileRoute("/providers/london-medical-laboratory")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "london-medical-laboratory" },
      statusCode: 301,
      replace: true,
    });
  },
});
