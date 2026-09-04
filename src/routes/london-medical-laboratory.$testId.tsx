import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/london-medical-laboratory/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "london-medical-laboratory", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
