import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/medical-diagnosis")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "medical-diagnosis" },
      replace: true,
    });
  },
});
