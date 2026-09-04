import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/medichecks/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "medichecks", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
