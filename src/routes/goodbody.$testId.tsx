import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/goodbody/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/goodbody-clinic/$testId",
      params: { testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
