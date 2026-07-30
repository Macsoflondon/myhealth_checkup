import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/thriva")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "thriva" },
      replace: true,
    });
  },
});
