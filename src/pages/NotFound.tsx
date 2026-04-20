import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Home, Compass, MessageCircle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { logger } from "@/lib/logger";
import PageHeading from "@/components/ui/page-heading";

const POPULAR_DESTINATIONS = [
  { label: "Compare blood tests", href: "/compare", icon: FlaskConical },
  { label: "Find a clinic", href: "/find-clinic", icon: Compass },
  { label: "Compare by symptom", href: "/compare/symptoms", icon: Search },
  { label: "Compare by goal", href: "/compare/goals", icon: Search },
  { label: "How it works", href: "/how-it-works", icon: Home },
  { label: "Contact us", href: "/contact", icon: MessageCircle },
];

const POPULAR_CATEGORIES = [
  { label: "General Health", href: "/category/general-health" },
  { label: "Heart Health", href: "/category/heart-health" },
  { label: "Hormones", href: "/category/hormones" },
  { label: "Thyroid", href: "/category/thyroid" },
  { label: "Diabetes", href: "/category/diabetes" },
  { label: "Vitamins", href: "/category/vitamins" },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/compare?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Page Not Found (404) | myhealth checkup</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="The page you were looking for could not be found. Search our health test catalogue or browse popular categories."
        />
      </Helmet>
      <Header />
      <main className="bg-background">
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              Error 404
            </p>
            <PageHeading title="We can't find" accent="that page" />
            <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
              The link may be broken, the page may have moved, or the URL might be mistyped.
              Use the search below or pick a popular destination to keep exploring.
            </p>

            <form
              onSubmit={handleSearch}
              role="search"
              aria-label="Search health tests"
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
            >
              <Input
                type="search"
                inputMode="search"
                placeholder="Search 200+ tests (e.g. thyroid, vitamin D)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search health tests"
                className="h-12"
              />
              <Button type="submit" size="lg" className="h-12">
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </form>
          </div>

          <div className="mt-14 max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground text-center mb-5">
              Popular destinations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {POPULAR_DESTINATIONS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground text-center mb-5">
              Browse by category
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_CATEGORIES.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" /> Return home
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
