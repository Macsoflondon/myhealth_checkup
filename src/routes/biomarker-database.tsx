import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import {
  libraryCategoriesQuery,
  libraryEntryQuery,
  libraryPagesQuery,
} from "@/services/BiomarkerLibraryService";

const BiomarkerDatabasePage = lazy(
  () => import("@/pages/BiomarkerDatabasePage"),
);

const optionalString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : undefined;

export const Route = createFileRoute("/biomarker-database")({
  validateSearch: (raw: Record<string, unknown>) => ({
    search: optionalString(raw.search),
    category: optionalString(raw.category),
    biomarker: optionalString(raw.biomarker),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const { queryClient } = context;
    // Server-rendered first page keeps the library crawlable; failures fall
    // back to client fetching rather than breaking the page.
    await Promise.allSettled([
      queryClient.ensureInfiniteQueryData(
        libraryPagesQuery(deps.search ?? "", deps.category ?? ""),
      ),
      queryClient.ensureQueryData(libraryCategoriesQuery()),
      deps.biomarker
        ? queryClient.ensureQueryData(libraryEntryQuery(deps.biomarker))
        : Promise.resolve(null),
    ]);
  },
  head: () =>
    buildRouteHead({
      title: "Complete Biomarker Reference Library | myhealth checkup",
      description:
        "A reference library of the biomarkers measured by UK private blood tests, what each one indicates and which panels include it.",
      path: "/biomarker-database",
    }),
  component: BiomarkerDatabasePage,
});
