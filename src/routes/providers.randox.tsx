import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/randox")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "randox" },
      replace: true,
    });
  },
});
