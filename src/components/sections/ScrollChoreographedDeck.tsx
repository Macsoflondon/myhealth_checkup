import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fingerprickAsset from "@/assets/at-home-fingerprick.jpg.asset.json";

const NAVY = "#081129";

export interface CategoryCard {
  tag: string;
  tagVariant: "teal" | "pink";
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  image: string;
}

export const DEFAULT_CATEGORIES: CategoryCard[] = [
  {
    tag: "Blood Testing",
    tagVariant: "teal",
    title: "Blood Tests & Panels",
    description:
      "Individual biomarkers to comprehensive wellness panels. At-home kits and clinic-based venepuncture from UKAS-accredited laboratories.",
    link: "/wellness",
    linkLabel: "Explore Tests",
    image:
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=1200&q=85&auto=format&fit=crop",
  },
  {
    tag: "Cancer Screening",
    tagVariant: "pink",
    title: "Private Cancer Screening",
    description:
      "Multi-cancer early detection tests, tumour markers, and targeted screening for bowel, prostate, ovarian, and other cancers from regulated UK clinics.",
    link: "/tests/cancer",
    linkLabel: "Explore Screening",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=85&auto=format&fit=crop",
  },
  {
    tag: "Wellness",
    tagVariant: "teal",
    title: "Wellness & Longevity",
    description:
      "Advanced diagnostics for health optimisation. Biological age testing, hormones, cardiovascular risk, and micronutrient status.",
    link: "/test-categories",
    linkLabel: "Explore Panels",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85&auto=format&fit=crop",
  },
  {
    tag: "At Home",
    tagVariant: "pink",
    title: "At-Home Test Kits",
    description:
      "Convenient finger-prick and sample collection kits delivered to your door. UKAS-accredited lab analysis with results typically returned within days — no clinic visit needed.",
    link: "/at-home-tests",
    linkLabel: "Explore Kits",
    image: fingerprickAsset.url,
  },
];

/** Tall portrait category card — image bg, navy gradient, content at bottom. */
function CategoryCardVisual({ card }: { card: CategoryCard }) {
  const tealStyle = {
    background: "rgba(34,192,212,0.18)",
    color: "#22c0d4",
    border: "1px solid rgba(34,192,212,0.35)",
  };
  const pinkStyle = {
    background: "rgba(231,13,105,0.18)",
    color: "#e70d69",
    border: "1px solid rgba(231,13,105,0.35)",
  };
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55),0_10px_30px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/10 flex flex-col justify-end">
      <img
        src={card.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,17,41,0.97) 0%, rgba(8,17,41,0.65) 60%, rgba(8,17,41,0.15) 100%)",
        }}
      />
      <div className="relative z-10 p-6 sm:p-8">
        <span
          className="inline-block font-heading font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.14em] px-3 py-1 rounded-md mb-4"
          style={card.tagVariant === "teal" ? tealStyle : pinkStyle}
        >
          {card.tag}
        </span>
        <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl leading-tight mb-3">
          {card.title}
        </h3>
        <p className="text-sm sm:text-base text-white/[0.75] leading-relaxed mb-5 line-clamp-5">
          {card.description}
        </p>
        <span className="inline-flex items-center gap-2 font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.12em] text-brand-turquoise">
          {card.linkLabel} →
        </span>
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

/** Per-card hero stack offsets (relative to source anchor). */
const STACK_OFFSETS = [
  { tx: 0.05, ty: 0.04, rot: -4, scale: 0.92, z: 40 },
  { tx: 0.22, ty: -0.02, rot: 6, scale: 0.88, z: 30 },
  { tx: -0.06, ty: 0.1, rot: -8, scale: 0.85, z: 20 },
  { tx: 0.18, ty: 0.12, rot: 10, scale: 0.82, z: 10 },
];

export interface ScrollChoreographedDeckProps {
  cards?: CategoryCard[];
  sourceAnchorId: string;
}

export default function ScrollChoreographedDeck({
  cards = DEFAULT_CATEGORIES,
  sourceAnchorId,
}: ScrollChoreographedDeckProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);
  const [sourceRect, setSourceRect] = useState<Rect | null>(null);
  const [slotRects, setSlotRects] = useState<Array<Rect | null>>([null, null, null, null]);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

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

  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (!sourceRect) return;
    if (slotRects.some((r) => !r)) return;

    let raf = 0;
    const animate = () => {
      raf = 0;
      const scrollY = window.scrollY;
      const srcCenterY = sourceRect.y + sourceRect.h / 2;
      const dstCenterY = (slotRects[0]!.y + slotRects[3]!.y + slotRects[3]!.h) / 2;
      const startScroll = Math.max(0, srcCenterY - window.innerHeight * 0.5);
      const endScroll = Math.max(startScroll + 1, dstCenterY - window.innerHeight * 0.55);
      const raw = (scrollY - startScroll) / (endScroll - startScroll);
      const p = Math.max(0, Math.min(1, raw));
      const t = p * p * (3 - 2 * p);

      for (let i = 0; i < 4; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const slot = slotRects[i]!;
        const off = STACK_OFFSETS[i];

        const srcX = sourceRect.x + off.tx * sourceRect.w;
        const srcY = sourceRect.y + off.ty * sourceRect.h;
        const srcW = sourceRect.w * off.scale;
        const srcH = sourceRect.h * off.scale;

        const docX = srcX + (slot.x - srcX) * t;
        const docY = srcY + (slot.y - srcY) * t;
        const w = srcW + (slot.w - srcW) * t;
        const h = srcH + (slot.h - srcH) * t;
        const rot = off.rot * (1 - t);

        const vx = docX - window.scrollX;
        const vy = docY - scrollY;

        card.style.transform = `translate3d(${vx}px, ${vy}px, 0) rotate(${rot}deg)`;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
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
          {cards.slice(0, 4).map((card, i) => (
            <div
              key={card.title}
              className="relative w-full"
              style={{ aspectRatio: "3 / 5", minHeight: 480 }}
            >
              <div
                ref={(el) => (slotRefs.current[i] = el)}
                className="absolute inset-0"
                aria-hidden="true"
              />
              {useStatic && (
                <Link to={card.link} className="absolute inset-0 block">
                  <CategoryCardVisual card={card} />
                </Link>
              )}
              <div className="absolute inset-0 sm:hidden">
                <Link to={card.link} className="block w-full h-full">
                  <CategoryCardVisual card={card} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!useStatic && (
        <div
          className="hidden sm:block pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
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
                <Link
                  to={card.link}
                  className="block w-full h-full"
                  aria-label={card.title}
                >
                  <CategoryCardVisual card={card} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
