import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Link } from "react-router-dom";

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

export interface DeckCard {
  provider: string;
  providerColor: string;
  title: string;
  chips: string[];
  price: string;
  to: string;
  tagline: string;
}

export const DEFAULT_DECK: DeckCard[] = [
  {
    provider: "Medichecks",
    providerColor: TURQUOISE,
    title: "Advanced Well Woman",
    chips: ["Thyroid", "Hormones", "Vitamins", "Iron"],
    price: "£99",
    tagline: "Comprehensive female health screening",
    to: "/tests/blood",
  },
  {
    provider: "Randox Health",
    providerColor: "#0c6b6a",
    title: "Multi-Cancer Early Detection",
    chips: ["PSA", "CA-125", "CEA", "AFP"],
    price: "£399",
    tagline: "Tumour-marker screening panel",
    to: "/cancer-screening",
  },
  {
    provider: "Goodbody Clinic",
    providerColor: "#d4a843",
    title: "Premium Health MOT",
    chips: ["50+ biomarkers", "GP review", "In-clinic", "2-day results"],
    price: "£295",
    tagline: "Full body MOT, nationwide clinics",
    to: "/tests/wellness",
  },
  {
    provider: "London Medical Laboratory",
    providerColor: PINK,
    title: "Complete Hormone Panel",
    chips: ["Oestrogen", "Progesterone", "Testosterone", "FSH", "LH"],
    price: "£149",
    tagline: "Full reproductive hormone workup",
    to: "/hormones",
  },
];

/** A single device-framed mockup card with real test info. */
export function DeckCardFrame({ card, compact = false }: { card: DeckCard; compact?: boolean }) {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),0_10px_30px_-15px_rgba(0,0,0,0.4)] ring-1 ring-black/10"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Provider top bar */}
      <div
        className="h-2 w-full"
        style={{ background: card.providerColor }}
      />
      {/* Faux browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="ml-3 text-[9px] text-gray-400 font-mono truncate">
          myhealthcheckup.co.uk{card.to}
        </span>
      </div>

      <div className={compact ? "p-4" : "p-6 md:p-8"}>
        {/* Provider label */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] font-[Montserrat]"
            style={{ color: card.providerColor }}
          >
            {card.provider}
          </span>
          <span
            className="text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${card.providerColor}15`, color: card.providerColor }}
          >
            UKAS · CQC
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold font-[Montserrat] tracking-[-0.02em] leading-[1.05] text-[${NAVY}] ${
            compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
          }`}
          style={{ color: NAVY }}
        >
          {card.title}
        </h3>

        <p className={`mt-1.5 text-gray-500 ${compact ? "text-[11px]" : "text-xs md:text-sm"}`}>
          {card.tagline}
        </p>

        {/* Biomarker chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {card.chips.slice(0, compact ? 3 : 5).map((c) => (
            <span
              key={c}
              className={`rounded-full bg-gray-100 text-gray-700 font-medium ${
                compact ? "text-[9px] px-2 py-0.5" : "text-[10px] md:text-xs px-2.5 py-1"
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className={`flex items-end justify-between ${compact ? "mt-4" : "mt-6"}`}>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
              From
            </div>
            <div
              className={`font-bold font-[Montserrat] leading-none ${
                compact ? "text-2xl" : "text-3xl md:text-4xl"
              }`}
              style={{ color: NAVY }}
            >
              {card.price}
            </div>
          </div>
          <div
            className={`rounded-full font-semibold font-[Montserrat] text-white ${
              compact ? "text-[10px] px-3 py-1.5" : "text-xs md:text-sm px-4 py-2"
            }`}
            style={{ background: card.providerColor }}
          >
            View test →
          </div>
        </div>
      </div>
    </div>
  );
}

/** Per-card keyframes: hero stack → spread → 2x2 grid. */
const CARD_FRAMES: Array<{
  rotate: [number, number, number];
  x: [string, string, string];
  y: [string, string, string];
  scale: [number, number, number];
  zIndex: number;
}> = [
  // Card 0 — top-left of final grid; front of stack initially
  {
    rotate: [-3, -1, 0],
    x: ["8%", "-8%", "-26%"],
    y: ["6%", "-2%", "-22%"],
    scale: [1, 0.95, 0.78],
    zIndex: 40,
  },
  // Card 1 — top-right; behind-right in stack
  {
    rotate: [7, 4, 0],
    x: ["22%", "18%", "26%"],
    y: ["-2%", "-6%", "-22%"],
    scale: [0.95, 0.93, 0.78],
    zIndex: 30,
  },
  // Card 2 — bottom-left; behind-left in stack
  {
    rotate: [-9, -5, 0],
    x: ["-6%", "-12%", "-26%"],
    y: ["10%", "10%", "30%"],
    scale: [0.9, 0.9, 0.78],
    zIndex: 20,
  },
  // Card 3 — bottom-right; far back in stack
  {
    rotate: [12, 7, 0],
    x: ["18%", "22%", "26%"],
    y: ["14%", "16%", "30%"],
    scale: [0.88, 0.88, 0.78],
    zIndex: 10,
  },
];

function AnimatedCard({
  card,
  progress,
  index,
}: {
  card: DeckCard;
  progress: MotionValue<number>;
  index: number;
}) {
  const frame = CARD_FRAMES[index];
  const rotate = useTransform(progress, [0, 0.5, 1], frame.rotate);
  const x = useTransform(progress, [0, 0.5, 1], frame.x);
  const y = useTransform(progress, [0, 0.5, 1], frame.y);
  const scale = useTransform(progress, [0, 0.5, 1], frame.scale);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ rotate, x, y, scale, zIndex: frame.zIndex }}
    >
      <Link to={card.to} className="block w-full h-full" aria-label={`View ${card.title}`}>
        <DeckCardFrame card={card} />
      </Link>
    </motion.div>
  );
}

export default function HeroTiltedDeck({ cards = DEFAULT_DECK }: { cards?: DeckCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  // Track scroll progress while the hero is in view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px]"
      style={{ perspective: "1400px" }}
    >
      {/* Desktop/tablet: animated tilted deck */}
      <div className="hidden sm:block absolute inset-0">
        {cards.slice(0, 4).map((card, i) => (
          <AnimatedCard key={card.title} card={card} progress={scrollYProgress} index={i} />
        ))}
      </div>

      {/* Mobile: static fanned stack — no scroll choreography */}
      <div className="sm:hidden absolute inset-0">
        {cards.slice(0, 3).map((card, i) => {
          const rot = [-4, 3, -7][i];
          const tx = [0, 14, -10][i];
          const ty = [0, 18, 30][i];
          const z = [30, 20, 10][i];
          const sc = [1, 0.94, 0.88][i];
          return (
            <div
              key={card.title}
              className="absolute inset-0"
              style={{
                transform: `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${sc})`,
                zIndex: z,
              }}
            >
              <Link to={card.to} className="block w-full h-full">
                <DeckCardFrame card={card} compact />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
