import { Reveal } from "@/components/primitives/Reveal";
import { HERO_CAPTION } from "@/components/sections/hero-slides";

interface TrustItem {
  label: string;
  markerClassName: string;
}

const trustItems: TrustItem[] = [
  { label: "UKAS-Accredited Labs", markerClassName: "bg-brand-turquoise" },
  { label: "CQC-Regulated Clinics", markerClassName: "bg-brand-pink" },
  { label: "ISO 15189 Certification", markerClassName: "bg-brand-navy" },
  { label: "GDPR Compliant", markerClassName: "bg-brand-turquoise" },
  { label: "Transparent Pricing", markerClassName: "bg-brand-pink" },
  { label: "No GP Referral Needed", markerClassName: "bg-brand-navy" },
];

/**
 * Trust signals bar — static standards row.
 */
const AccreditedProvidersBar = () => {
  return (
    <section aria-label="Accredited provider standards" className="bg-white">
      <div
        aria-hidden="true"
        className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise"
      />
      <div className="homepage-section-inner py-6 sm:py-8">
        <Reveal variant="fade">
          <p className="hidden md:block text-center font-heading font-semibold text-brand-navy text-xl lg:text-2xl leading-relaxed mb-8">
            {HERO_CAPTION}
          </p>
        </Reveal>

        {/* Editorial standards header — shared eyebrow pattern */}
        <div className="mt-0 mb-6 sm:mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-6 sm:w-12 bg-brand-pink" aria-hidden="true" />
          {/* h2 so the six standards below (h3) sit under a section heading. */}
          <h2 className="min-w-0 text-center font-heading text-sm font-bold uppercase text-brand-turquoise">
            Our clinical standards
          </h2>
          <span className="h-px w-6 sm:w-12 bg-brand-pink" aria-hidden="true" />
        </div>

        {/* Equal-width points with markers aligned beside the labels. */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 items-center gap-x-4 gap-y-5"
          data-testid="accreditors-mobile-grid"
        >
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2"
            >
              <div
                aria-hidden="true"
                className={`w-4 h-1 rounded-full shrink-0 ${item.markerClassName}`}
              />
              <h3 className="min-w-0 text-xs font-bold text-brand-navy leading-relaxed">
                {item.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
