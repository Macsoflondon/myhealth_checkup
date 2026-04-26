import { SectionHeading } from "@/components/ui/section-heading";
import { Quote } from "lucide-react";

const quotes = [
  {
    quote:
      "Early detection of cardiovascular and metabolic risk factors through health checks (including blood tests) can help identify conditions such as diabetes and cardiovascular disease earlier and improve long-term outcomes.",
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
    <section className="py-4 sm:py-5 md:py-6 bg-gradient-to-b from-white to-[hsl(187,72%,97%)]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-3 sm:mb-4">
          {/* Pink decorative swoosh */}
          <svg className="mx-auto mb-2" width="40" height="10" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15 Q20 2 40 10 Q60 18 75 5" stroke="#e70d69" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
          <SectionHeading title="Backed by" gradientText="Expert Guidance" />
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Our platform standards are informed by the UK's leading health authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 max-w-7xl mx-auto">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
            >
              {/* Accent top bar */}
              <div className={`absolute top-0 left-6 right-6 h-[3px] rounded-b-full ${
                i === 0 ? 'bg-brand-turquoise' : i === 1 ? 'bg-brand-pink' : 'bg-brand-turquoise'
              }`} />
              
              {/* Quote icon */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
                i === 0 ? 'bg-brand-turquoise/10' : i === 1 ? 'bg-brand-pink/10' : 'bg-brand-turquoise/10'
              }`}>
                <Quote className={`w-3.5 h-3.5 ${
                  i === 0 ? 'text-brand-turquoise' : i === 1 ? 'text-brand-pink' : 'text-brand-turquoise'
                }`} />
              </div>
              
              <p className="text-foreground font-sans text-xs sm:text-sm leading-relaxed mb-2.5">
                "{q.quote}"
              </p>
              <div className="pt-2 border-t border-gray-100">
                <p className="font-heading font-semibold text-brand-navy text-xs">
                  {q.source}
                </p>
                <p className="text-muted-foreground text-[10px] mt-0">{q.credential}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertQuotes;