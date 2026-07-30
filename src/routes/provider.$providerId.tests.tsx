import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/provider/$providerId/tests")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: params.providerId },
      search: true,
      replace: true,
    });
  },
});
