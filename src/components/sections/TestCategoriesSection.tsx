import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import bloodTubesAsset from "@/assets/blood-test-tubes.jpeg.asset.json";

const categories = [
  {
    tag: "Blood Testing",
    tagVariant: "teal" as const,
    count: "1,400+ Tests",
    title: "Blood Tests & Panels",
    description:
      "Individual biomarkers to comprehensive wellness panels. At-home kits and clinic-based venepuncture from UKAS-accredited laboratories.",
    link: "/compare",
    linkLabel: "Explore Tests",
    image: bloodTubesAsset.url,
  },
  {
    tag: "Cancer Screening",
    tagVariant: "pink" as const,
    count: "40 Screens",
    title: "Private Cancer Screening",
    description:
      "Multi-cancer early detection tests, tumour markers, and targeted screening for bowel, prostate, ovarian, and other cancers from regulated UK clinics.",
    link: "/categories/cancer-screening",
    linkLabel: "Explore Screening",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=85&auto=format&fit=crop",
  },
  {
    tag: "Wellness",
    tagVariant: "teal" as const,
    count: "600+ Panels",
    title: "Wellness & Longevity",
    description:
      "Advanced diagnostics for health optimisation. Biological age testing, hormones, cardiovascular risk, and micronutrient status.",
    link: "/categories/wellness",
    linkLabel: "Explore Panels",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85&auto=format&fit=crop",
  },
];

const TestCategoriesSection = () => {
  return (
    <section className="bg-white py-14 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header — standardised to match other section headings */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-6 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
              What We Compare
            </span>
            <div className="h-px w-6 bg-slate-200" />
          </div>
          <SectionHeading
            title="Every test. Every provider."
            gradientText="One transparent platform."
            titleClassName="text-tertiary"
          />
          <p className="text-base font-semibold text-tertiary max-w-2xl mx-auto leading-snug mt-2 text-center">
            Browse by category. Compare biomarkers, pricing, turnaround times, and accreditation in one place — with no promotional influence from any provider.
          </p>
        </div>

        {/* Cards — image behind dark overlay, content at bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative flex flex-col justify-end min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient overlay — transparent at top, solid navy at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,17,41,0.97) 0%, rgba(8,17,41,0.6) 55%, rgba(8,17,41,0.15) 100%)",
                }}
              />

              {/* Count badge — top right */}
              <span
                className="absolute top-4 right-4 z-10 font-heading font-semibold text-xs tracking-wide text-white px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,17,41,0.72)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                {cat.count}
              </span>

              {/* Card content — sits at bottom above overlay */}
              <div className="relative z-10 p-6 sm:p-7">
                <span
                  className="inline-block font-heading font-bold text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-md mb-3"
                  style={
                    cat.tagVariant === "teal"
                      ? {
                          background: "rgba(34,192,212,0.18)",
                          color: "#22c0d4",
                          border: "1px solid rgba(34,192,212,0.35)",
                        }
                      : {
                          background: "rgba(231,13,105,0.18)",
                          color: "#e70d69",
                          border: "1px solid rgba(231,13,105,0.35)",
                        }
                  }
                >
                  {cat.tag}
                </span>

                <h3 className="font-heading font-bold text-white text-xl sm:text-2xl leading-tight mb-3 group-hover:text-brand-turquoise transition-colors duration-200">
                  {cat.title}
                </h3>
                <p className="text-sm text-white/[0.62] leading-relaxed mb-5">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 font-heading font-bold text-[11px] uppercase tracking-[0.12em] text-brand-turquoise transition-all duration-200 group-hover:gap-3">
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
