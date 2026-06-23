"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export type FeaturedKit = {
  img: string;
  name?: string;
  provider?: string;
  price?: string;
  turnaround?: string;
  biomarkers?: string;
  collection?: string;
  about?: string;
};

export type FeaturedPartnerWheelProps = {
  kits?: FeaturedKit[];
  partnerName?: string;
  eyebrow?: string;
  blurbItalic?: string;
  blurb?: string;
  autoRotate?: boolean;
  spinSpeed?: number;
  dragSensitivity?: number;
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
};

const STEP = 30;

const DEFAULT_KITS: FeaturedKit[] = (() => {
  const P = "Goodbody Clinic";
  return [
    { img: "/assets/kit-testosterone.jpeg", name: "Testosterone", provider: P, price: "£59.00", turnaround: "2 working days", biomarkers: "8 biomarkers", collection: "At-home kit", about: "Measures total testosterone alongside key markers to assess energy, libido, mood and overall male hormone health." },
    { img: "/assets/kit-premium-complete.png", name: "Premium Complete", provider: P, price: "£179.00", turnaround: "3 working days", biomarkers: "55 biomarkers", collection: "At-home kit", about: "Our most comprehensive health MOT — hormones, cholesterol, liver, kidney, thyroid, vitamins and inflammation markers in one test." },
    { img: "/assets/kit-sports-fitness.png", name: "Sports & Fitness", provider: P, price: "£89.00", turnaround: "3 working days", biomarkers: "30 biomarkers", collection: "At-home kit", about: "Built for active people — tracks hormones, muscle and recovery markers, iron status and energy to help optimise training and performance." },
    { img: "/assets/kit-cancer-screening.png", name: "Early Cancer Screening", provider: P, price: "£295.00", turnaround: "5 working days", biomarkers: "Multi-cancer panel", collection: "At-home kit", about: "Screens for early signals across multiple cancer types using validated tumour markers, reviewed by a GP for added reassurance." },
    { img: "/assets/kit-prostate-psa.png", name: "Prostate PSA", provider: P, price: "£49.00", turnaround: "2 working days", biomarkers: "2 biomarkers", collection: "At-home kit", about: "Measures total and free PSA to support prostate health monitoring and early detection of potential concerns." },
    { img: "/assets/kit-well-woman.png", name: "Advanced Well Woman", provider: P, price: "£159.00", turnaround: "3 working days", biomarkers: "44 biomarkers", collection: "At-home kit", about: "A full health check for women — hormones, thyroid, iron, vitamins, cholesterol, liver and kidney function in a single at-home test." },
    { img: "/assets/kit-female-hormone.png", name: "Female Hormone & Fertility", provider: P, price: "£99.00", turnaround: "3 working days", biomarkers: "9 biomarkers", collection: "At-home kit", about: "Assesses key reproductive hormones to give insight into fertility, cycle health and hormonal balance." },
    { img: "/assets/kit-vitamins.png", name: "Advanced Vitamins", provider: P, price: "£69.00", turnaround: "3 working days", biomarkers: "6 biomarkers", collection: "At-home kit", about: "Checks essential vitamins and minerals — including Vitamin D, B12 and folate — to identify deficiencies affecting energy and immunity." },
  ];
})();

const norm = (k: FeaturedKit): FeaturedKit => ({
  provider: "Goodbody Clinic",
  price: "",
  turnaround: "",
  biomarkers: "",
  collection: "At-home kit",
  about: "",
  ...k,
});

export default function FeaturedPartnerWheel({
  kits,
  partnerName = "Goodbody Clinics",
  eyebrow = "Featured Partner of the Month",
  blurbItalic = "High-quality private blood tests & cancer screening — accessible, affordable, convenient.",
  blurb = "Clinical-grade accuracy with high-street accessibility. Over 60 blood & wellness tests, processed in UKAS-accredited laboratories and reviewed by a GP.",
  autoRotate = true,
  spinSpeed = 0.002,
  dragSensitivity = 0.1,
  radius = 524,
  cardWidth = 160,
  cardHeight = 202,
}: FeaturedPartnerWheelProps) {
  const unique = (kits && kits.length ? kits : DEFAULT_KITS).map(norm);
  const wheel: FeaturedKit[] = Array.from({ length: 12 }, (_, i) => unique[i % unique.length]);

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selKit, setSelKit] = useState<FeaturedKit | null>(null);

  const anim = useRef({
    rotation: 0,
    target: null as number | null,
    velocity: 0,
    dragging: false,
    lastX: 0,
    downX: 0,
    moved: false,
    downKit: null as FeaturedKit | null,
    idleUntil: 0,
  });
  const live = useRef({ hovered, selKit });
  live.current = { hovered, selKit };

  const apply = () => {
    if (wheelRef.current) wheelRef.current.style.transform = `rotate(${anim.current.rotation}deg)`;
  };

  const step = (dir: number) => {
    const a = anim.current;
    a.idleUntil = performance.now() + 4000;
    a.velocity = 0;
    const base = a.target !== null ? a.target : a.rotation;
    a.target = base + dir * STEP;
  };

  const startDrag = (e: React.PointerEvent, kit: FeaturedKit | null) => {
    const a = anim.current;
    a.dragging = true;
    a.target = null;
    a.velocity = 0;
    a.lastX = e.clientX;
    a.downX = e.clientX;
    a.moved = false;
    a.downKit = kit;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  useEffect(() => {
    apply();
    const a = anim.current;

    const onMove = (e: PointerEvent) => {
      if (!a.dragging) return;
      if (Math.abs(e.clientX - a.downX) > 5) a.moved = true;
      e.preventDefault();
      const dx = e.clientX - a.lastX;
      a.lastX = e.clientX;
      a.rotation += dx * dragSensitivity;
      a.velocity = (dx * dragSensitivity) / 16;
      apply();
    };
    const onUp = () => {
      if (!a.dragging) return;
      a.dragging = false;
      a.idleUntil = performance.now() + 4000;
      if (!a.moved && a.downKit) {
        const k = a.downKit;
        setSelKit((cur) => (cur && cur.name === k.name ? null : k));
      }
      a.downKit = null;
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const st = live.current;
      if (!a.dragging && !st.selKit) {
        if (a.target !== null) {
          const diff = a.target - a.rotation;
          if (Math.abs(diff) < 0.1) {
            a.rotation = a.target;
            a.target = null;
          } else {
            a.rotation += diff * Math.min(1, dt * 0.012);
          }
          apply();
        } else if (Math.abs(a.velocity) > 0.0005) {
          a.rotation += a.velocity * dt;
          a.velocity *= Math.pow(0.95, dt / 16);
          apply();
        } else if (autoRotate && st.hovered == null && now >= a.idleUntil) {
          a.rotation += spinSpeed * dt;
          apply();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [autoRotate, spinSpeed, dragSensitivity]);

  const preview = !selKit && hovered != null ? wheel[hovered] : null;
  const FH = cardHeight + 38;
  const bgOf = (k: FeaturedKit) => `url("${k.img}")`;

  return (
    <div style={{ fontFamily: "'Lato',sans-serif" }}>
      <style>{`@keyframes gbpop{from{transform:translate(-50%,14px)}to{transform:translate(-50%,0)}}@keyframes gbpopc{from{transform:translateY(10px) scale(.985)}to{transform:translateY(0) scale(1)}}.gbstrip::-webkit-scrollbar{height:8px}.gbstrip::-webkit-scrollbar-thumb{background:#cfd8e3;border-radius:99px}`}</style>

      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 860,
          overflow: "hidden",
          padding: "54px 24px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#081129",
        }}
      >
        <h2 style={{ margin: "0", fontFamily: "'Lora',serif", fontWeight: 600, fontSize: 60, lineHeight: 1.04, color: "#f7f7f8", textAlign: "center", letterSpacing: "-.01em" }}>{partnerName}</h2>

        <div style={{ position: "relative", width: 1160, maxWidth: "100%", height: 642, marginTop: 2 }}>
          <div onPointerDown={(e) => startDrag(e, null)} style={{ position: "absolute", inset: 0, zIndex: 0, cursor: "grab", touchAction: "pan-y" }} />

          <div ref={wheelRef} style={{ position: "absolute", left: "50%", top: 644, width: 0, height: 0, willChange: "transform" }}>
            {wheel.map((k, i) => {
              const on = hovered === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => { if (!selKit) setHovered(i); }}
                  onMouseLeave={() => { if (!selKit) setHovered(null); }}
                  onPointerDown={(e) => startDrag(e, k)}
                  style={{ position: "absolute", left: 0, top: 0, width: cardWidth, height: FH, marginLeft: -cardWidth / 2, marginTop: -FH / 2, transform: `rotate(${i * STEP}deg) translateY(${-radius}px)`, transformOrigin: "center center", zIndex: on ? 60 : 1 }}
                >
                  <div style={{ position: "absolute", left: 0, top: 0, width: cardWidth, height: cardHeight, borderRadius: 20, overflow: "hidden", background: "#fff", cursor: "pointer", transition: "transform .28s cubic-bezier(.4,0,.2,1),box-shadow .28s", transform: `scale(${on ? 1.16 : 1})`, transformOrigin: "center bottom", boxShadow: on ? "0 30px 60px -18px rgba(0,0,0,.55),0 0 0 2px #22C0D4" : "0 22px 44px -18px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.12)" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff", backgroundImage: bgOf(k), backgroundSize: "112%", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }} />
                  </div>
                  <div style={{ position: "absolute", left: -16, top: cardHeight + 11, width: cardWidth + 32, textAlign: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12.5, lineHeight: 1.2, letterSpacing: ".01em", color: on ? "#22C0D4" : "#cfe9ee", transition: "color .2s", pointerEvents: "none" }}>{k.name}</div>
                </div>
              );
            })}
          </div>

          <button onClick={() => step(-1)} aria-label="Rotate left" style={{ position: "absolute", left: 0, top: 330, zIndex: 6, width: 54, height: 54, borderRadius: "50%", border: "1px solid #e3e8ee", background: "rgba(255,255,255,0.92)", boxShadow: "0 10px 24px -10px rgba(8,17,41,.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c0d4" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => step(1)} aria-label="Rotate right" style={{ position: "absolute", right: 0, top: 330, zIndex: 6, width: 54, height: 54, borderRadius: "50%", border: "1px solid #e3e8ee", background: "rgba(255,255,255,0.92)", boxShadow: "0 10px 24px -10px rgba(8,17,41,.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c0d4" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          <div style={{ position: "absolute", left: "50%", bottom: 54, transform: "translateX(-50%)", width: 540, maxWidth: "84%", textAlign: "center", zIndex: 4, transition: "opacity .3s ease", opacity: preview ? 0 : 1, pointerEvents: preview ? "none" : "auto" }}>
            <p style={{ margin: 0, fontFamily: "'Lora',serif", fontStyle: "italic", fontWeight: 500, fontSize: 23, lineHeight: 1.4, color: "#f7f7f8" }}>{blurbItalic}</p>
            <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#d1d5db" }}>{blurb}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <Link to="/provider/goodbody-clinic" style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 26px", borderRadius: 999, border: "none", color: "#fff", cursor: "pointer", backgroundColor: "#22c0d4", textDecoration: "none", display: "inline-block" }}>Explore the range</Link>
              <a href="https://goodbodyclinic.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 26px", borderRadius: 999, border: "1px solid #d4dbe4", background: "#fff", color: "#081129", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Visit Goodbody</a>
            </div>
          </div>

          {preview && (
            <div style={{ position: "absolute", left: "50%", bottom: 40, width: 660, maxWidth: "92%", transform: "translateX(-50%)", zIndex: 7, pointerEvents: "none", animation: "gbpop .26s cubic-bezier(.4,0,.2,1) both" }}>
              <div style={{ display: "flex", gap: 22, alignItems: "center", background: "rgba(255,255,255,0.97)", borderRadius: 22, padding: "22px 26px", boxShadow: "0 30px 70px -22px rgba(0,0,0,.7)", border: "1px solid rgba(34,192,212,.25)" }}>
                <div style={{ flex: "none", width: 104, height: 104, borderRadius: 16, backgroundColor: "#f3f7f9", backgroundImage: bgOf(preview), backgroundSize: "90%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#22C0D4" }}>{preview.provider}</div>
                  <div style={{ fontFamily: "'Lora',serif", fontWeight: 600, fontSize: 26, color: "#081129", lineHeight: 1.1, marginTop: 3 }}>{preview.name}</div>
                  <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#5b6678" }}>{preview.about}</p>
                </div>
                <div style={{ flex: "none", textAlign: "right", paddingLeft: 8, borderLeft: "1px solid #eef2f5" }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 26, color: "#081129" }}>{preview.price}</div>
                  <div style={{ fontSize: 12, color: "#8a94a3", marginTop: 2 }}>{preview.biomarkers}</div>
                  <div style={{ marginTop: 12, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: ".04em", color: "#22C0D4", textTransform: "uppercase" }}>Click to view ›</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {selKit && (
        <div onClick={() => setSelKit(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,17,41,.62)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: 560, maxWidth: "100%", background: "#fff", borderRadius: 26, overflow: "hidden", boxShadow: "0 50px 120px -30px rgba(0,0,0,.7)", animation: "gbpopc .3s cubic-bezier(.4,0,.2,1) both" }}>
            <button onClick={() => setSelKit(null)} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, zIndex: 3, width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(8,17,41,.06)", color: "#081129", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div style={{ display: "flex", gap: 26, alignItems: "center", padding: "34px 36px 24px", background: "linear-gradient(180deg,#f4f9fb 0%,#ffffff 100%)" }}>
              <div style={{ flex: "none", width: 150, height: 170, borderRadius: 18, backgroundColor: "#fff", backgroundImage: bgOf(selKit), backgroundSize: "86%", backgroundPosition: "center", backgroundRepeat: "no-repeat", boxShadow: "0 16px 34px -16px rgba(8,17,41,.45),0 0 0 1px rgba(8,17,41,.05)" }} />
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#22C0D4" }}>{selKit.provider}</div>
                <h4 style={{ margin: "4px 0 0", fontFamily: "'Lora',serif", fontWeight: 600, fontSize: 30, color: "#081129", lineHeight: 1.08 }}>{selKit.name}</h4>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 30, color: "#081129" }}>{selKit.price}</span>
                  <span style={{ fontSize: 13, color: "#8a94a3" }}>incl. lab analysis</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 36px 0" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[selKit.biomarkers, selKit.turnaround && `Results in ${selKit.turnaround}`, selKit.collection].filter(Boolean).map((c, i) => (
                  <span key={i} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12, color: "#0b6b78", background: "#e3f4f7", borderRadius: 999, padding: "7px 14px" }}>{c}</span>
                ))}
              </div>
              <p style={{ margin: "18px 0 0", fontSize: 15, lineHeight: 1.65, color: "#4a5563" }}>{selKit.about}</p>
              <div style={{ margin: "20px 0 0", padding: "14px 16px", background: "#f7f9fb", borderRadius: 14, border: "1px dashed #cdd7e0" }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa4b2" }}>Information card</div>
                <div style={{ fontSize: 13, color: "#6b7585", marginTop: 4 }}>Full test details, biomarker list and sample instructions go here.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, padding: "24px 36px 30px" }}>
              <a href="https://goodbodyclinic.com" target="_blank" rel="noopener noreferrer" style={{ flex: 1, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, padding: "15px", borderRadius: 14, background: "#22c0d4", color: "#fff", cursor: "pointer", border: "none", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>Book this test</a>
              <button onClick={() => setSelKit(null)} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, padding: "15px 22px", borderRadius: 14, border: "1px solid #d4dbe4", background: "#fff", color: "#081129", cursor: "pointer" }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StripCard({ kit, onClick, bg }: { kit: FeaturedKit; onClick: () => void; bg: string }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ flex: "none", width: 188, scrollSnapAlign: "start", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transition: "transform .3s cubic-bezier(.34,1.4,.5,1)", transform: h ? "translateY(-12px)" : "none" }}
    >
      <div style={{ position: "relative", width: 188, height: 228, borderRadius: 20, backgroundColor: "#fff", backgroundImage: bg, backgroundSize: "84%", backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "box-shadow .3s,outline-color .2s", outline: "2px solid transparent", outlineOffset: -2, boxShadow: h ? "0 36px 60px -22px rgba(8,17,41,.55)" : "0 14px 30px -16px rgba(8,17,41,.4),0 0 0 1px rgba(8,17,41,.06)", outlineColor: h ? "#22C0D4" : "transparent" }} />
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1b2540", textAlign: "center", lineHeight: 1.25 }}>{kit.name}</div>
    </div>
  );
}
