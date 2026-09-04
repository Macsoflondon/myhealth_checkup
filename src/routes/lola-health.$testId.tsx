import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lola-health/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "lola-health", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
