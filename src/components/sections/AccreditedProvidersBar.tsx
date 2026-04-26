import { Link } from "react-router-dom";
import { PROVIDER_DETAILS } from "@/constants/providers";
import { SectionHeading } from "@/components/ui/section-heading";

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
    <section className="py-4 md:py-6 bg-tertiary" aria-label="Accreditation and partners">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-6 bg-brand-turquoise" />
          <span className="text-brand-turquoise text-[10px] font-semibold uppercase tracking-[0.25em]">
            Accredited & Verified
          </span>
          <div className="h-px w-6 bg-brand-turquoise" />
        </div>

        <SectionHeading
          title="Accredited Providers"
          gradientText="We Compare"
          className="mb-4 md:mb-5"
          titleClassName="text-white"
        />

        {/* Specific accreditor names — UKAS / CQC / ISO 15189 (audit 1.8) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-5 md:mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
            Tests from providers accredited by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {ACCREDITORS.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-white leading-tight">{a.name}</div>
                  <div className="text-[10px] text-white/55 leading-tight">{a.desc}</div>
                </div>
                {i < ACCREDITORS.length - 1 && (
                  <div className="hidden sm:block w-px h-7 bg-white/15" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 max-w-6xl mx-auto">
          {FEATURED_PROVIDERS.map((id) => {
            const provider = PROVIDER_DETAILS[id];
            if (!provider) return null;

            return (
              <Link
                key={id}
                to={getProviderRoute(id)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 p-3 md:p-4 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-center h-[40px] sm:h-[50px] w-full">
                  <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-white text-xs font-medium text-center leading-tight">
                  {provider.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
