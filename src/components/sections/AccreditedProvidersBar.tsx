import { PROVIDER_DETAILS } from "@/constants/providers";

const FEATURED_PROVIDERS = [
  'medichecks',
  'goodbody-clinic',
  'thriva',
  'randox',
  'london-medical-laboratory',
  'lola-health',
];

const AccreditedProvidersBar = () => {
  return (
    <section className="py-16 md:py-20 bg-tertiary">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-10 md:mb-14">
          Accredited Providers We Compare
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
          {FEATURED_PROVIDERS.map((id) => {
            const provider = PROVIDER_DETAILS[id];
            if (!provider) return null;
            const badge = provider.accreditations?.[0] ?? 'Accredited';

            return (
              <div
                key={id}
                className="flex flex-col items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-5 md:p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
              >
                <img
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
                <span className="text-white text-sm font-medium text-center leading-tight">
                  {provider.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/15 px-2.5 py-0.5 rounded-full">
                  {badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
