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

/**
 * Compact teaser card (~¼ of previous size) for hero bottom-right.
 * Shows provider, test name, price, and a single View test CTA.
 */
export default function HeroSalesTestCard({ ad }: Props) {
  return (
    <aside
      className="hidden md:flex absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-10
                 w-[clamp(150px,11vw,180px)] flex-col
                 rounded-xl overflow-hidden bg-white
                 border border-[#081129]/10 shadow-[0_10px_30px_rgba(8,17,41,0.30)]
                 animate-fade-in"
      aria-label={`Featured test: ${ad.name} from ${ad.provider}`}
    >
      <div className="h-[3px] w-full" style={{ background: PINK }} />
      <div className="p-2.5">
        <span
          className="block text-[8px] font-semibold tracking-[0.16em] uppercase font-[Montserrat] truncate"
          style={{ color: TURQUOISE }}
        >
          {ad.provider}
        </span>
        <h3
          className="text-[11px] leading-tight font-extrabold tracking-tight mt-0.5 font-[Montserrat] line-clamp-2"
          style={{ color: NAVY }}
        >
          {ad.name}
        </h3>
        <div
          className="text-[16px] font-black font-[Montserrat] leading-none mt-1.5"
          style={{ color: PINK }}
        >
          £{ad.price.toFixed(2)}
        </div>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full py-1.5 rounded-full text-white text-[10px] font-bold tracking-wide text-center font-[Montserrat] hover:opacity-90 transition-opacity"
          style={{ background: PINK }}
        >
          View test
        </a>
      </div>
    </aside>
  );
}
