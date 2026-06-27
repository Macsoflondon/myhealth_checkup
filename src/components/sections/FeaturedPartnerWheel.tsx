"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const COMPARE_HREF_BY_NAME: Record<string, string> = {
  "Bowel Cancer Screening": "/tests/cancer",
  "HPV Cervical Cancer Screening": "/tests/cancer",
  "Early Cancer Screening": "/tests/cancer",
  "Lung Cancer Screening": "/tests/cancer",
  "Prostate PSA": "/tests/cancer",
  "Advanced Well Woman": "/tests/womens-health",
  "Female Hormone & Fertility": "/hormones",
  "Advanced Well Man": "/tests/mens-health",
  "Premium Complete": "/wellness",
  "Sports & Fitness": "/sports-performance",
};
const compareHrefFor = (k: { name: string; compareHref?: string }) =>
  k.compareHref || COMPARE_HREF_BY_NAME[k.name] || "/compare";
const GOODBODY_CATALOG_HREF = "/providers/goodbody-clinic";
const GOODBODY_PROFILE_HREF = "/provider/goodbody-clinic";

/**
 * FeaturedPartnerWheel — Goodbody Clinics
 * ------------------------------------------------------------------
 * The "Featured Partner of the Month" rotating test-kit wheel, on its own
 * (no "Goodbody Range" strip). Drop straight into a Lovable / React + TS app.
 *
 *  • Flat-arc carousel of test-kit cards — gentle auto-drift when idle,
 *    pauses on hover/interaction, drag/swipe + prev/next arrows.
 *  • Each card is a live, data-driven KIT FACE (rendered from the kit's
 *    name / sample type / accent colour) — NOT a baked image. Feed it your
 *    real database rows via the `kits` prop and the faces update in real time.
 *  • HOVER a card → an info preview crossfades in over the partner blurb.
 *  • CLICK a card → full information modal.
 *
 * Fonts: uses Montserrat / Lato / Lora if loaded in your app (the brand
 * stack); falls back to system fonts otherwise. To load them, add to index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Lato:wght@400;700;900&family=Lora:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
 *
 * AUTO-ROTATE SPEED — the `autoDriftSpeed` prop (cards per ms).
 *   0.00009 is the current "very slow" value. Lower = slower. 0 = no drift.
 */

export type FeaturedKit = {
  name: string;
  /** Sample type shown on the face chip, e.g. "Blood Test", "Swab Test". */
  sample?: string;
  /** Hex accent colour for this kit's face + label. */
  accent?: string;
  provider?: string;
  price?: string;
  turnaround?: string;
  biomarkers?: string;
  collection?: string;
  about?: string;
  /** Optional override for the "Compare this test" CTA destination. */
  compareHref?: string;
};

export type FeaturedPartnerWheelProps = {
  /** Your kits. Omit to use the built-in Goodbody set below. */
  kits?: FeaturedKit[];
  partnerName?: string;
  eyebrow?: string;
  blurbItalic?: string;
  blurb?: string;
  /** Continuous gentle auto-rotation when idle. Default true. */
  autoRotate?: boolean;
  /** Auto-drift speed in cards/ms. Default 0.00009 (very slow). 0 = off. */
  autoDriftSpeed?: number;
  /**
   * Optional URL for a screen-blended texture in the face's coloured band
   * (matches the print artwork). Omit for a clean flat-colour band.
   */
  faceTexture?: string;
};

/* ---- geometry (matches the production design) ---- */
const CW = 196;        // card width
const CH = 265;        // card height
const FH = CH + 44;    // full slot height incl. label
const SPACING = 250;   // px between adjacent card centres
const RCURVE = 2100;   // arc curvature (large => flat, gentle drop)
const TILT = 1;        // tangent-tilt factor
const FADE0 = 545;     // |x| where cards start to fade
const FADE1 = 920;     // |x| where cards are fully faded

const HEAD = "'Montserrat', sans-serif";
const BODY = "'Lato', sans-serif";
const SERIF = "'Lora', serif";

const DEFAULT_KITS: FeaturedKit[] = (() => {
  const P = "Goodbody Clinic";
  return [
    { name: "Bowel Cancer Screening", accent: "#1f55c4", sample: "Stool Test", provider: P, price: "£69.00", turnaround: "5–7 working days", biomarkers: "qFIT — faecal blood", collection: "At-home stool kit", about: "A simple FIT home test that detects hidden (occult) blood in your stool — an early sign of bowel cancer, polyps and other bowel conditions. Analysed in a UKAS-accredited lab." },
    { name: "HPV Cervical Cancer Screening", accent: "#1f9bd6", sample: "Swab Test", provider: P, price: "£165.00", turnaround: "3 working days", biomarkers: "24 high-risk HPV types", collection: "At-home swab kit", about: "A simple home swab that screens for 24 high-risk HPV types (including 16 and 18). Around 95% of cervical cancers are caused by HPV, so detection supports earlier follow-up. UKAS-accredited, GP report included." },
    { name: "Advanced Well Woman", accent: "#1e9e5a", sample: "Blood Test", provider: P, price: "£175.00", turnaround: "3–5 working days", biomarkers: "52 biomarkers", collection: "In-clinic / home nurse", about: "A comprehensive health check for women covering hormones, thyroid, iron, vitamins, cholesterol, liver and kidney function in a single test. GP report included." },
    { name: "Female Hormone & Fertility", accent: "#e0156b", sample: "Blood Test", provider: P, price: "£79.00", turnaround: "3–5 working days", biomarkers: "7 biomarkers", collection: "At-home / in-clinic", about: "Checks 7 key female hormones that regulate fertility, mood, energy and thyroid function — giving insight into cycle health and hormonal balance. GP report included." },
    { name: "Advanced Well Man", accent: "#2f74d0", sample: "Blood Test", provider: P, price: "£175.00", turnaround: "3–5 working days", biomarkers: "49 biomarkers", collection: "In-clinic / home nurse", about: "An essential all-round health check for men — organ function, cholesterol, diabetes, hormones, iron and vitamins in one comprehensive test. GP report included." },
    { name: "Prostate PSA", accent: "#1e9e5a", sample: "Blood Test", provider: P, price: "£69.00", turnaround: "3–5 working days", biomarkers: "PSA", collection: "At-home / in-clinic", about: "Measures prostate-specific antigen (PSA) to support prostate health monitoring and the early detection of potential concerns. GP report included." },
    { name: "Premium Complete", accent: "#e0202a", sample: "Blood Test", provider: P, price: "£249.00", turnaround: "3–5 working days", biomarkers: "61 biomarkers", collection: "In-clinic / home nurse", about: "Our most comprehensive health check — 61 biomarkers spanning thyroid, kidney, liver, cholesterol, iron, hormones, vitamins, diabetes, muscle and bone health. GP report included." },
    { name: "Early Cancer Screening", accent: "#1e9e5a", sample: "Blood Test", provider: P, price: "£1,199.00", turnaround: "2–3 weeks", biomarkers: "Up to 70 cancer types", collection: "In-clinic blood draw", about: "TruCheck™ detects circulating tumour cells (CTCs) in the blood to screen for up to 70 solid-organ cancer types and indicate their likely origin. Includes a UK doctor pre-consultation." },
    { name: "Lung Cancer Screening", accent: "#e0202a", sample: "Blood Test", provider: P, price: "£340.00", turnaround: "14 working days", biomarkers: "EarlyCDT® autoantibodies", collection: "At-home finger-prick", about: "The EarlyCDT® blood test detects autoantibodies linked to lung cancer that can appear before symptoms. 99.3% negative predictive value; no GP referral required." },
    { name: "Sports & Fitness", accent: "#1e9e5a", sample: "Blood Test", provider: P, price: "£89.00", turnaround: "3–5 working days", biomarkers: "32 biomarkers", collection: "At-home kit", about: "Tracks 32 biomarkers including organ and muscle health, vitamin levels, iron status and full blood count to optimise training, recovery and performance." },
  ];
})();

const norm = (k: FeaturedKit): Required<Pick<FeaturedKit, "name">> & FeaturedKit => ({
  provider: "Goodbody Clinic",
  price: "",
  turnaround: "",
  biomarkers: "",
  collection: "At-home kit",
  about: "",
  accent: "#1e9e5a",
  sample: "Blood Test",
  ...k,
});

/* ============================================================= *
 *  KitFace — the live, data-driven product-box face.            *
 *  Pure presentational; scales to its container via cqw units.  *
 * ============================================================= */
function KitFace({ name, sample, accent = "#1e9e5a", texture }: { name: string; sample: string; accent?: string; texture?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "100%", background: "#fff", display: "flex", flexDirection: "column", containerType: "size", overflow: "hidden", fontFamily: BODY } as React.CSSProperties}>
      {/* coloured band (+ optional screen-blended texture) */}
      <div style={{ position: "relative", flex: "0 0 45%", background: accent, isolation: "isolate", overflow: "hidden" }}>
        {texture ? (
          <img src={texture} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", filter: "grayscale(1) contrast(1.05)" }} />
        ) : null}
      </div>
      {/* lower content */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: "5%", padding: "7% 7% 7.5%" }}>
        {/* left rail: mark + GOODBODY */}
        <div style={{ flex: "0 0 30%", display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #eef1f5" }}>
          <div style={{ flex: 0.82, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "3.3cqw" } as React.CSSProperties}>
            <svg viewBox="0 0 48 48" style={{ width: "36%", minWidth: 13, height: "auto" }} fill="none" stroke="#0e1b3d" strokeWidth={1.5} strokeLinecap="round">
              <line x1="24" y1="6" x2="24" y2="42" />
              <line x1="6" y1="24" x2="42" y2="24" />
              <line x1="11.3" y1="11.3" x2="36.7" y2="36.7" />
              <line x1="36.7" y1="11.3" x2="11.3" y2="36.7" />
              <line x1="24" y1="9" x2="24" y2="9.5" />
            </svg>
          </div>
          <div style={{ flex: 1.18, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "1.5cqw" } as React.CSSProperties}>
            <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: "3.4cqw", letterSpacing: ".16em", color: "#0e1b3d", textAlign: "center", whiteSpace: "nowrap" } as React.CSSProperties}>GOODBODY</div>
          </div>
        </div>
        {/* right: name, sample chip, skeleton, tagline */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 0.82, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "3.3cqw", overflow: "hidden" } as React.CSSProperties}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: "6.3cqw", lineHeight: 1.05, letterSpacing: "-.01em", color: accent, textWrap: "balance" } as React.CSSProperties}>{name}</div>
          </div>
          <div style={{ flex: 1.18, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3cqw" } as React.CSSProperties}>
            <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 700, fontSize: "3.6cqw", letterSpacing: ".03em", color: "#fff", background: "#0e1b3d", borderRadius: ".5em", padding: ".42em .9em" } as React.CSSProperties}>{sample}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6cqw", width: "100%" } as React.CSSProperties}>
              <span style={{ height: "1.4cqw", width: "84%", background: "#e7ebf0", borderRadius: 99, display: "block" } as React.CSSProperties} />
              <span style={{ height: "1.4cqw", width: "62%", background: "#e7ebf0", borderRadius: 99, display: "block" } as React.CSSProperties} />
            </div>
            <div style={{ borderLeft: `0.9cqw solid ${accent}`, paddingLeft: "3.5%", fontFamily: BODY, fontWeight: 900, fontSize: "5.4cqw", lineHeight: 1.18, color: "#0e1b3d", whiteSpace: "nowrap" } as React.CSSProperties}>
              Know more.<br />Live better.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= *
 *  FeaturedPartnerWheel                                          *
 * ============================================================= */
export default function FeaturedPartnerWheel({
  kits,
  partnerName = "Goodbody Clinics",
  eyebrow = "Featured Partner of the Month",
  blurbItalic = "High-quality private blood tests & cancer screening — accessible, affordable, convenient.",
  blurb = "Clinical-grade accuracy with high-street accessibility. Over 60 blood & wellness tests, processed in UKAS-accredited laboratories and reviewed by a GP.",
  autoRotate = true,
  autoDriftSpeed = 0.00009,
  faceTexture,
}: FeaturedPartnerWheelProps) {
  // each kit rendered exactly once around the wheel — no duplicates
  const wheel = (kits && kits.length ? kits : DEFAULT_KITS).map(norm);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selKit, setSelKit] = useState<FeaturedKit | null>(null);

  // imperative rotation state (kept out of React so spinning never re-renders)
  const a = useRef({
    pos: 0,
    target: null as number | null,
    vel: 0,
    idleUntil: 0,
    dragging: false,
    lastX: 0,
    downX: 0,
    moved: false,
    downKit: null as FeaturedKit | null,
  });
  // latest reactive state, readable inside the rAF loop
  const live = useRef({ hovered, selKit, autoRotate, autoDriftSpeed });
  live.current = { hovered, selKit, autoRotate, autoDriftSpeed };

  const apply = () => {
    const N = wheel.length;
    const hv = live.current.selKit ? null : live.current.hovered;
    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      let rel = i - a.current.pos;
      rel = ((rel % N) + N) % N;
      if (rel > N / 2) rel -= N;
      const x = rel * SPACING;
      const y = (x * x) / (2 * RCURVE);
      const tilt = (Math.atan(x / RCURVE) * 180) / Math.PI * TILT;
      const ax = Math.abs(x);
      const sc = Math.max(0.8, 1 - ax * 0.00022) * (hv === i ? 1.1 : 1);
      let op = 1;
      if (ax > FADE0) op = Math.max(0, 1 - (ax - FADE0) / (FADE1 - FADE0));
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${tilt.toFixed(3)}deg) scale(${sc.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = String(2000 - Math.round(ax) + (hv === i ? 9000 : 0));
      el.style.pointerEvents = op > 0.15 ? "auto" : "none";
    }
  };

  const step = (dir: number) => {
    a.current.idleUntil = performance.now() + 4000;
    a.current.vel = 0;
    const base = a.current.target !== null ? a.current.target : a.current.pos;
    a.current.target = base + dir;
  };

  const startDrag = (e: React.PointerEvent, kit: FeaturedKit | null) => {
    a.current.dragging = true;
    a.current.target = null;
    a.current.vel = 0;
    a.current.lastX = e.clientX;
    a.current.downX = e.clientX;
    a.current.moved = false;
    a.current.downKit = kit;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  useEffect(() => {
    apply();
    const st = a.current;

    const onMove = (e: PointerEvent) => {
      if (!st.dragging) return;
      if (Math.abs(e.clientX - st.downX) > 5) st.moved = true;
      if (e.cancelable) e.preventDefault();
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      const dPos = -dx * 0.0042;
      st.pos += dPos;
      st.vel = dPos / 16;
    };
    const onUp = () => {
      if (!st.dragging) return;
      st.dragging = false;
      st.idleUntil = performance.now() + 4000;
      if (!st.moved && st.downKit) {
        const k = st.downKit;
        setSelKit((cur) => (cur && cur.name === k.name ? null : k));
        setHovered(null);
      }
      st.downKit = null;
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      tick(dt, now);
      apply();
      raf = requestAnimationFrame(loop);
    };
    const tick = (dt: number, now: number) => {
      if (st.dragging) return;
      if (live.current.selKit) return; // frozen while modal open
      if (st.target !== null) {
        const diff = st.target - st.pos;
        if (Math.abs(diff) < 0.001) {
          st.pos = st.target;
          st.target = null;
        } else st.pos += diff * Math.min(1, dt * 0.01);
        return;
      }
      if (Math.abs(st.vel) > 1e-6) {
        st.pos += st.vel * dt;
        st.vel *= Math.pow(0.94, dt / 16);
        if (Math.abs(st.vel) < 1e-5) st.vel = 0;
        return;
      }
      if (live.current.autoRotate === false) return;
      if (live.current.hovered != null) return; // pause drift on hover preview
      if (now < st.idleUntil) return;
      st.pos += live.current.autoDriftSpeed * dt; // gentle auto drift
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheel.length]);

  const preview = !selKit && hovered != null ? wheel[hovered] : null;

  return (
    <div style={{ fontFamily: BODY }}>
      <style>{`@keyframes gbpop{from{transform:translate(-50%,14px)}to{transform:translate(-50%,0)}}@keyframes gbpopc{from{transform:translateY(10px) scale(.985)}to{transform:translateY(0) scale(1)}}`}</style>

      <section style={{ position: "relative", width: "100%", minHeight: 860, overflow: "hidden", padding: "54px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#081129" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ width: 34, height: 2, background: "#E70D69", display: "block", borderRadius: 2 }} />
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 20, letterSpacing: ".2em", textTransform: "uppercase", color: "#22C0D4" }}>{eyebrow}</span>
          <span style={{ width: 34, height: 2, background: "#E70D69", display: "block", borderRadius: 2 }} />
        </div>

        <h2 style={{ margin: "22px 0 0", fontFamily: SERIF, fontWeight: 600, fontSize: 60, lineHeight: 1.04, color: "#f7f7f8", textAlign: "center", letterSpacing: "-.01em" }}>{partnerName}</h2>

        <div style={{ position: "relative", width: 1160, maxWidth: "100%", height: 642, marginTop: 2 }}>
          {/* drag-capture backdrop */}
          <div onPointerDown={(e) => startDrag(e, null)} style={{ position: "absolute", inset: 0, zIndex: 0, cursor: "grab", touchAction: "pan-y" }} />

          {/* wheel */}
          <div style={{ position: "absolute", left: "50%", top: 210, width: 0, height: 0 }}>
            {wheel.map((k, i) => {
              const on = hovered === i;
              return (
                <div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  onMouseEnter={() => { if (!selKit) setHovered(i); }}
                  onMouseLeave={() => { if (!selKit) setHovered(null); }}
                  onPointerDown={(e) => startDrag(e, k)}
                  style={{ position: "absolute", left: 0, top: 0, width: CW, height: FH, marginLeft: -CW / 2, marginTop: -FH / 2, transformOrigin: "center center", willChange: "transform, opacity", backfaceVisibility: "hidden", opacity: 0 }}
                >
                  <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 24, overflow: "hidden", background: "#fff", cursor: "pointer", transition: "box-shadow .28s", boxShadow: on ? "0 38px 72px -20px rgba(0,0,0,.6),0 0 0 2px #22C0D4" : "0 28px 54px -22px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.10)" }}>
                    <KitFace name={k.name} sample={k.sample!} accent={k.accent} texture={faceTexture} />
                  </div>
                  <div style={{ position: "absolute", left: -22, top: CH + 14, width: CW + 44, textAlign: "center", fontFamily: HEAD, fontWeight: 600, fontSize: 13.5, lineHeight: 1.2, letterSpacing: ".01em", color: on ? "#22C0D4" : "#cfe9ee", transition: "color .2s", pointerEvents: "none" }}>{k.name}</div>
                </div>
              );
            })}
          </div>

          {/* arrows */}
          <NavButton side="left" onClick={() => step(-1)} />
          <NavButton side="right" onClick={() => step(1)} />

          {/* partner blurb (crossfades out while previewing) */}
          <div style={{ position: "absolute", left: "50%", bottom: 54, transform: "translateX(-50%)", width: 540, maxWidth: "84%", textAlign: "center", zIndex: 4, transition: "opacity .3s ease", opacity: preview ? 0 : 1, pointerEvents: preview ? "none" : "auto" }}>
            <p style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 23, lineHeight: 1.4, color: "#f7f7f8" }}>{blurbItalic}</p>
            <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#d1d5db" }}>{blurb}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <Link to={GOODBODY_CATALOG_HREF} style={{ display: "inline-block", textDecoration: "none", fontFamily: HEAD, fontWeight: 700, fontSize: 14, padding: "13px 26px", borderRadius: 999, border: "none", color: "#fff", cursor: "pointer", boxShadow: "0 10px 24px -10px rgba(8,17,41,.5)", backgroundColor: "#22c0d4" }}>Explore the range</Link>
              <Link to={GOODBODY_PROFILE_HREF} style={{ display: "inline-block", textDecoration: "none", fontFamily: HEAD, fontWeight: 700, fontSize: 14, padding: "13px 26px", borderRadius: 999, border: "1px solid #d4dbe4", background: "#fff", color: "#081129", cursor: "pointer" }}>Visit Goodbody</Link>
            </div>
          </div>

          {/* hover preview */}
          {preview && (
            <div style={{ position: "absolute", left: "50%", bottom: 40, width: 660, maxWidth: "92%", transform: "translateX(-50%)", zIndex: 7, pointerEvents: "none", animation: "gbpop .26s cubic-bezier(.4,0,.2,1) both" }}>
              <div style={{ display: "flex", gap: 22, alignItems: "center", background: "rgba(255,255,255,0.97)", borderRadius: 22, padding: "22px 26px", boxShadow: "0 30px 70px -22px rgba(0,0,0,.7)", border: "1px solid rgba(34,192,212,.25)" }}>
                <div style={{ flex: "none", width: 88, height: 119, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 20px -10px rgba(8,17,41,.45)" }}>
                  <KitFace name={preview.name} sample={preview.sample!} accent={preview.accent} texture={faceTexture} />
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#22C0D4" }}>{preview.provider}</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 26, color: "#081129", lineHeight: 1.1, marginTop: 3 }}>{preview.name}</div>
                  <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#5b6678" }}>{preview.about}</p>
                </div>
                <div style={{ flex: "none", textAlign: "right", paddingLeft: 8, borderLeft: "1px solid #eef2f5" }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 26, color: "#081129" }}>{preview.price}</div>
                  <div style={{ fontSize: 12, color: "#8a94a3", marginTop: 2 }}>{preview.biomarkers}</div>
                  <div style={{ marginTop: 12, fontFamily: HEAD, fontWeight: 700, fontSize: 12, letterSpacing: ".04em", color: "#22C0D4", textTransform: "uppercase" }}>Click to view ›</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* info modal */}
      {selKit && (
        <div onClick={() => { setSelKit(null); setHovered(null); }} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,17,41,.62)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: 560, maxWidth: "100%", background: "#fff", borderRadius: 26, overflow: "hidden", boxShadow: "0 50px 120px -30px rgba(0,0,0,.7)", animation: "gbpopc .3s cubic-bezier(.4,0,.2,1) both" }}>
            <button onClick={() => { setSelKit(null); setHovered(null); }} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, zIndex: 3, width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(8,17,41,.06)", color: "#081129", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div style={{ display: "flex", gap: 26, alignItems: "center", padding: "34px 36px 24px", background: "linear-gradient(180deg,#f4f9fb 0%,#ffffff 100%)" }}>
              <div style={{ flex: "none", width: 140, height: 189, borderRadius: 18, overflow: "hidden", boxShadow: "0 16px 34px -16px rgba(8,17,41,.45),0 0 0 1px rgba(8,17,41,.05)" }}>
                <KitFace name={selKit.name} sample={selKit.sample!} accent={selKit.accent} texture={faceTexture} />
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#22C0D4" }}>{selKit.provider}</div>
                <h4 style={{ margin: "4px 0 0", fontFamily: SERIF, fontWeight: 600, fontSize: 30, color: "#081129", lineHeight: 1.08 }}>{selKit.name}</h4>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
                  <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: "#081129" }}>{selKit.price}</span>
                  <span style={{ fontSize: 13, color: "#8a94a3" }}>incl. lab analysis</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 36px 0" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[selKit.biomarkers, selKit.turnaround ? `Results in ${selKit.turnaround}` : "", selKit.collection].filter(Boolean).map((c, i) => (
                  <span key={i} style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 12, color: "#0b6b78", background: "#e3f4f7", borderRadius: 999, padding: "7px 14px" }}>{c}</span>
                ))}
              </div>
              <p style={{ margin: "18px 0 0", fontSize: 15, lineHeight: 1.65, color: "#4a5563" }}>{selKit.about}</p>
              <div style={{ margin: "20px 0 0", padding: "14px 16px", background: "#f7f9fb", borderRadius: 14, border: "1px dashed #cdd7e0" }}>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa4b2" }}>How it works</div>
                <div style={{ fontSize: 13, color: "#6b7585", marginTop: 4 }}>Take your sample at home or in one of 200+ UK clinics, return it in the pre-paid envelope, and receive a clear, GP-reviewed report. All samples are processed in UKAS-accredited laboratories.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, padding: "24px 36px 30px" }}>
              <button style={{ flex: 1, fontFamily: HEAD, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 14, border: "none", background: "#22c0d4", color: "#fff", cursor: "pointer", boxShadow: "0 12px 26px -12px rgba(34,192,212,.8)" }}>Book this test</button>
              <button onClick={() => { setSelKit(null); setHovered(null); }} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, padding: "15px 22px", borderRadius: 14, border: "1px solid #d4dbe4", background: "#fff", color: "#081129", cursor: "pointer" }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Rotate left" : "Rotate right"}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "absolute", [side]: 0, top: 330, zIndex: 6, width: 54, height: 54, borderRadius: "50%", border: `1px solid ${h ? "#22c0d4" : "#e3e8ee"}`, background: h ? "#22c0d4" : "rgba(255,255,255,0.92)", boxShadow: "0 10px 24px -10px rgba(8,17,41,.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: h ? "#fff" : "#22c0d4" } as React.CSSProperties}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={side === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
      </svg>
    </button>
  );
}
