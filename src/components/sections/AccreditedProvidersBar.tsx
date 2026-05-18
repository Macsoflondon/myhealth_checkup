import { Link } from "react-router-dom";
import { PROVIDER_DETAILS } from "@/constants/providers";
import { SectionHeading } from "@/components/ui/section-heading";
import { analytics } from "@/lib/analytics";

const FEATURED_PROVIDERS = [
  'medichecks',
  'goodbody-clinic',
  'thriva',
  'randox',
  'london-medical-laboratory',
  'lola-health',
];

const getProviderRoute = (id: string) => {
  if (id === 'goodbody-clinic') return '/provider/goodbody';
  return `/provider/${id}`;
};

const ACCREDITORS = [
  { name: "UKAS", desc: "Laboratory accreditation" },
  { name: "CQC", desc: "Care Quality Commission" },
  { name: "ISO 15189", desc: "Medical laboratory standard" },
];

const AccreditedProvidersBar = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-tertiary" aria-label="Accreditation and partners">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="bg-white rounded-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 md:py-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-6 bg-brand-turquoise" />
          <span className="text-brand-turquoise text-[10px] font-semibold uppercase tracking-[0.25em]">
            Accredited & Verified
          </span>
          <div className="h-px w-6 bg-brand-turquoise" />
        </div>

        <SectionHeading
          title="Accredited Providers"
          gradientText="We Compare"
          className="mb-5 md:mb-6"
          titleClassName="text-brand-turquoise"
        />

        {/* Specific accreditor names — UKAS / CQC / ISO 15189 (audit 1.8) */}
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-center gap-x-3 sm:gap-x-8 md:gap-x-10 gap-y-2 mb-6 md:mb-8">
          {ACCREDITORS.map((a, i) => (
            <div key={a.name} className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="text-center px-0.5 sm:px-0">
                <div className="text-[13px] sm:text-sm md:text-base lg:text-lg font-bold text-brand-turquoise leading-tight whitespace-nowrap">{a.name}</div>
                <div className="hidden sm:block text-[10px] md:text-xs text-brand-turquoise/70 leading-tight">{a.desc}</div>
              </div>
              {i < ACCREDITORS.length - 1 && (
                <div className="hidden sm:block w-px h-7 md:h-9 lg:h-10 bg-brand-turquoise/30" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto">
          {FEATURED_PROVIDERS.map((id) => {
            const provider = PROVIDER_DETAILS[id];
            if (!provider) return null;

            return (
              <Link
                key={id}
                to={getProviderRoute(id)}
                onClick={() =>
                  analytics.kitTileClick({
                    tile_id: id,
                    tile_label: provider.name,
                    destination: getProviderRoute(id),
                    surface: "accredited_providers_bar",
                  })
                }
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 p-2.5 md:p-3 lg:p-4 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-center h-[56px] sm:h-[68px] md:h-[80px] lg:h-[88px] w-full">
                  <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-brand-turquoise text-[11px] sm:text-xs md:text-sm font-medium text-center leading-tight">
                  {provider.name}
                </span>
              </Link>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
