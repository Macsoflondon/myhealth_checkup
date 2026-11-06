import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import {
  libraryEntryQuery,
  libraryIndexQuery,
  libraryPagesQuery,
} from "@/services/BiomarkerLibraryService";
import { resolveConsumerCategory } from "@/components/biomarker-library/biomarker-categories";

const BiomarkerDatabasePage = lazy(
  () => import("@/pages/BiomarkerDatabasePage"),
);

const optionalString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : undefined;

export const Route = createFileRoute("/biomarker-database")({
  validateSearch: (
    raw: Record<string, unknown>,
  ): { search?: string; category?: string; biomarker?: string } => ({
    search: optionalString(raw.search),
    category: optionalString(raw.category),
    biomarker: optionalString(raw.biomarker),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const { queryClient } = context;
    const category = resolveConsumerCategory(deps.category) ?? "";
    // Server-rendered first page keeps the library crawlable; failures fall
    // back to client fetching rather than breaking the page. The unfiltered
    // index feeds the header counts and the category list.
    await Promise.allSettled([
      queryClient.ensureInfiniteQueryData(
        libraryPagesQuery(deps.search ?? "", category),
      ),
      queryClient.ensureQueryData(libraryIndexQuery("", "")),
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
