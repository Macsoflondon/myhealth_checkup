import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DEFAULT_DECK, type DeckCard } from "./HeroTiltedDeck";

const NAVY = "#081129";

function GridCard({ card }: { card: DeckCard }) {
  return (
    <Link
      to={card.to}
      className="group block rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-2" style={{ background: card.providerColor }} />
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] text-gray-400 font-mono truncate">
          myhealthcheckup.co.uk{card.to}
        </span>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-bold uppercase tracking-[0.18em] font-[Montserrat]"
            style={{ color: card.providerColor }}
          >
            {card.provider}
          </span>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${card.providerColor}15`, color: card.providerColor }}
          >
            UKAS · CQC
          </span>
        </div>

        <h3
          className="font-bold font-[Montserrat] tracking-[-0.02em] leading-[1.05] text-2xl md:text-3xl"
          style={{ color: NAVY }}
        >
          {card.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{card.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {card.chips.map((c) => (
            <span
              key={c}
              className="rounded-full bg-gray-100 text-gray-700 font-medium text-xs px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              From
            </div>
            <div
              className="font-bold font-[Montserrat] leading-none text-3xl md:text-4xl"
              style={{ color: NAVY }}
            >
              {card.price}
            </div>
          </div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full font-semibold font-[Montserrat] text-white text-sm px-5 py-2.5 group-hover:gap-2.5 transition-all"
            style={{ background: card.providerColor }}
          >
            View test <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedTestsGrid() {
  return (
    <section className="relative bg-[#F5F5F5] px-5 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs tracking-[0.22em] font-semibold uppercase font-[Montserrat] text-gray-500 mb-3">
              Featured Tests
            </div>
            <h2
              className="font-bold font-[Montserrat] tracking-[-0.02em] leading-[1.05] text-4xl md:text-5xl"
              style={{ color: NAVY }}
            >
              Compare. Choose. Take control.
            </h2>
          </div>
          <Link
            to="/compare"
            className="text-sm font-semibold font-[Montserrat] underline underline-offset-4 hover:opacity-70 transition-opacity"
            style={{ color: NAVY }}
          >
            View all tests →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {DEFAULT_DECK.map((card) => (
            <GridCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
