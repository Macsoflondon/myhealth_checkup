import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Star, Heart, UserCheck, User, Dumbbell, Baby, ShieldCheck, Home, MoreHorizontal, Menu, X } from "lucide-react";
import { primaryNavigationItems, moreNavigationSections } from "@/components/header/NavigationItems";
import { MoreDropdownMenu } from "@/components/header/MoreDropdownMenu";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
const PINK = "#e70d69";
const TURQUOISE = "#22c0d4";
const ICONS: Record<string, { Icon: any; color: string }> = {
  "Most Popular Tests": { Icon: Star, color: PINK },
  "General Wellness": { Icon: Heart, color: TURQUOISE },
  "Women's Health": { Icon: UserCheck, color: PINK },
  "Men's Health": { Icon: User, color: "#3a5f85" },
  "Sports & Fitness": { Icon: Dumbbell, color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby, color: "#e70d69" },
  "Cancer Screening": { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home": { Icon: Home, color: "#f59e0b" },
};
export default function BrowseByCategoryBar({ variant = "card", compact = false, placement = "card", className = "" }: { variant?: "card" | "flush"; compact?: boolean; placement?: "card" | "hero"; className?: string; } = {}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setStuck(entry.intersectionRatio < 1 && entry.boundingClientRect.top < 0), { threshold: [1] });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [moreOpen]);
  const items = primaryNavigationItems.filter((i) => i.name !== "How It Works");
  const isFlush = variant === "flush";
  const wrapperClass = placement === "hero" ? "mt-0 mx-0" : compact ? "mt-0 mx-0" : isFlush ? "mt-4 mx-4 sm:mx-8 md:mx-14 lg:mx-16" : "mt-6 mx-4 sm:mx-8 md:mx-14 lg:mx-16";
  let innerClass = isFlush || stuck ? "rounded-[22px] bg-[#f7f7f8]/95 backdrop-blur-md border border-[#081129]/[0.08] shadow-[0_12px_30px_rgba(8,17,41,0.12)]" : "rounded-t-[22px] rounded-b-none bg-[#f7f7f8] border border-b-0 border-[#081129]/[0.06]";
  if (compact && !stuck && !isFlush) { innerClass = "rounded-none bg-[#F5F5F5] border-x border-[#081129]/[0.06]"; }
  if (className) { innerClass = `${innerClass} ${className}`; }
  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <div className="md:hidden sticky top-0 z-50" data-testid="browse-by-category-bar-mobile">
        <div data-scrolled={scrolled} className={`px-4 h-20 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b ${scrolled ? "bg-[#081129] border-[#081129] shadow-[0_2px_10px_rgba(8,17,41,0.18)]" : "bg-white border-[#081129]/10"}`}>
          <Link to="/" className="flex items-center h-10 no-underline font-[Montserrat] font-extrabold tracking-tight text-[30px] leading-none"><span className={`transition-colors duration-300 ease-out ${scrolled ? "text-white" : "text-[#081129]"}`}>myhealth</span><span className="text-[#e70d69]">checkup</span></Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><button type="button" className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ease-out touch-manipulation focus:outline-none ${scrolled ? "bg-white/10 text-[#22c0d4]" : "bg-[#081129]/5 text-[#22c0d4]"}`}><Menu className="w-6 h-6" strokeWidth={2.25} /></button></SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[340px] bg-[#f7f7f8] border-l border-[#081129]/10 p-0 flex flex-col">
              <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left"><SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">Browse categories</SheetTitle></SheetHeader>
              <nav className="px-3 py-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item) => {
                    const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                    const hasSubs = Boolean(item.hasDropdown && item.dropdownItems?.length);
                    const isExpanded = mobileExpanded === item.name;
                    return (
                      <div key={item.name} className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden">
                        <div className="flex items-stretch">
                          <Link to={item.path} onClick={() => setMobileOpen(false)} className="group flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 no-underline"><span className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}><Icon className="w-4 h-4" style={{ color }} strokeWidth={2} /></span><span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">{item.name}</span></Link>
                          {hasSubs && (<button type="button" onClick={() => setMobileExpanded((cur) => (cur === item.name ? null : item.name))} className="shrink-0 px-3 flex items-center justify-center border-l border-[#081129]/10 text-[#081129]/60"><ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} /></button>)}
                        </div>
                        {hasSubs && isExpanded && (<ul className="border-t border-[#081129]/10 bg-[#f7f7f8] py-1">{item.dropdownItems!.map((sub) => (<li key={sub.path + sub.name}><Link to={sub.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 pl-14 pr-3 py-2 text-[13px] font-medium text-[#081129] font-[Montserrat] no-underline hover:bg-white transition-colors"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} /><span className="truncate">{sub.name}</span></Link></li>))}</ul>)}
                      </div>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className={`hidden md:block sticky top-0 z-50 ${wrapperClass}`} data-testid="browse-by-category-bar">
        <div className={`${compact ? "px-3 py-3 sm:px-4 sm:py-4" : "px-3 sm:px-4 py-4 sm:py-5"} transition-all duration-300 ${innerClass}`}>
          <div className="flex items-center justify-center gap-x-2 gap-y-2.5 sm:gap-x-3 flex-wrap max-w-full">
            {items.map((item) => {
              const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
              return <CategoryPillDropdown key={item.name} item={item} color={color} Icon={Icon} compact={compact} />;
            })}
            <div ref={moreRef} className="relative shrink-0">
              <button type="button" onClick={() => setMoreOpen((o) => !o)} className={`inline-flex items-center rounded-full bg-white border-[1.5px] border-[#081129]/10 transition-all duration-200 ${compact ? "gap-2 pl-4 pr-5 py-3 sm:gap-2.5 sm:pl-5 sm:pr-6 sm:py-3.5" : "gap-2 pl-4 pr-5 sm:pl-5 sm:pr-6 py-4 sm:py-[18px]"}`}><span className={`rounded-full inline-flex items-center justify-center shrink-0 ${compact ? "w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]" : "w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"}`} style={{ background: "rgba(231,13,105,0.1)" }}><MoreHorizontal className={`${compact ? "w-[16px] h-[16px] sm:w-[19px] sm:h-[19px]" : "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"}`} style={{ color: "#e70d69" }} strokeWidth={2} /></span><span className={`font-semibold text-[#081129] font-[Montserrat] ${compact ? "text-[14px] sm:text-[15px] lg:text-[15.5px] 2xl:text-base" : "text-[15px] sm:text-[17px]"}`}>More</span><ChevronDown className={`text-[#081129]/60 transition-transform ${moreOpen ? "rotate-180" : ""} ${compact ? "w-4 h-4" : "w-4 h-4"}`} /></button>
              {moreOpen && <MoreDropdownMenu sections={moreNavigationSections} onItemClick={() => setMoreOpen(false)} onClose={() => setMoreOpen(false)} />}
            </div>
            <div className={`flex items-center shrink-0 ${compact ? "gap-0" : "gap-1"}`}><div className={compact ? "scale-[0.78]" : ""}><LanguageSwitcher /></div><div className={compact ? "scale-[0.78]" : ""}><UserMenu /></div></div>
          </div>
        </div>
      </div>
    </>
  );
}
