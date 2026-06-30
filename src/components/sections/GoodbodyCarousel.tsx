import { useEffect, useRef, useState, useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, X, Beaker, Clock, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Kit = {
  name: string;
  accent: string;
  sample: string;
  price: string;
  turnaround: string;
  biomarkers: string;
  collection: string;
  about: string;
};

const KITS: Kit[] = [
  { name: "Bowel Cancer Screening", accent: "#1f55c4", sample: "Stool Test", price: "£69.00", turnaround: "5–7 working days", biomarkers: "qFIT — faecal blood", collection: "At-home stool kit", about: "A simple FIT home test that detects hidden (occult) blood in your stool — an early sign of bowel cancer, polyps and other bowel conditions. Analysed in a UKAS-accredited lab." },
  { name: "HPV Cervical Cancer Screening", accent: "#1f9bd6", sample: "Swab Test", price: "£165.00", turnaround: "3 working days", biomarkers: "24 high-risk HPV types", collection: "At-home swab kit", about: "A simple home swab that screens for 24 high-risk HPV types (including 16 and 18). Around 95% of cervical cancers are caused by HPV, so detection supports earlier follow-up. UKAS-accredited, GP report included." },
  { name: "Advanced Well Woman", accent: "#1e9e5a", sample: "Blood Test", price: "£175.00", turnaround: "3–5 working days", biomarkers: "52 biomarkers", collection: "In-clinic / home nurse", about: "A comprehensive health check for women covering hormones, thyroid, iron, vitamins, cholesterol, liver and kidney function in a single test. GP report included." },
  { name: "Female Hormone & Fertility", accent: "#e0156b", sample: "Blood Test", price: "£79.00", turnaround: "3–5 working days", biomarkers: "7 biomarkers", collection: "At-home / in-clinic", about: "Checks 7 key female hormones that regulate fertility, mood, energy and thyroid function — giving insight into cycle health and hormonal balance. GP report included." },
  { name: "Advanced Well Man", accent: "#2f74d0", sample: "Blood Test", price: "£175.00", turnaround: "3–5 working days", biomarkers: "49 biomarkers", collection: "In-clinic / home nurse", about: "An essential all-round health check for men — organ function, cholesterol, diabetes, hormones, iron and vitamins in one comprehensive test. GP report included." },
  { name: "Prostate PSA", accent: "#1e9e5a", sample: "Blood Test", price: "£69.00", turnaround: "3–5 working days", biomarkers: "PSA", collection: "At-home / in-clinic", about: "Measures prostate-specific antigen (PSA) to support prostate health monitoring and the early detection of potential concerns. GP report included." },
  { name: "Premium Complete", accent: "#e0202a", sample: "Blood Test", price: "£249.00", turnaround: "3–5 working days", biomarkers: "61 biomarkers", collection: "In-clinic / home nurse", about: "Our most comprehensive health check — 61 biomarkers spanning thyroid, kidney, liver, cholesterol, iron, hormones, vitamins, diabetes, muscle and bone health. GP report included." },
  { name: "Early Cancer Screening", accent: "#1e9e5a", sample: "Blood Test", price: "£1,199.00", turnaround: "2–3 weeks", biomarkers: "Up to 70 cancer types", collection: "In-clinic blood draw", about: "TruCheck™ detects circulating tumour cells (CTCs) in the blood to screen for up to 70 solid-organ cancer types and indicate their likely origin. Includes a UK doctor pre-consultation." },
  { name: "Lung Cancer Screening", accent: "#e0202a", sample: "Blood Test", price: "£340.00", turnaround: "14 working days", biomarkers: "EarlyCDT® autoantibodies", collection: "At-home finger-prick", about: "The EarlyCDT® blood test detects autoantibodies linked to lung cancer that can appear before symptoms. 99.3% negative predictive value; no GP referral required." },
  { name: "Sports & Fitness", accent: "#1e9e5a", sample: "Blood Test", price: "£89.00", turnaround: "3–5 working days", biomarkers: "32 biomarkers", collection: "At-home kit", about: "Tracks 32 biomarkers including organ and muscle health, vitamin levels, iron status and full blood count to optimise training, recovery and performance." },
];

const CARD_W = 196;
const CARD_H = 265;
const SPACING = 250;
const RADIUS = 2100;
const AUTO_SPEED = 0.0015; // index per ms
const FRICTION = 0.94;

const CompassRose = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
    <circle cx="32" cy="32" r="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M32 6 L34 32 L32 58 L30 32 Z" fill="rgba(255,255,255,0.9)" />
    <path d="M6 32 L32 30 L58 32 L32 34 Z" fill="rgba(255,255,255,0.75)" />
    <circle cx="32" cy="32" r="2.5" fill="white" />
  </svg>
);

const KitCard = ({ kit, onClick }: { kit: Kit; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative bg-white rounded-3xl overflow-hidden cursor-pointer flex flex-col"
    style={{ width: CARD_W, height: CARD_H, boxShadow: "0 28px 54px -22px rgba(0,0,0,0.5)" }}
  >
    <div className="flex items-center justify-center" style={{ background: kit.accent, height: "40%" }}>
      <CompassRose />
    </div>
    <div className="flex-1 px-4 pt-3 pb-3 flex flex-col">
      <div className="text-[10px] font-extrabold tracking-[0.15em] text-[#081129]">GOODBODY</div>
      <div className="mt-1 font-bold leading-tight text-[14px] line-clamp-2" style={{ color: kit.accent }}>
        {kit.name}
      </div>
      <div className="mt-2">
        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eef4f7] text-[#3a4a5c]">
          {kit.sample}
        </span>
      </div>
      <div className="mt-auto pl-2 italic text-[10px] text-[#6b7280]" style={{ borderLeft: `2px solid ${kit.accent}` }}>
        Know more. Live better.
      </div>
    </div>
  </div>
);

const GoodbodyCarousel = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0); // floating-point index of centre
  const velocityRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const [, force] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // animation loop
  useEffect(() => {
    if (isMobile) return;
    const tick = (t: number) => {
      const dt = lastTimeRef.current ? t - lastTimeRef.current : 16;
      lastTimeRef.current = t;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.00005) {
          positionRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(FRICTION, dt / 16);
        } else if (hoverRef.current === null && selectedIdx === null) {
          positionRef.current += AUTO_SPEED * dt;
        }
      }

      force((n) => (n + 1) % 1000000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [isMobile, selectedIdx]);

  useEffect(() => {
    hoverRef.current = hoverIdx;
  }, [hoverIdx]);

  const step = useCallback((dir: 1 | -1) => {
    velocityRef.current = 0;
    positionRef.current += dir;
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = positionRef.current;
    lastDragXRef.current = e.clientX;
    lastDragTRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    positionRef.current = dragStartPosRef.current - dx / SPACING;
    const now = performance.now();
    const ddx = e.clientX - lastDragXRef.current;
    const ddt = now - lastDragTRef.current;
    if (ddt > 0) {
      // velocity in index units per ms
      velocityRef.current = -ddx / SPACING / ddt;
    }
    lastDragXRef.current = e.clientX;
    lastDragTRef.current = now;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    // amplify a little
    velocityRef.current *= 16;
  };

  // ---------- MOBILE ----------
  if (isMobile) {
    return (
      <div className="relative w-full">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-6 -mx-4 scrollbar-hide">
          {KITS.map((kit, i) => (
            <div key={i} className="snap-start shrink-0" style={{ width: 140 }}>
              <div onClick={() => setSelectedIdx(i)} className="cursor-pointer">
                <div
                  className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
                  style={{ width: 140, height: 190, boxShadow: "0 18px 30px -16px rgba(0,0,0,0.5)" }}
                >
                  <div className="flex items-center justify-center" style={{ background: kit.accent, height: "40%" }}>
                    <CompassRose size={36} />
                  </div>
                  <div className="flex-1 px-3 pt-2 pb-2 flex flex-col">
                    <div className="text-[8px] font-extrabold tracking-[0.15em] text-[#081129]">GOODBODY</div>
                    <div className="mt-0.5 font-bold leading-tight text-[11px] line-clamp-2" style={{ color: kit.accent }}>
                      {kit.name}
                    </div>
                    <div className="mt-auto pl-1.5 italic text-[8px] text-[#6b7280]" style={{ borderLeft: `2px solid ${kit.accent}` }}>
                      Know more. Live better.
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center text-[12px] text-[#cfe9ee]">{kit.name}</div>
              </div>
            </div>
          ))}
        </div>
        <MobileBlurb />
        {selectedIdx !== null && <KitModal kit={KITS[selectedIdx]} onClose={() => setSelectedIdx(null)} />}
      </div>
    );
  }

  // ---------- DESKTOP ----------
  const pos = positionRef.current;
  const centerIdx = ((Math.round(pos) % KITS.length) + KITS.length) % KITS.length;

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        className="relative w-full h-[520px] select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: draggingRef.current ? "grabbing" : "grab" }}
      >
        {/* arrows */}
        <button
          aria-label="Previous"
          onClick={() => step(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          aria-label="Next"
          onClick={() => step(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white"
        >
          <ChevronRight size={22} />
        </button>

        {/* cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: 1, height: 1 }}>
            {KITS.map((kit, i) => {
              // signed shortest distance to centre with wraparound
              let d = i - pos;
              const n = KITS.length;
              d = ((d % n) + n) % n;
              if (d > n / 2) d -= n;

              const absD = Math.abs(d);
              if (absD > 4.2) return null;

              const x = d * SPACING;
              // arc: y dips down as |d| grows: y = R - sqrt(R^2 - x^2)
              const y = RADIUS - Math.sqrt(Math.max(0, RADIUS * RADIUS - x * x));
              const scale = Math.max(0.55, 1 - absD * 0.13);
              const opacity = Math.max(0, 1 - absD * 0.22);
              const isHover = hoverIdx === i;
              const z = 100 - Math.round(absD * 10);

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%)) scale(${isHover ? scale * 1.1 : scale})`,
                    opacity,
                    zIndex: isHover ? 200 : z,
                    transition: "transform 180ms ease, opacity 200ms ease",
                  }}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
                >
                  <div
                    className="rounded-3xl"
                    style={{ outline: isHover ? "2px solid #22C0D4" : "none", outlineOffset: 4, borderRadius: 24 }}
                  >
                    <KitCard kit={kit} onClick={() => setSelectedIdx(i)} />
                  </div>
                  <div
                    className="mt-3 text-center font-medium transition-colors"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 13.5,
                      color: isHover ? "#22C0D4" : "#cfe9ee",
                      width: CARD_W,
                    }}
                  >
                    {kit.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* hover tooltip */}
        {hoverIdx !== null && selectedIdx === null && (
          <HoverTooltip kit={KITS[hoverIdx]} />
        )}

        {/* idle blurb */}
        {hoverIdx === null && selectedIdx === null && <IdleBlurb />}
      </div>

      {selectedIdx !== null && <KitModal kit={KITS[selectedIdx]} onClose={() => setSelectedIdx(null)} />}
    </div>
  );
};

const HoverTooltip = ({ kit }: { kit: Kit }) => (
  <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-40 pointer-events-none animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl p-4 flex gap-4 max-w-[560px]">
      <div
        className="shrink-0 rounded-lg overflow-hidden flex flex-col"
        style={{ width: 60, height: 80, boxShadow: "0 8px 16px -8px rgba(0,0,0,0.3)" }}
      >
        <div style={{ background: kit.accent, height: "40%" }} className="flex items-center justify-center">
          <CompassRose size={20} />
        </div>
        <div className="flex-1 bg-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-bold text-sm truncate" style={{ color: kit.accent }}>{kit.name}</div>
          <div className="font-bold text-lg text-[#081129]">{kit.price}</div>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600">
          <span className="inline-flex items-center gap-1"><Clock size={11} />{kit.turnaround}</span>
          <span className="inline-flex items-center gap-1"><Beaker size={11} />{kit.biomarkers}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={11} />{kit.collection}</span>
        </div>
        <div className="mt-1 text-[11px] text-gray-700 line-clamp-1">{kit.about}</div>
      </div>
    </div>
  </div>
);

const IdleBlurb = () => (
  <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 w-full max-w-2xl px-4 text-center animate-fade-in">
    <p className="italic text-white/85 text-sm sm:text-base">
      High-quality private blood tests & cancer screening — accessible, affordable, convenient.
    </p>
    <p className="mt-1 text-white/65 text-xs sm:text-sm">
      Clinical-grade accuracy with high-street accessibility. Over 60 blood & wellness tests, processed in UKAS-accredited laboratories and reviewed by a GP.
    </p>
    <div className="mt-3 flex items-center justify-center gap-3">
      <Button asChild size="sm" className="bg-gradient-to-r from-brand-turquoise to-brand-pink text-white">
        <Link to="/provider/goodbody-clinic">Explore the range</Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
        <a href="https://goodbodyclinic.com" target="_blank" rel="noopener noreferrer">
          Visit Goodbody <ExternalLink size={12} className="ml-1" />
        </a>
      </Button>
    </div>
  </div>
);

const MobileBlurb = () => (
  <div className="px-4 text-center">
    <p className="italic text-white/85 text-sm">
      High-quality private blood tests & cancer screening — accessible, affordable, convenient.
    </p>
    <p className="mt-1 text-white/65 text-xs">
      Clinical-grade accuracy with high-street accessibility. Over 60 blood & wellness tests, processed in UKAS-accredited laboratories and reviewed by a GP.
    </p>
    <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
      <Button asChild size="sm" className="bg-gradient-to-r from-brand-turquoise to-brand-pink text-white">
        <Link to="/provider/goodbody-clinic">Explore the range</Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
        <a href="https://goodbodyclinic.com" target="_blank" rel="noopener noreferrer">
          Visit Goodbody <ExternalLink size={12} className="ml-1" />
        </a>
      </Button>
    </div>
  </div>
);

const KitModal = ({ kit, onClose }: { kit: Kit; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="text-[11px] font-extrabold tracking-[0.2em] text-[#081129]">GOODBODY</div>
        <h3 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight" style={{ color: kit.accent }}>
          {kit.name}
        </h3>
        <div
          className="mt-3 inline-block px-3 py-1 rounded-full text-white font-bold text-sm"
          style={{ background: kit.accent }}
        >
          {kit.price}
        </div>

        <p className="mt-4 text-sm text-gray-700 leading-relaxed">{kit.about}</p>

        <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
          <Row icon={<Beaker size={16} />} label="Biomarkers" value={kit.biomarkers} />
          <Row icon={<MapPin size={16} />} label="Collection" value={kit.collection} />
          <Row icon={<Clock size={16} />} label="Turnaround" value={kit.turnaround} />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button asChild className="flex-1 bg-gradient-to-r from-brand-turquoise to-brand-pink text-white">
            <a href="https://goodbodyclinic.com" target="_blank" rel="noopener noreferrer">
              View on Goodbody <ExternalLink size={14} className="ml-1" />
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/provider/goodbody-clinic">Explore all tests</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="mt-0.5 text-gray-400">{icon}</div>
    <div className="flex-1">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
      <div className="text-[#081129]">{value}</div>
    </div>
  </div>
);

export default GoodbodyCarousel;
