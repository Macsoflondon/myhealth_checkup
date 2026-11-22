import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CatalogueRouteError() {
  const router = useRouter();
  return (
    <main className="container mx-auto min-h-96 px-4 py-12 text-brand-navy">
      <h1 className="type-page-title">Catalogue temporarily unavailable</h1>
      <Button className="mt-6" onClick={() => void router.invalidate()}>
        Try again
      </Button>
    </main>
  );
}
export function CatalogueRouteNotFound() {
  return (
    <main className="container mx-auto min-h-96 px-4 py-12 text-brand-navy">
      <h1 className="type-page-title">Page not found</h1>
      <Button asChild className="mt-6">
        <Link to="/compare">Browse tests</Link>
      </Button>
    </main>
  );
}
