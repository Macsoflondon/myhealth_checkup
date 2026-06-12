import { Link } from "react-router-dom";

const categories = [
  {
    tag: "Blood Testing",
    tagVariant: "teal" as const,
    count: "280+ Tests",
    title: "Blood Tests & Panels",
    description:
      "Individual biomarkers to comprehensive wellness panels. At-home kits and clinic-based venepuncture from UKAS-accredited laboratories.",
    link: "/compare",
    linkLabel: "Explore Tests",
  },
  {
    tag: "Cancer Screening",
    tagVariant: "pink" as const,
    count: "40+ Screens",
    title: "Private Cancer Screening",
    description:
      "Multi-cancer early detection tests, tumour markers, and targeted screening for bowel, prostate, ovarian, and other cancers from regulated UK clinics.",
    link: "/categories/cancer-screening",
    linkLabel: "Explore Screening",
  },
  {
    tag: "Wellness",
    tagVariant: "teal" as const,
    count: "60+ Panels",
    title: "Wellness & Longevity",
    description:
      "Advanced diagnostics for health optimisation. Biological age testing, hormones, cardiovascular risk, and micronutrient status.",
    link: "/categories/wellness",
    linkLabel: "Explore Panels",
  },
];

const TestCategoriesSection = () => {
  return (
    <section className="bg-white py-14 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
              What We Compare
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          <h2 className="font-heading font-bold leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl">
            <span className="text-[#081129]">Every test. Every provider.</span>
            <br />
            <span className="text-brand-turquoise">One transparent platform.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#081129]/65 leading-relaxed">
            Browse by category. Compare biomarkers, pricing, turnaround times, and accreditation in one place — with no promotional influence from any provider.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative flex flex-col justify-end min-h-[320px] sm:min-h-[360px] rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1a2a4a 0%, #0d1c3f 45%, #081129 100%)",
              }}
            >
              {/* Count badge */}
              <span
                className="absolute top-4 right-4 z-10 font-heading font-semibold text-xs tracking-wide text-white px-3 py-1.5 rounded-full"
                style={{ background: "rgba(8,17,41,0.75)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {cat.count}
              </span>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-7">
                {/* Category tag */}
                <span
                  className="inline-block font-heading font-bold text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-md mb-3"
                  style={
                    cat.tagVariant === "teal"
                      ? { background: "rgba(34,192,212,0.15)", color: "#22c0d4", border: "1px solid rgba(34,192,212,0.3)" }
                      : { background: "rgba(231,13,105,0.15)", color: "#e70d69", border: "1px solid rgba(231,13,105,0.3)" }
                  }
                >
                  {cat.tag}
                </span>

                <h3 className="font-heading font-bold text-white text-xl sm:text-2xl leading-tight mb-3 group-hover:text-brand-turquoise transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-5">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 font-heading font-bold text-[11px] uppercase tracking-[0.12em] text-brand-turquoise group-hover:gap-3 transition-all">
                  {cat.linkLabel} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCategoriesSection;
