import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/goodbody-clinic/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/provider/$providerId/tests/$testId",
      params: { providerId: "goodbody-clinic", testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
