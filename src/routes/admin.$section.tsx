import { createFileRoute, redirect } from "@tanstack/react-router";

// The admin pages now live in Crux Control under the same slug. Old links and
// bookmarks to /admin/<page> land on /control/<page>. /admin/login and
// /admin/recovery are static routes, so they still match before this one.
export const Route = createFileRoute("/admin/$section")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/control/$section",
      params: { section: params.section },
      search: true,
      replace: true,
    });
  },
});
