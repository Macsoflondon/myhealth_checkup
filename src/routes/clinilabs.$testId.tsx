import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/clinilabs/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "clinilabs", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
