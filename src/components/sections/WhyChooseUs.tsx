import { Check, X } from "lucide-react";


const comparisons = [
  { us: "UKAS accredited labs only", them: "Mixed lab standards" },
  { us: "CQC regulated providers", them: "Unverified providers" },
  { us: "No payments taken on our site", them: "Payment intermediaries" },
  { us: "Fully independent rankings", them: "Pay-to-rank listings" },
  { us: "Free to use, no registration", them: "Account walls and upsells" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center text-brand-pink">
            Why myhealth checkup?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border overflow-hidden shadow-md">
          {/* Header row */}
          <div className="grid grid-cols-2 text-center font-heading font-bold text-sm sm:text-base">
            <div className="py-3 sm:py-4 bg-primary text-primary-foreground">
              myhealth checkup
            </div>
            <div className="py-3 sm:py-4 bg-muted text-muted-foreground">
              Other Sites
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 text-sm sm:text-base ${
                i % 2 === 0 ? "bg-card" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-r border-border">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-sans">{row.us}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground font-sans">{row.them}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
