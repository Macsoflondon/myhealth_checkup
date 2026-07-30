import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/providers/london-medical-laboratory")({
  beforeLoad: () => {
    throw redirect({
      to: "/provider/$providerId",
      params: { providerId: "london-medical-laboratory" },
      replace: true,
    });
  },
});
