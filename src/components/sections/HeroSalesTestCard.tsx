import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FlaskConical, Package, Check, Star, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getBranding } from "@/data/providerBranding";

const NAVY = "#081129";
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";

export interface HeroSalesAd {
  category: string;
  name: string;
  price: number;
  provider: string;
  providerLogo: string;
  url: string;
  markers?: string[];
  biomarkerCount?: number;
  rating?: number;
}

interface Props {
  ad: HeroSalesAd;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const DEFAULT_MARKERS = ["Cholesterol", "Vitamin D", "Thyroid", "Liver"];

export default function HeroSalesTestCard({ ad }: Props) {
  const [open, setOpen] = useState(false);
  const brand = getBranding(ad.provider);
  const providerColor = brand?.primary ?? TURQUOISE;

  const markers = (ad.markers && ad.markers.length ? ad.markers : DEFAULT_MARKERS).slice(0, 4);
  const totalMarkers = ad.biomarkerCount ?? 56;
  const extraMarkers = Math.max(0, totalMarkers - markers.length);
  const rating = ad.rating ?? 4.8;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Featured test: ${ad.name} from ${ad.provider}. Click for details.`}
        className="flex absolute right-2 bottom-2 sm:right-5 sm:bottom-5 lg:right-6 lg:bottom-6 z-10
                   w-[min(94vw,140px)] sm:w-[min(92vw,480px)] flex-col text-left
                   rounded-xl sm:rounded-[24px] overflow-hidden bg-[#F5F5F5]
                   border border-white
                   hover:-translate-y-0.5 transition-all animate-fade-in font-[Montserrat]
                   shadow-[0_16px_32px_-12px_rgba(8,17,41,0.35)] sm:shadow-[0_24px_48px_-12px_rgba(8,17,41,0.3)]"
      >
        {/* Top brand gradient */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${TURQUOISE}, ${PINK}, ${TURQUOISE})`,
          }}
          aria-hidden="true"
        />

        <div className="p-2 sm:p-4 lg:p-5 flex-1 flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {ad.providerLogo ? (
                  <img
                    src={ad.providerLogo}
                    alt=""
                    aria-hidden="true"
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.16em] truncate"
                  style={{ color: providerColor }}
                >
                  {ad.provider}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#081129] font-bold text-[10px] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {rating.toFixed(1)}
                  </span>
                  <div className="w-px h-2.5 bg-slate-300" aria-hidden="true" />
                  <span
                    className="text-[8px] font-bold border px-1.5 py-0.5 rounded-full uppercase tracking-tight"
                    style={{ color: TURQUOISE, borderColor: hexToRgba(TURQUOISE, 0.3) }}
                  >
                    UKAS Accredited
                  </span>
                </div>
              </div>
            </div>
            <span
              className="text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-[0.14em] text-white shrink-0"
              style={{
                background: PINK,
                boxShadow: `0 6px 16px ${hexToRgba(PINK, 0.3)}`,
              }}
            >
              Featured
            </span>
          </div>

          {/* Title */}
          <div className="mb-2 sm:mb-3">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
              style={{ color: TURQUOISE }}
            >
              {ad.category}
            </p>
            <h3 className="text-[#081129] text-base sm:text-xl lg:text-[22px] font-extrabold leading-[1.15] line-clamp-2">
              {ad.name}
            </h3>
          </div>

          {/* Biomarker chips — hidden on mobile for compact layout */}
          <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
            {markers.map((m) => (
              <span
                key={m}
                className="bg-white border border-slate-200 text-[#081129]/70 text-[10px] font-bold px-2 py-1 rounded-md font-[Lato]"
              >
                {m}
              </span>
            ))}
            {extraMarkers > 0 && (
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-md font-[Lato]"
                style={{ background: hexToRgba(TURQUOISE, 0.1), color: TURQUOISE }}
              >
                +{extraMarkers} biomarkers
              </span>
            )}
          </div>

          {/* Meta row — hidden on mobile for compact layout */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-5 mb-4">
            <MetaCell icon={ClipboardList} label="Analysis" value="Comprehensive" />
            <MetaCell icon={Clock} label="Results" value="Typical 2–5 days" />
            <MetaCell icon={Package} label="Collection" value="Flexible" />
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-end justify-between border-t border-slate-200/60 pt-2.5 sm:pt-4 gap-2 sm:gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[#081129]/40 text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5">
                from
              </span>
              <span
                className="text-xl sm:text-2xl lg:text-[28px] font-black leading-none"
                style={{ color: PINK }}
              >
                £{ad.price.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              <span
                className="hidden sm:inline-flex px-4 py-2 rounded-xl border-2 text-[#081129] font-bold text-xs"
                style={{ borderColor: hexToRgba(NAVY, 0.12) }}
              >
                Compare
              </span>
              <span
                className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl text-white font-bold text-[11px] sm:text-xs shadow-lg"
                style={{ background: NAVY, boxShadow: `0 10px 20px ${hexToRgba(NAVY, 0.25)}` }}
              >
                View test
              </span>
            </div>
          </div>
        </div>
      </button>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0 bg-white">
          <DialogTitle className="sr-only">{ad.name} — {ad.provider}</DialogTitle>

          <div
            className="p-5 text-white relative border-t-[6px]"
            style={{ background: NAVY, borderTopColor: PINK }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <span
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase font-[Montserrat]"
                  style={{ color: providerColor }}
                >
                  {ad.provider}
                </span>
                <h3 className="text-[18px] leading-tight font-extrabold text-white tracking-tight mt-0.5 font-[Montserrat]">
                  {ad.name}
                </h3>
              </div>
              {ad.providerLogo && (
                <img
                  src={ad.providerLogo}
                  alt={`${ad.provider} logo`}
                  className="h-7 w-auto shrink-0 bg-white rounded-md p-1"
                />
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className="text-[28px] font-black font-[Montserrat] leading-none"
                style={{ color: PINK }}
              >
                £{ad.price.toFixed(2)}
              </span>
              <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider">
                Base price
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
              <Metric icon={Clock} title="Typical 2–5 days" sub="Turnaround" />
              <Metric icon={FlaskConical} title="Full panel" sub="Biomarkers" />
              <Metric icon={Package} title="Flexible" sub="Collection" />
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#081129] mb-1 font-[Montserrat]">
                Additional collection options
              </h4>
              <p className="text-[11px] text-slate-500 mb-3 font-[Lato]">
                Base price covers standard self-collection. Optional upgrades may be available:
              </p>
              <div className="space-y-2.5">
                <OptionRow title="At-home phlebotomist" desc="A trained nurse visits your home" price="from +£80" />
                <OptionRow title="In-clinic blood draw" desc="Visit an accredited partner clinic" price="from +£35" />
                <OptionRow title="Self-collection kit" desc="Standard finger-prick kit posted to you" price="included" last />
              </div>
            </section>

            <section className="pt-3 border-t border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#081129] mb-2 font-[Montserrat]">
                Standards & accreditation
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-medium text-slate-600 font-[Lato]">
                <Badge>UKAS-accredited laboratory</Badge>
                <Badge>CQC-regulated</Badge>
                <Badge>GDPR compliant</Badge>
              </div>
            </section>

            <div
              className="bg-slate-50 border-l-4 p-3 rounded-r-lg"
              style={{ borderLeftColor: TURQUOISE }}
            >
              <p className="text-[10px] leading-relaxed text-slate-500 font-[Lato]">
                myhealth checkup is an independent comparison platform. Please verify scheduling
                and clinical details directly with the chosen provider.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
            <Link
              to="/compare"
              onClick={() => setOpen(false)}
              className="w-full py-2.5 px-3 rounded-full border-2 text-[12px] font-bold tracking-wide bg-white transition-colors text-center font-[Montserrat]"
              style={{ borderColor: TURQUOISE, color: TURQUOISE }}
            >
              + Compare
            </Link>
            <a
              href={ad.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-full text-white text-[12px] font-black tracking-wide shadow-lg transition-all text-center font-[Montserrat] hover:opacity-90"
              style={{ background: NAVY, boxShadow: `0 8px 20px ${NAVY}33` }}
            >
              View test
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: hexToRgba(TURQUOISE, 0.12) }}
        aria-hidden="true"
      >
        <Icon className="w-3 h-3" style={{ color: TURQUOISE }} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] text-[#081129]/40 uppercase font-bold tracking-[0.16em]">
          {label}
        </p>
        <p className="text-[10px] font-bold text-[#081129] font-[Lato] truncate">{value}</p>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof Clock;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: TURQUOISE }} />
      <div className="text-[10px] leading-tight font-[Lato]">
        <b className="block text-white text-[11px] font-[Montserrat]">{title}</b>
        <span className="text-white/60">{sub}</span>
      </div>
    </div>
  );
}

function OptionRow({
  title,
  desc,
  price,
  last,
}: {
  title: string;
  desc: string;
  price: string;
  last?: boolean;
}) {
  return (
    <div className={`flex justify-between items-start gap-3 ${last ? "" : "pb-2.5 border-b border-slate-100"}`}>
      <div className="min-w-0">
        <h5 className="text-[12px] font-bold text-[#081129] font-[Montserrat]">{title}</h5>
        <p className="text-[10px] text-slate-500 mt-0.5 font-[Lato] leading-snug">{desc}</p>
      </div>
      <span
        className="text-[12px] font-bold whitespace-nowrap font-[Montserrat]"
        style={{ color: PINK }}
      >
        {price}
      </span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Check className="w-3 h-3" style={{ color: TURQUOISE }} strokeWidth={3} />
      {children}
    </span>
  );
}
