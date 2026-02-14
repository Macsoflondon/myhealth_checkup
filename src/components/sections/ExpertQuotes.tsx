import { SectionHeading } from "@/components/ui/section-heading";

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
    <section className="py-10 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-10">
          <SectionHeading title="Backed by" gradientText="Expert Guidance" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 relative border-l-4 border-l-primary"
            >
              <p className="text-foreground font-sans text-sm sm:text-base leading-relaxed mb-4 italic">
                "{q.quote}"
              </p>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">
                  {q.source}
                </p>
                <p className="text-muted-foreground text-xs">{q.credential}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertQuotes;
