import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { SaveProviderButton } from "@/components/common/SaveProviderButton";
import { useSavedProviders } from "@/hooks/useSavedProviders";
import { getProviderRoute, getProviderProfileRoute } from "@/utils/providerRoutes";
import { buildProviderWebsiteUrl, externalLinkProps } from "@/utils/urlTracking";
import { getProviderRating } from "@/constants/providerRatings";

interface ProviderEntry {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  tags: string[];
  website: string;
  glow: string; // hex
  glowRgb: string; // r,g,b
}

const PROVIDERS: ProviderEntry[] = [
  {
    id: "medichecks",
    name: "Medichecks",
    displayName: "Medichecks",
    tagline: "Your Health, Your Way",
    description:
      "Award-winning home and clinic blood testing with doctor-reviewed results and comprehensive health MOTs.",
    tags: ["Health MOTs", "Doctor Reviews", "UKAS Accredited"],
    website: "medichecks.com",
    glow: "#e70d69",
    glowRgb: "231,13,105",
  },
  {
    id: "goodbody",
    name: "GOODBODY",
    displayName: "Goodbody Clinic",
    tagline: "Trusted Health Testing",
    description:
      "Comprehensive wellness profiles with GP follow-ups across a nationwide network of CQC-regulated clinics.",
    tags: ["GP Follow-ups", "CQC Regulated", "Nationwide"],
    website: "health.goodbodyclinic.com",
    glow: "#009B8D",
    glowRgb: "0,155,141",
  },
  {
    id: "thriva",
    name: "Thriva",
    displayName: "Thriva",
    tagline: "Track. Improve. Optimise.",
    description:
      "Personalised home blood tests and a digital dashboard with doctor reviews to monitor your health over time.",
    tags: ["Home Testing", "Digital Dashboard", "GP Advice"],
    website: "thriva.co",
    glow: "#3D1152",
    glowRgb: "61,17,82",
  },
  {
    id: "randox",
    name: "Randox Health",
    displayName: "Randox Health",
    tagline: "Excellence in Diagnostics",
    description:
      "Global diagnostics provider offering advanced health checks across UKAS-accredited and FDA-approved facilities.",
    tags: ["UKAS Accredited", "FDA Approved", "Advanced Diagnostics"],
    website: "randoxhealth.com",
    glow: "#2D4BA0",
    glowRgb: "45,75,160",
  },
  {
    id: "london-medical-laboratory",
    name: "London Medical Laboratory",
    displayName: "London Medical Laboratory",
    tagline: "Fast, Accurate Private Blood Testing",
    description:
      "UKAS-accredited central laboratory offering next-day in-store results and home finger-prick kits delivered across the UK.",
    tags: ["UKAS Accredited", "Next-Day Results", "Home Kits"],
    website: "londonmedicallaboratory.com",
    glow: "#1565C0",
    glowRgb: "21,101,192",
  },
  {
    id: "lola-health",
    name: "Lola Health",
    displayName: "Lola Health",
    tagline: "Modern Women's Wellness",
    description:
      "Modern testing platform focused on women's health and wellness with a tailored, design-led experience.",
    tags: ["Women's Health", "Modern Platform", "Wellness Focus"],
    website: "referrals.lolahealth.com/myhealthcheckup",
    glow: "#E8604C",
    glowRgb: "232,96,76",
  },
  {
    id: "clinilabs",
    name: "Clinilabs",
    displayName: "Clinilabs",
    tagline: "Clinical Precision, Trusted Results",
    description:
      "UKAS-accredited clinical laboratory delivering a wide range of diagnostic and health screening tests across the UK.",
    tags: ["UKAS Accredited", "Clinical Lab", "Diagnostics"],
    website: "clinilabs.co.uk",
    glow: "#2E7D32",
    glowRgb: "46,125,50",
  },
  {
    id: "london-health-company",
    name: "London Health Company",
    displayName: "London Health Company",
    tagline: "Accessible Private Healthcare",
    description:
      "London-based comprehensive testing offering accessible, affordable private blood tests and health checks.",
    tags: ["Health Checks", "Blood Tests", "Affordable"],
    website: "londonhealthcompany.co.uk",
    glow: "#3b82f6",
    glowRgb: "59,130,246",
  },
  {
    id: "medical-diagnosis",
    name: "Medical Diagnosis",
    displayName: "Medical Diagnosis",
    tagline: "Specialist Diagnostics, Faster",
    description:
      "Specialist diagnostics with typically fast turnaround blood testing and health screening across the UK.",
    tags: ["Fast Results", "Specialist Testing", "UK Wide"],
    website: "medical-diagnosis.co.uk",
    glow: "#E53935",
    glowRgb: "229,57,53",
  },
];

const FeaturedProvidersGlass = () => {
  const { isProviderSaved, toggleSaveProvider } = useSavedProviders();

  return (
    <section className="relative w-full py-16 md:py-24 px-4 overflow-hidden bg-[#fafbfc]">


      <div className="relative max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="relative text-center space-y-4 py-10">
          <div
            className="absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            style={{
              backgroundImage: "radial-gradient(#22c0d4 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-10 bg-[#22c0d4]/60" />
            <span className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-[#22c0d4] uppercase">
              Accredited &amp; Verified
            </span>
            <span className="h-px w-10 bg-[#22c0d4]/60" />
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#081129] leading-tight tracking-tight">
            Our Trusted Partners
          </h1>
          <p className="text-[#081129] text-base md:text-lg max-w-2xl mx-auto pt-6">
            Accredited UK health testing providers — UKAS laboratories and CQC-regulated clinics with proven track records of clinical excellence.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {PROVIDERS.map((p) => {
            const canonical = getProviderRating(p.id);
            return (
              <article key={p.id} className="group relative">
                {/* Always-visible coloured border layer */}
                <div
                  className="absolute -inset-[2px] rounded-[2.25rem] transition-all duration-500 group-hover:blur-[3px]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(${p.glowRgb},0.9), rgba(${p.glowRgb},0.45))`,
                    opacity: 1,
                  }}
                />

                <div
                  className="relative bg-white rounded-[2.15rem] p-7 md:p-8 h-full flex flex-col transition-all duration-700 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    boxShadow: `0 0 0 0 rgba(${p.glowRgb},0)`,
                  }}
                >
                  {/* Decorative orb */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] transition-all duration-700"
                    style={{ backgroundColor: `rgba(${p.glowRgb}, 0.06)` }}
                  />

                  <div className="relative z-10 flex-1 space-y-6">
                    {/* Top row: logo + rating + save */}
                    <div className="flex justify-between items-start gap-3">
                      <div
                        className="h-16 w-32 bg-[#f8fafc] rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 ring-1 ring-[#e2e8f0] group-hover:ring-[#22c0d4]/30"
                      >
                        <ProviderLogo
                          provider={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-full border border-[#e2e8f0] transition-colors group-hover:border-yellow-500/40">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-[#081129] text-xs font-bold">
                            {canonical.rating}
                          </span>
                        </div>
                        <SaveProviderButton
                          isSaved={isProviderSaved(p.id)}
                          onToggle={() => toggleSaveProvider(p.id, p.displayName)}
                          className="!bg-transparent hover:!bg-transparent !border-0 !shadow-none !ring-0 !p-0 !h-auto !w-auto text-[#e70d69] hover:text-[#e70d69] [&_svg]:fill-[#e70d69] [&_svg]:h-5 [&_svg]:w-5"
                        />
                      </div>
                    </div>

                    {/* Title + tagline */}
                    <div className="space-y-1">
                      <h2 className="font-heading text-2xl font-bold text-[#081129] transition-colors">
                        {p.displayName}
                      </h2>
                      <p
                        className="italic text-lg opacity-90"
                        style={{
                          fontFamily: "'EB Garamond', Garamond, serif",
                          color: p.glow,
                        }}
                      >
                        {p.tagline}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#94a3b8] pt-1">
                        {canonical.reviewsFormatted} reviews · UK Wide
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[#64748b] leading-relaxed text-[15px] transition-colors">
                      {p.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-lg bg-[#f0f4fa] border border-[#e2e8f0] text-[10px] uppercase font-bold tracking-wider text-[#94a3b8] transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="relative z-10 space-y-3 pt-8">
                    <Link
                      to={getProviderRoute(p.id)}
                      className="block w-full py-4 px-6 rounded-2xl text-white font-bold text-sm text-center shadow-lg transition-all duration-300 active:scale-95 hover:brightness-110"
                      style={{
                        background: `linear-gradient(135deg, ${p.glow}, rgba(${p.glowRgb}, 0.78))`,
                        boxShadow: `0 10px 30px -10px rgba(${p.glowRgb}, 0.5)`,
                      }}
                    >
                      Browse Tests
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/provider/${p.id.toLowerCase()}`}
                        className="py-3 px-4 rounded-xl border border-[#e2e8f0] text-[#64748b] text-xs font-semibold text-center hover:bg-[#f8fafc] hover:text-[#081129] transition-all"
                      >
                        View Profile
                      </Link>
                      <a
                        href={buildProviderWebsiteUrl(`https://${p.website}`, p.id)}
                        {...externalLinkProps}
                        className="py-3 px-4 rounded-xl border border-[#e2e8f0] text-[#64748b] text-xs font-semibold text-center hover:bg-[#f8fafc] hover:text-[#081129] transition-all"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Trust footer */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[#081129] text-sm">
          <p>All providers are independently vetted for clinical excellence.</p>
          <div className="flex gap-6 uppercase tracking-[0.2em] font-bold text-[10px]">
            <span className="flex items-center gap-2 text-[#081129]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              UKAS Accredited
            </span>
            <span className="flex items-center gap-2 text-[#081129]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c0d4]" />
              CQC Regulated
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProvidersGlass;
