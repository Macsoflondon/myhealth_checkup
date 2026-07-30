import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/randox-health/$testId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/randox/$testId",
      params: { testId: params.testId },
      search: true,
      replace: true,
    });
  },
});
