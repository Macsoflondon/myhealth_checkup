import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FlaskConical, Package, Check, Star, ClipboardList, Brain } from "lucide-react";
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
  biomarkerCount?: number | null;
  turnaround?: string | null;
  rating?: number;
  clinicalReviewType?: string | null;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatTEC(price: number): string {
  return price % 1 === 0 ? `£${price}` : `£${price.toFixed(2)}`;
}

export default function HeroSalesTestCard({ ad }: { ad: HeroSalesAd }) {
  const [open, setOpen] = useState(false);
  const brand = getBranding(ad.provider);
  const providerColor = brand?.primary ?? TURQUOISE;
  const markers = (ad.markers ?? []).slice(0, 4);
  const biomarkerCount = ad.biomarkerCount ?? null;
  const extraMarkers = biomarkerCount !== null && biomarkerCount > markers.length ? biomarkerCount - markers.length : 0;
  const hasChipRow = markers.length > 0 || biomarkerCount !== null;
  const rating = ad.rating ?? 4.8;
  const hasClinicalBrain = Boolean(ad.clinicalReviewType);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex absolute right-2 bottom-2 sm:right-5 sm:bottom-5 lg:right-6 lg:bottom-6 z-10 w-[min(94vw,140px)] sm:w-[min(92vw,480px)] flex-col text-left rounded-xl sm:rounded-[24px] overflow-hidden bg-[#F5F5F5] border border-white hover:-translate-y-0.5 transition-all animate-fade-in font-[Montserrat] shadow-[0_16px_32px_-12px_rgba(8,17,41,0.35)] sm:shadow-[0_24px_48px_-12px_rgba(8,17,41,0.3)]"
      >
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${TURQUOISE}, ${PINK}, ${TURQUOISE})` }} />
        <div className="p-2 sm:p-4 lg:p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {ad.providerLogo && <img src={ad.providerLogo} alt="" className="max-w-[80%] max-h-[80%] object-contain" />}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] truncate" style={{ color: providerColor }}>{ad.provider}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#081129] font-bold text-[10px] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{rating.toFixed(1)}
                  </span>
                  <div className="w-px h-2.5 bg-slate-300" />
                  <span className="text-[8px] font-bold border px-1.5 py-0.5 rounded-full uppercase tracking-tight" style={{ color: TURQUOISE, borderColor: hexToRgba(TURQUOISE, 0.3) }}>UKAS Accredited</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {hasClinicalBrain && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[7px] sm:text-[8px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-tight border" style={{ color: "#7c3aed", borderColor: hexToRgba("#7c3aed", 0.3), background: hexToRgba("#7c3aed", 0.06) }}>
                  <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden lg:inline">Clinical Brain</span>
                </span>
              )}
              <span className="text-[7px] sm:text-[9px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-[0.14em] text-white" style={{ background: PINK, boxShadow: `0 6px 16px ${hexToRgba(PINK, 0.3)}` }}>Featured</span>
            </div>
          </div>
          <div className="mb-2 sm:mb-3">
            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: TURQUOISE }}>{ad.category.replace(/-/g, " ")}</p>
            <h3 className="text-[#081129] text-[11px] sm:text-xl lg:text-[22px] font-extrabold leading-[1.15] line-clamp-2">{ad.name}</h3>
          </div>
          {hasChipRow && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
              {markers.map((m) => (
                <span key={m} className="bg-white border border-slate-200 text-[#081129]/70 text-[10px] font-bold px-2 py-1 rounded-md font-[Lato]">{m}</span>
              ))}
              {markers.length > 0 && extraMarkers > 0 && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-md font-[Lato]" style={{ background: hexToRgba(TURQUOISE, 0.1), color: TURQUOISE }}>+{extraMarkers} biomarkers</span>
              )}
            </div>
          )}
          <div className="mt-auto flex items-end justify-between border-t border-slate-200/60 pt-2 sm:pt-4 gap-2 sm:gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[#081129]/40 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5">TEC</span>
              <span className="text-sm sm:text-2xl lg:text-[28px] font-black leading-none" style={{ color: PINK }}>{formatTEC(ad.price)}</span>
            </div>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              <span className="px-2 py-1 sm:px-5 sm:py-2 rounded-md sm:rounded-xl text-white font-bold text-[9px] sm:text-xs shadow-lg" style={{ background: NAVY, boxShadow: `0 10px 20px ${hexToRgba(NAVY, 0.25)}` }}>View test</span>
            </div>
          </div>
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0 bg-white">
          <DialogTitle className="sr-only">{ad.name} — {ad.provider}</DialogTitle>
          <div className="p-5 text-white relative border-t-[6px]" style={{ background: NAVY, borderTopColor: PINK }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase font-[Montserrat]" style={{ color: providerColor }}>{ad.provider}</span>
                <h3 className="text-[18px] leading-tight font-extrabold text-white tracking-tight mt-0.5 font-[Montserrat]">{ad.name}</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black font-[Montserrat] leading-none" style={{ color: PINK }}>{formatTEC(ad.price)}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
            <a href={ad.url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 px-3 rounded-full text-white text-[12px] font-black tracking-wide shadow-lg transition-all text-center font-[Montserrat] hover:opacity-90" style={{ background: NAVY }}>View test</a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
