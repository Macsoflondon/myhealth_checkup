import React from "react";
import { Link } from "@/lib/router-compat";
import SponsoredBadge from "@/components/compliance/SponsoredBadge";
import {
  TrendingUp,
  MapPin,
  Clock,
  Beaker,
  Award,
  RefreshCw,
  ShieldCheck,
  Scale,
  AlertTriangle,
  FileSearch,
  Stethoscope,
} from "lucide-react";

/**
 * /how-we-rank
 *
 * YMYL requirement: ranking criteria, inclusion criteria, update cadence,
 * conflict-of-interest policy and limitations. Static content so it stays
 * fully crawlable in the SSR/prerender shell.
 */

type Item = {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly body: string;
};

const SORT_OPTIONS: readonly Item[] = [
  {
    icon: MapPin,
    title: "Nearest clinic",
    body: "Providers with collection options closest to your postcode.",
  },
  {
    icon: Clock,
    title: "Turnaround",
    body: "Typical days from sample receipt to result, as published by the provider.",
  },
  {
    icon: Beaker,
    title: "Most biomarkers",
    body: "Comprehensiveness of the test panel.",
  },
  {
    icon: Award,
    title: "Accreditation strength",
    body: "UKAS ISO 15189 laboratory accreditation and CQC clinic registration take precedence.",
  },
];

const INCLUSION: readonly string[] = [
  "Samples processed in a UKAS-accredited ISO 15189 laboratory, or for clinic-based services, a CQC-registered facility.",
  "Lawful UK operation, complying with UK GDPR, the Data Protection Act 2018 and applicable MHRA guidance.",
  "Transparent pricing, published sample-collection methods and a documented complaints and results-query process.",
  "A clinically interpretable result, such as a doctor-reviewed report, GP-friendly PDF or biomarker reference ranges.",
];

const CADENCE: readonly Item[] = [
  {
    icon: RefreshCw,
    title: "Prices and availability",
    body: "Refreshed automatically from provider websites about every 6 hours.",
  },
  {
    icon: FileSearch,
    title: "Provider profiles",
    body: "Accreditation, contact details and services re-checked at least quarterly, and on any detected change.",
  },
  {
    icon: Stethoscope,
    title: "Clinical explainers",
    body: "Biomarker library reviewed annually by our clinical reviewer, or sooner when UK guidance changes.",
  },
  {
    icon: Scale,
    title: "Regulatory pages",
    body: "This page, privacy and terms reviewed at least annually and version-controlled in our codebase.",
  },
];

const INDEPENDENCE: readonly Item[] = [
  {
    icon: Scale,
    title: "No pay-to-rank",
    body: "Affiliate status never changes a provider’s position in the default total price sort.",
  },
  {
    icon: ShieldCheck,
    title: "No editorial gifts",
    body: "Our clinical reviewer receives no payment, equity, free testing or in-kind benefit from any listed provider.",
  },
  {
    icon: TrendingUp,
    title: "No exclusivity",
    body: "Non-affiliate providers appear above affiliate providers whenever their total price is lower.",
  },
  {
    icon: FileSearch,
    title: "Full disclosure",
    body: "Sponsored placements are labelled, visually separated and excluded from the organic comparison.",
  },
];

const SectionHeading = ({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) => (
  <header className="mb-8 max-w-2xl">
    <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#22c0d4]">
      {eyebrow}
    </p>
    <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#081129]">
      {title}
    </h2>
    {intro ? (
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
        {intro}
      </p>
    ) : null}
  </header>
);

const TileGrid = ({ items }: { items: readonly Item[] }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {items.map(({ icon: Icon, title, body }) => (
      <div
        key={title}
        className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#22c0d4]/60"
      >
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c0d4]/10">
          <Icon className="h-4 w-4 text-[#0e7490]" />
        </span>
        <h3 className="font-heading text-base font-bold text-[#081129]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    ))}
  </div>
);

/** Date of the last clinical review of this page. Update when re-reviewed. */
const LAST_REVIEWED = "October 2026";

const HowWeRank = () => {
  return (
    <article className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Intro */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
          myhealth checkup is an independent UK comparison platform for private
          diagnostic tests. This page explains how we choose providers, how we
          order results, and how our commercial relationships are kept separate
          from editorial decisions.
        </p>
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-muted-foreground">
          <ShieldCheck
            className="h-3.5 w-3.5 text-[#0e7490]"
            aria-hidden="true"
          />
          <span>Last reviewed {LAST_REVIEWED}</span>
          <span aria-hidden="true">·</span>
          <Link
            to="/about/medical-review"
            className="font-semibold text-[#0e7490] underline underline-offset-2"
          >
            Reviewed by Nathanial Smith, Registered Healthcare Professional
            (HCPC reg. PA43353)
          </Link>
        </div>
      </div>

      <div className="mt-14 space-y-16">
        {/* Ranking */}
        <section>
          <SectionHeading
            eyebrow="Ranking"
            title="How results are ordered"
            intro="By default, comparison results are ordered by total price: the advertised test price plus any mandatory fees we are aware of, such as required phlebotomy or GP consultation costs. Optional fees are excluded from the default sort and shown on the test card instead."
          />
          <p className="mb-4 text-sm font-semibold text-[#081129]">
            You can re-sort any comparison by:
          </p>
          <TileGrid items={SORT_OPTIONS} />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            The default sort is price-led because price is the most consistently
            verifiable comparison axis. It is not a recommendation, and the
            cheapest test for a panel is not necessarily the most appropriate
            test for you.
          </p>
        </section>

        {/* Inclusion */}
        <section>
          <SectionHeading
            eyebrow="Standards"
            title="Which providers we list"
            intro="We prioritise depth of vetting over breadth of listings. To appear on myhealth checkup, a provider must meet all four criteria below."
          />
          <ol className="space-y-3">
            {INCLUSION.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#081129] font-heading text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Providers that fail an accreditation check, that we cannot reach for
            verification, or that we observe making unsupported clinical claims
            are removed from comparison until the issue is resolved.
          </p>
        </section>

        {/* Independence */}
        <section className="rounded-3xl bg-[#081129] px-6 py-10 sm:px-10 sm:py-12">
          <header className="mb-8 max-w-2xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#22c0d4]">
              Independence
            </p>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Commercial relationships, kept separate
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/75">
              We operate affiliate and referral relationships with some listed
              providers. That is how a free comparison service is funded. It
              never influences where a provider appears.
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            {INDEPENDENCE.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c0d4]/15">
                  <Icon className="h-4 w-4 text-[#22c0d4]" />
                </span>
                <h3 className="font-heading text-base font-bold text-white">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm leading-relaxed text-white/75">
              Where a placement involves a commercial arrangement, we label it
              visibly:
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SponsoredBadge variant="sponsored" />
              <SponsoredBadge variant="promoted" />
              <SponsoredBadge variant="affiliate" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">
              We comply in full with the Competition and Markets Authority and
              the Digital Markets, Competition and Consumers Act 2024. Our
              relationships are documented in our{" "}
              <Link
                to="/affiliate-disclosure"
                className="font-semibold text-[#22c0d4] underline underline-offset-2"
              >
                affiliate disclosure
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Cadence */}
        <section>
          <SectionHeading
            eyebrow="Accuracy"
            title="How often the data is refreshed"
            intro="Different content types are checked on different schedules. Where a provider's website changes after our refresh, the provider's own site is the authoritative source."
          />
          <TileGrid items={CADENCE} />
        </section>

        {/* Limitations */}
        <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-heading text-xl font-bold text-[#081129]">
                What we are not
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  This site provides comparison information only. It is not a
                  clinical service and does not constitute medical advice,
                  diagnosis or prescription. We do not own a laboratory, employ
                  phlebotomists or process diagnostic samples. Abnormal results
                  from any private test should be reviewed by a suitably
                  qualified clinician.
                </p>
                <p>
                  We do not cover every UK provider, and absence from our
                  comparison is not a comment on the safety or quality of any
                  provider we do not list.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-[#081129]">
            Think a listing is wrong?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Email{" "}
            <a
              href="mailto:support@myhealthcheckup.co.uk"
              className="font-semibold text-[#0e7490] underline underline-offset-2"
            >
              support@myhealthcheckup.co.uk
            </a>{" "}
            and we will investigate within five working days, or raise it
            through our{" "}
            <Link
              to="/complaints"
              className="font-semibold text-[#0e7490] underline underline-offset-2"
            >
              feedback and complaints process
            </Link>
            . We acknowledge within two business days and respond fully within
            ten.
          </p>
        </section>
      </div>
    </article>
  );
};

export default HowWeRank;
