import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/goodbody-clinic")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "goodbody-clinic" },
      replace: true,
    });
  },
});
