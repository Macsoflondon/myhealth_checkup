import { createFileRoute, Outlet } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/compare")({
  head: () =>
    buildRouteHead({
      title: "Compare UK blood tests | myhealth checkup",
      description:
        "Compare private blood tests across UK providers: price in GBP, biomarkers included, sample method and typical turnaround from UKAS-accredited labs.",
      path: "/compare",
    }),
  component: () => <Outlet />,
});
