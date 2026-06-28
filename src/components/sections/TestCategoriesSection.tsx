import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEFAULT_DECK, DeckCardFrame } from "./HeroTiltedDeck";

const TestCategoriesSection = () => {
  return (
    <section className="bg-white pt-14 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
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
        </div>

        {/* Cards — featured-test mockups (Medichecks / Randox / Goodbody / LML) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          {DEFAULT_DECK.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="block group hover:-translate-y-1 transition-transform duration-300"
              aria-label={`View ${card.title}`}
            >
              <div className="relative aspect-[3/4] min-h-[440px]">
                <DeckCardFrame card={card} compact />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCategoriesSection;
