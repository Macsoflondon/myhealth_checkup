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

const AccreditedProvidersBar = () => {
  return (
    <section className="py-8 md:py-12 bg-tertiary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-brand-turquoise" />
          <span className="text-brand-turquoise text-xs font-semibold uppercase tracking-[0.25em]">
            Accredited & Verified
          </span>
          <div className="h-px w-8 bg-brand-turquoise" />
        </div>

        <SectionHeading
          title="Accredited Providers"
          gradientText="We Compare"
          className="mb-8 md:mb-10"
          titleClassName="text-white"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
          {FEATURED_PROVIDERS.map((id) => {
            const provider = PROVIDER_DETAILS[id];
            if (!provider) return null;
            const badge = provider.accreditations?.[0] ?? 'Accredited';

            return (
              <Link
                key={id}
                to={getProviderRoute(id)}
                className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white/5 border border-white/10 p-6 md:p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-center h-[80px] sm:h-[100px] w-full">
                  <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className={`max-h-full max-w-full object-contain ${id === 'medichecks' ? 'scale-125' : ''}`}
                    loading="lazy"
                  />
                </div>
                <span className="text-white text-sm font-medium text-center leading-tight">
                  {provider.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/15 px-2.5 py-0.5 rounded-full">
                  {badge}
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
