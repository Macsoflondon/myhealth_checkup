import { Check } from "lucide-react";
import { Link } from "@/lib/router-compat";
import clinicBloodDraw from "@/assets/clinic-blood-draw.jpg.asset.json";

const POINTS: readonly string[] = [
  "No pay-to-rank. Providers cannot buy prominence.",
  "Every affiliate relationship is disclosed.",
  "We only list providers that meet our full compliance criteria.",
  "Prices come from provider websites and are checked about every 6 hours.",
  "UK GDPR compliant. We collect only what we need.",
];

export const DecisionInfrastructureSection = () => (
  <section className="bg-brand-navy">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Photograph */}
      <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[520px] overflow-hidden">
        <img
          src={clinicBloodDraw.url}
          alt="A nurse taking a blood sample from a patient's arm"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[45%_30%]"
        />
        {/* Soft navy wash into the lower-right corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_100%_100%,rgba(8,17,41,0.85)_0%,rgba(8,17,41,0.45)_28%,rgba(8,17,41,0)_58%)]"
        />
      </div>

      {/* Copy */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 sm:w-12 bg-brand-pink" aria-hidden="true" />
          <span className="font-heading text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-turquoise">
            Why myhealth checkup
          </span>
          <span className="h-px w-8 sm:w-12 bg-brand-pink" aria-hidden="true" />
        </div>

        <h2 className="font-heading text-[clamp(1.6rem,2.9vw,2.5rem)] font-extrabold leading-[1.12] tracking-tight text-white">
          Decision infrastructure.
          <br />
          Not a marketplace.
        </h2>

        <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
          Some providers pay us a commission when you book through our links.
          It never changes the price you pay or the order of results. You get
          the full picture before you spend a pound on your health.
        </p>

        <ul className="mt-7 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-turquoise">
                <Check className="h-3 w-3 text-brand-turquoise" />
              </span>
              <span className="text-sm sm:text-base leading-snug text-white/90">
                {point}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            to="/how-we-rank"
            className="inline-flex items-center gap-2 rounded-md bg-brand-turquoise px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand-navy transition-colors hover:bg-[#1aa8bb]"
          >
            Our standards <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default DecisionInfrastructureSection;
