import { createFileRoute, redirect } from "@tanstack/react-router";

// Short address for EDGE: one permanent hop to the canonical provider profile.
export const Route = createFileRoute("/providers/edge")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "sports-blood-tests" },
      statusCode: 301,
      replace: true,
    });
  },
});
