import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/randox/")({
  beforeLoad: () => {
    throw redirect({ to: "/provider/$providerId", params: { providerId: "randox" }, statusCode: 301 });
  },
});
