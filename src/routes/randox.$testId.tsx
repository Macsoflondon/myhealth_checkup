import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/randox/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "randox", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
