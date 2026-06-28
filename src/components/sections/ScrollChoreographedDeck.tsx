import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_DECK, type DeckCard } from "./HeroTiltedDeck";

const NAVY = "#081129";

/**
 * Renders an invisible placeholder div. Exposes its DOMRect through a ref callback.
 * Used as an anchor for the scroll-choreographed cards.
 */
function Anchor({
  setRect,
  className,
  ariaLabel,
}: {
  setRect: (el: HTMLDivElement | null) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return <div ref={setRect} className={className} aria-label={ariaLabel} aria-hidden="true" />;
}

/** Card visual — copied minimal from HeroTiltedDeck but using compact styling. */
function CardVisual({ card }: { card: DeckCard }) {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),0_10px_30px_-15px_rgba(0,0,0,0.4)] ring-1 ring-black/10"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="h-2 w-full" style={{ background: card.providerColor }} />
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="ml-3 text-[9px] text-gray-400 font-mono truncate">
          myhealthcheckup.co.uk{card.to}
        </span>
      </div>
      <div className="p-4 md:p-6">
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
        <h3
          className="font-bold font-[Montserrat] tracking-[-0.02em] leading-[1.05] text-lg md:text-2xl"
          style={{ color: NAVY }}
        >
          {card.title}
        </h3>
        <p className="mt-1.5 text-[11px] md:text-sm text-gray-500">{card.tagline}</p>
        <div className="mt-3 md:mt-4 flex flex-wrap gap-1.5">
          {card.chips.slice(0, 4).map((c) => (
            <span
              key={c}
              className="rounded-full bg-gray-100 text-gray-700 font-medium text-[9px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-4 md:mt-5 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
              From
            </div>
            <div
              className="font-bold font-[Montserrat] leading-none text-2xl md:text-3xl"
              style={{ color: NAVY }}
            >
              {card.price}
            </div>
          </div>
          <div
            className="rounded-full font-semibold font-[Montserrat] text-white text-[10px] md:text-sm px-3 py-1.5 md:px-4 md:py-2"
            style={{ background: card.providerColor }}
          >
            View test →
          </div>
        </div>
      </div>
    </div>
  );
}

type Rect = { x: number; y: number; w: number; h: number };

function rectFromEl(el: HTMLElement | null): Rect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

/**
 * Source rects: per-card position in the hero stack (relative to the source anchor).
 * Matches CARD_FRAMES start values from HeroTiltedDeck so the visual starts identical.
 */
const STACK_OFFSETS = [
  { tx: 0.08, ty: 0.06, rot: -3, scale: 1.0, z: 40 },
  { tx: 0.22, ty: -0.02, rot: 7, scale: 0.95, z: 30 },
  { tx: -0.06, ty: 0.1, rot: -9, scale: 0.9, z: 20 },
  { tx: 0.18, ty: 0.14, rot: 12, scale: 0.88, z: 10 },
];

export interface ScrollChoreographedDeckProps {
  cards?: DeckCard[];
  /** External ref to the source anchor element (hero right column). */
  sourceAnchorId: string;
}

/**
 * The animated overlay that travels cards from a hero anchor down into a 2×2 grid.
 * Renders as a `position: absolute` layer over the document so it can move freely
 * across sections without disturbing layout.
 */
export default function ScrollChoreographedDeck({
  cards = DEFAULT_DECK,
  sourceAnchorId,
}: ScrollChoreographedDeckProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);

  const [sourceRect, setSourceRect] = useState<Rect | null>(null);
  const [slotRects, setSlotRects] = useState<Array<Rect | null>>([null, null, null, null]);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Measure source + slot rects. Re-measure on resize and after layout shifts.
  useLayoutEffect(() => {
    const measure = () => {
      const src = document.getElementById(sourceAnchorId);
      setSourceRect(rectFromEl(src));
      setSlotRects(slotRefs.current.map((el) => rectFromEl(el)));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    const src = document.getElementById(sourceAnchorId);
    if (src) ro.observe(src);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    // Re-measure after fonts/images settle
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 800);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [sourceAnchorId]);

  // Scroll-driven transform. Use rAF + direct style writes to bypass React per-frame.
  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (!sourceRect) return;
    if (slotRects.some((r) => !r)) return;

    let raf = 0;
    const animate = () => {
      raf = 0;
      const scrollY = window.scrollY;
      // Progress 0 → 1 maps from "source rect at viewport center" to
      // "slot rects fully visible". Use the source bottom hitting top of viewport as 0,
      // and the grid section top hitting viewport top as 1.
      const srcCenterY = sourceRect.y + sourceRect.h / 2;
      const dstCenterY = (slotRects[0]!.y + slotRects[3]!.y + slotRects[3]!.h) / 2;
      const startScroll = Math.max(0, srcCenterY - window.innerHeight * 0.5);
      const endScroll = Math.max(startScroll + 1, dstCenterY - window.innerHeight * 0.55);
      const raw = (scrollY - startScroll) / (endScroll - startScroll);
      const p = Math.max(0, Math.min(1, raw));
      // Ease — smoothstep
      const t = p * p * (3 - 2 * p);

      for (let i = 0; i < 4; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const slot = slotRects[i]!;
        const off = STACK_OFFSETS[i];

        // Source position = source rect + stack offset (scaled by source size)
        const srcX = sourceRect.x + off.tx * sourceRect.w;
        const srcY = sourceRect.y + off.ty * sourceRect.h;
        const srcW = sourceRect.w * off.scale;
        const srcH = sourceRect.h * off.scale;

        // Interpolate top-left + size
        const x = srcX + (slot.x - srcX) * t;
        const y = srcY + (slot.y - srcY) * t;
        const w = srcW + (slot.w - srcW) * t;
        const h = srcH + (slot.h - srcH) * t;
        const rot = off.rot * (1 - t);

        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
        card.style.zIndex = String(off.z + (t > 0.5 ? 0 : 0));
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", animate);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", animate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready, reducedMotion, sourceRect, slotRects]);

  const useStatic = reducedMotion;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F5F5F5] px-5 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20"
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
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

        {/* Slot placeholders form the resting 2×2 grid. The animated cards land here. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.slice(0, 4).map((card, i) => (
            <div key={card.title} className="relative aspect-[4/3.2] min-h-[280px]">
              <Anchor
                setRect={(el) => (slotRefs.current[i] = el)}
                className="absolute inset-0"
              />
              {/* On mobile or reduced motion, render static cards inside the slot. */}
              {useStatic && (
                <Link to={card.to} className="absolute inset-0 block">
                  <CardVisual card={card} />
                </Link>
              )}
              {/* On mobile (no animation layer), render static cards too. */}
              <div className="absolute inset-0 sm:hidden">
                <Link to={card.to} className="block w-full h-full">
                  <CardVisual card={card} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated overlay layer — only on >= sm screens with motion allowed */}
      {!useStatic && (
        <div
          className="hidden sm:block pointer-events-none absolute inset-0"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          {/* Cards rendered as fixed-document-position absolute elements. */}
          <div
            className="pointer-events-none"
            style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}
          >
            {cards.slice(0, 4).map((card, i) => (
              <div
                key={card.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className="pointer-events-auto will-change-transform"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: 0,
                  height: 0,
                  zIndex: STACK_OFFSETS[i].z,
                  transformOrigin: "center center",
                }}
              >
                <Link to={card.to} className="block w-full h-full" aria-label={`View ${card.title}`}>
                  <CardVisual card={card} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
