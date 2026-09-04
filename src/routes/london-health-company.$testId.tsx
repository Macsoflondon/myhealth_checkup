import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/london-health-company/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "london-health-company", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
