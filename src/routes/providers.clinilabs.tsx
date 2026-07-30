import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/clinilabs")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "clinilabs" },
      replace: true,
    });
  },
});
