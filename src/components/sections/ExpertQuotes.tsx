import { SectionHeading } from "@/components/ui/section-heading";
import { Quote } from "lucide-react";

const quotes = [
  {
    quote:
      "Early detection through routine blood testing can significantly improve outcomes for conditions such as diabetes, cardiovascular disease, and thyroid disorders.",
    source: "NHS Health Check Programme",
    credential: "Public Health England",
  },
  {
    quote:
      "People should be empowered to make informed decisions about their health, supported by access to transparent, high-quality information.",
    source: "NICE Guideline NG197",
    credential: "National Institute for Health and Care Excellence",
  },
  {
    quote:
      "Accreditation to ISO 15189 provides assurance that medical laboratories meet international standards for quality and competence.",
    source: "UKAS",
    credential: "United Kingdom Accreditation Service",
  },
];

const ExpertQuotes = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[hsl(187,72%,97%)]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <SectionHeading title="Backed by" gradientText="Expert Guidance" />
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mt-3">
            Our platform standards are informed by the UK's leading health authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
            >
              {/* Accent top bar */}
              <div className={`absolute top-0 left-6 right-6 h-[3px] rounded-b-full ${
                i === 0 ? 'bg-brand-turquoise' : i === 1 ? 'bg-brand-pink' : 'bg-brand-turquoise'
              }`} />
              
              {/* Quote icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                i === 0 ? 'bg-brand-turquoise/10' : i === 1 ? 'bg-brand-pink/10' : 'bg-brand-turquoise/10'
              }`}>
                <Quote className={`w-5 h-5 ${
                  i === 0 ? 'text-brand-turquoise' : i === 1 ? 'text-brand-pink' : 'text-brand-turquoise'
                }`} />
              </div>
              
              <p className="text-foreground font-sans text-sm sm:text-base leading-relaxed mb-5">
                "{q.quote}"
              </p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-heading font-semibold text-brand-navy text-sm">
                  {q.source}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">{q.credential}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertQuotes;