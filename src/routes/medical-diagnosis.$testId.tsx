import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/medical-diagnosis/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "medical-diagnosis", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
