import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  MapPin,
  Search,
  Droplets,
  Clock,
  Home,
  Building2,
  CheckCircle2,
} from "lucide-react";

/**
 * TestHighlightsClinicFinder
 *
 * Layout inspiration: two coloured "test info" panels flanking a central white
 * panel that hosts the "Find a clinic near you" experience.
 *
 * Coloured panels surface the four data points the platform standard requires
 * for every test row: biomarker count, in-clinic price, home-kit price and
 * turnaround estimate (compliant phrasing — "estimated", not guaranteed).
 */

interface TestHighlight {
  name: string;
  category: string;
  biomarkers: number;
  homePrice: number;
  clinicPrice: number;
  turnaroundDays: string; // string so we can write "2–3"
  href: string;
  /** Tailwind classes for the panel surface */
  surface: string;
  /** Tailwind classes for the small accent chip (top corner) */
  accent: string;
}

const HIGHLIGHTS: TestHighlight[] = [
  {
    name: "Male Hormone Blood Test",
    category: "Hormones",
    biomarkers: 12,
    homePrice: 69,
    clinicPrice: 89,
    turnaroundDays: "2–3",
    href: "/male-hormone-test",
    surface: "bg-brand-pink text-white",
    accent: "bg-white/15 text-white",
  },
  {
    name: "General Health Profile",
    category: "General Health",
    biomarkers: 35,
    homePrice: 99,
    clinicPrice: 129,
    turnaroundDays: "3–4",
    href: "/general-health-test",
    surface: "bg-brand-turquoise text-white",
    accent: "bg-white/15 text-white",
  },
];

const TestInfoPanel = ({ test }: { test: TestHighlight }) => (
  <article
    className={`relative rounded-3xl p-6 sm:p-7 lg:p-8 shadow-lg overflow-hidden flex flex-col h-full ${test.surface}`}
  >
    {/* Decorative blob */}
    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />

    <span
      className={`inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium mb-4 ${test.accent}`}
    >
      {test.category}
    </span>

    <h3 className="font-heading font-bold text-xl sm:text-2xl leading-tight mb-5">
      {test.name}
    </h3>

    {/* Stats grid */}
    <ul className="grid grid-cols-2 gap-3 mb-6">
      <li className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 mb-1 text-white/80 text-xs font-medium">
          <Droplets className="w-3.5 h-3.5" />
          Biomarkers
        </div>
        <p className="font-heading font-bold text-2xl leading-none">
          {test.biomarkers}
        </p>
      </li>
      <li className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 mb-1 text-white/80 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          Turnaround
        </div>
        <p className="font-heading font-bold text-lg leading-none">
          {test.turnaroundDays}{" "}
          <span className="text-xs font-normal text-white/80">days est.</span>
        </p>
      </li>
      <li className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 mb-1 text-white/80 text-xs font-medium">
          <Home className="w-3.5 h-3.5" />
          Home kit
        </div>
        <p className="font-heading font-bold text-xl leading-none">
          £{test.homePrice}
        </p>
      </li>
      <li className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 mb-1 text-white/80 text-xs font-medium">
          <Building2 className="w-3.5 h-3.5" />
          In clinic
        </div>
        <p className="font-heading font-bold text-xl leading-none">
          £{test.clinicPrice}
        </p>
      </li>
    </ul>

    <div className="flex-1" />

    <Button
      asChild
      size="sm"
      className="bg-white text-brand-navy hover:bg-white/90 font-medium rounded-xl"
    >
      <Link to={test.href} aria-label={`View details for ${test.name}`}>
        View test details
      </Link>
    </Button>
  </article>
);

const TestHighlightsClinicFinder = () => {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = postcode.trim();
    if (trimmed.length === 0) {
      navigate("/find-clinic");
      return;
    }
    navigate(`/find-clinic?postcode=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[hsl(187,72%,97%)]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <SectionHeading
          title="Compare Tests &"
          gradientText="Find a Clinic Near You"
        />
        <p className="text-center text-gray-600 font-sans text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 sm:mb-14">
          See the headline data for popular tests at a glance — biomarkers, home
          and in-clinic pricing, and estimated turnaround — then find an
          accredited clinic near you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto items-stretch">
          {/* Left coloured info panel */}
          <TestInfoPanel test={HIGHLIGHTS[0]} />

          {/* Centre — Find a Clinic Near You */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-md flex flex-col">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-turquoise/10 mb-4 mx-auto">
              <MapPin className="w-6 h-6 text-brand-turquoise" />
            </div>

            <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-navy text-center mb-2">
              Find a Clinic Near You
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Over 377 partner clinic locations across the UK. Enter your
              postcode to see the closest options.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 mb-6"
              role="search"
              aria-label="Find a clinic by postcode"
            >
              <label htmlFor="clinic-postcode" className="sr-only">
                Postcode
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="clinic-postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Enter postcode (e.g. SW1A 1AA)"
                  className="pl-9 h-11 rounded-xl"
                  autoComplete="postal-code"
                />
              </div>
              <Button
                type="submit"
                className="bg-brand-turquoise hover:bg-brand-pink text-white h-11 rounded-xl transition-colors duration-300"
              >
                <Search className="w-4 h-4 mr-2" />
                Search clinics
              </Button>
            </form>

            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-turquoise mt-0.5 shrink-0" />
                <span>UKAS-accredited labs &amp; CQC-regulated clinics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-turquoise mt-0.5 shrink-0" />
                <span>Home-kit and in-clinic options compared side by side</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-turquoise mt-0.5 shrink-0" />
                <span>Independent — no pay-to-rank, no hidden fees</span>
              </li>
            </ul>

            <div className="mt-auto text-center">
              <Link
                to="/find-clinic"
                className="text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
              >
                Browse all 377+ clinics →
              </Link>
            </div>
          </div>

          {/* Right coloured info panel */}
          <TestInfoPanel test={HIGHLIGHTS[1]} />
        </div>
      </div>
    </section>
  );
};

export default TestHighlightsClinicFinder;
