import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import fingerprickAsset from "@/assets/at-home-fingerprick.jpg.asset.json";


const categories = [
  {
    tag: "Blood Testing",
    tagVariant: "teal" as const,
    count: "1,400+ Tests",
    title: "Blood Tests & Panels",
    description:
      "Individual biomarkers to comprehensive wellness panels. At-home kits and clinic-based venepuncture from UKAS-accredited laboratories.",
    link: "/wellness",
    linkLabel: "Explore Tests",
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=1800&q=85&auto=format&fit=crop",
  },
  {
    tag: "Cancer Screening",
    tagVariant: "pink" as const,
    count: "40 Screens",
    title: "Private Cancer Screening",
    description:
      "Multi-cancer early detection tests, tumour markers, and targeted screening for bowel, prostate, ovarian, and other cancers from regulated UK clinics.",
    link: "/tests/cancer",
    linkLabel: "Explore Screening",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1800&q=85&auto=format&fit=crop",
  },
  {
    tag: "Wellness",
    tagVariant: "teal" as const,
    count: "600+ Panels",
    title: "Wellness & Longevity",
    description:
      "Advanced diagnostics for health optimisation. Biological age testing, hormones, cardiovascular risk, and micronutrient status.",
    link: "/test-categories",
    linkLabel: "Explore Panels",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1800&q=85&auto=format&fit=crop",
  },
  {
    tag: "At Home",
    tagVariant: "pink" as const,
    count: "300+ Kits",
    title: "At-Home Test Kits",
    description:
      "Convenient finger-prick and sample collection kits delivered to your door. UKAS-accredited lab analysis with results typically returned within days — no clinic visit needed.",
    link: "/at-home-tests",
    linkLabel: "Explore Kits",
    image: fingerprickAsset.url,

  },
];

const TestCategoriesSection = () => {
  return (
    <section className="bg-white pt-14 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header — standardised to match other section headings */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-pink" />
            <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
              What We Compare
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-pink" />
          </div>
          <SectionHeading
            title="Every test. Every provider."
            gradientText={"\nOne transparent platform."}
            titleClassName="text-tertiary whitespace-pre-line"
          />
          <p className="text-base font-semibold text-tertiary max-w-2xl mx-auto leading-snug mt-2 text-center">
            {"\n"}
          </p>
        </div>

        {/* Cards — image behind dark overlay, content at bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7 sm:gap-9">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative flex flex-col justify-end min-h-[480px] sm:min-h-[570px] rounded-2xl overflow-hidden"
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
                    "linear-gradient(to top, rgba(8,17,41,0.97) 0%, rgba(8,17,41,0.65) 60%, rgba(8,17,41,0.15) 100%)",
                }}
              />


              {/* Card content — sits at bottom above overlay */}
              <div className="relative z-10 p-9 sm:p-10">
                <span
                  className="inline-block font-heading font-bold text-[15px] uppercase tracking-[0.14em] px-4 py-1.5 rounded-md mb-5"
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

                <h3 className="font-heading font-bold text-white text-3xl sm:text-4xl leading-tight mb-4 group-hover:text-brand-turquoise transition-colors duration-200">
                  {cat.title}
                </h3>
                <p className="text-lg sm:text-xl text-white/[0.7] leading-relaxed mb-7">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 font-heading font-bold text-base uppercase tracking-[0.12em] text-brand-turquoise transition-all duration-200 group-hover:gap-3">
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
