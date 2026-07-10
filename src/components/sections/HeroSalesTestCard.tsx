import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FlaskConical, Package, Check } from "lucide-react";
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

export default function HeroSalesTestCard({ ad }: Props) {
  const [open, setOpen] = useState(false);
  const brand = getBranding(ad.provider);
  const providerColor = brand?.primary ?? TURQUOISE;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Featured test: ${ad.name} from ${ad.provider}. Click for details.`}
        className="hidden md:flex absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-10
                   w-[210px] h-[120px] flex-col text-left
                   rounded-2xl overflow-hidden bg-white
                   border border-slate-100
                   hover:-translate-y-0.5 transition-all animate-fade-in font-[Montserrat]"
        style={{
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-[3px] z-10"
          style={{
            background: providerColor,
            boxShadow: `0 2px 10px ${hexToRgba(providerColor, 0.3)}`,
          }}
        />
        <div
          className="absolute left-4 top-7 w-1 h-5 rounded-full z-10"
          style={{ background: hexToRgba(providerColor, 0.2) }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(${providerColor} 0.5px, transparent 0.5px)`,
            backgroundSize: "8px 8px",
          }}
        />

        <div className="flex-1 flex flex-col p-4 relative">
          <span
            className="text-[8px] uppercase tracking-[0.25em] font-bold mb-1 truncate"
            style={{ color: providerColor }}
          >
            {ad.provider}
          </span>
          <h3
            className="text-[14px] font-extrabold leading-tight line-clamp-1"
            style={{ color: "#0f172a" }}
          >
            {ad.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-1">
            <div className="flex flex-col leading-none">
              <span
                className="text-[9px] uppercase tracking-wider font-bold mb-0.5"
                style={{ color: providerColor }}
              >
                from
              </span>
              <div
                className="text-[16px] font-black leading-none"
                style={{ color: "#0f172a" }}
              >
                £{ad.price.toFixed(2)}
              </div>
            </div>

            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-2"
              style={{
                color: "#081129",
                textDecorationColor: providerColor,
              }}
            >
              View Details
            </span>
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
