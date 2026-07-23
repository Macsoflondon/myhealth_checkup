import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Star, Heart, UserCheck, User, Dumbbell, Baby, ShieldCheck, Home, MoreHorizontal, Menu, X, Info, Phone, Users, Search, BarChart2, BookOpen, Library } from "lucide-react";
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
const MORE_SECTION_ICONS: Record<string, { Icon: any; color: string }> = {
  "About Us": { Icon: Info, color: TURQUOISE },
  "Frequently Asked Questions": { Icon: BookOpen, color: "#6366f1" },
  "Our Providers": { Icon: Users, color: PINK },
  "Assisted Test Finder": { Icon: Search, color: "#16a34a" },
  "Compare Tests": { Icon: BarChart2, color: "#f59e0b" },
  "Health Resources Hub": { Icon: BookOpen, color: "#0ea5e9" },
  "Biomarker Library": { Icon: Library, color: "#8b5cf6" },
  "Contact Us": { Icon: Phone, color: PINK },
};
export default function BrowseByCategoryBar({ variant = "card", compact = false, placement = "card", className = "" }: { variant?: "card" | "flush"; compact?: boolean; placement?: "card" | "hero"; className?: string; } = {}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => { let t = false; const f = () => { if (t) return; t = true; requestAnimationFrame(() => { setScrolled(window.scrollY > 8); t = false; }); }; f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { const el = sentinelRef.current; if (!el) return; const obs = new IntersectionObserver(([e]) => setStuck(e.intersectionRatio < 1 && e.boundingClientRect.top < 0), { threshold: [1] }); obs.observe(el); return () => obs.disconnect(); }, []);
  useEffect(() => { if (!moreOpen) return; const d = (e: MouseEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); }; const k = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false); document.addEventListener("mousedown", d); document.addEventListener("keydown", k); return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); }; }, [moreOpen]);
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
        <div data-scrolled={scrolled} className="px-4 h-20 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b bg-white border-[#081129]/10">
          <Link to="/" className="flex items-center h-10 no-underline font-[Montserrat] font-extrabold tracking-tight text-[30px] leading-none"><span className="text-[#081129] transition-colors duration-300 ease-out">myhealth</span><span className="text-[#e70d69]">checkup</span></Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><button type="button" className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ease-out touch-manipulation focus:outline-none bg-[#081129]/5 text-[#22c0d4]"><Menu className="w-6 h-6" strokeWidth={2.25} /></button></SheetTrigger>
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
                <div className="mt-5 pt-4 border-t border-[#081129]/10">
                  {moreNavigationSections.map((section) => (
                    <div key={section.title} className="mb-3">
                      <span className="block px-2 mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#081129]/50 font-[Montserrat]">{section.title}</span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {section.items.map((item) => {
                          const { Icon: SIcon, color: sColor } = MORE_SECTION_ICONS[item.name] ?? { Icon: Info, color: TURQUOISE };
                          return (
                            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-[#081129]/10 no-underline hover:bg-[#081129]/[0.03] transition-colors">
                              <span className="w-7 h-7 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: `${sColor}1a` }}><SIcon className="w-3.5 h-3.5" style={{ color: sColor }} strokeWidth={2} /></span>
                              <span className="text-[13px] font-semibold text-[#081129] font-[Montserrat]">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>
              <div className="border-t border-[#081129]/10 bg-white px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#081129]/60 font-[Montserrat] uppercase tracking-wider">Account & language</span>
                <div className="flex items-center gap-1"><LanguageSwitcher /><UserMenu /></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className={`hidden md:block sticky top-0 z-50 ${wrapperClass}`} data-testid="browse-by-category-bar">
        <div className={`${compact ? "px-2 py-2 sm:px-3 sm:py-2.5" : "px-2 sm:px-3 py-2.5 sm:py-3"} transition-all duration-300 ${innerClass}`}>
          <div className="flex items-center justify-center gap-x-1.5 gap-y-2 sm:gap-x-2 flex-nowrap max-w-full overflow-x-auto">
            {items.map((item) => {
              const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
              return <CategoryPillDropdown key={item.name} item={item} color={color} Icon={Icon} compact={compact} />;
            })}
            <div ref={moreRef} className="relative shrink-0">
              <button type="button" onClick={() => setMoreOpen((o) => !o)} className="inline-flex items-center rounded-full bg-white border-[1.5px] border-[#081129]/10 transition-all duration-200 gap-1.5 pl-2.5 pr-3 py-2.5 sm:gap-2 sm:pl-3 sm:pr-3.5 sm:py-3"><span className="rounded-full inline-flex items-center justify-center shrink-0 w-[24px] h-[24px] sm:w-[26px] sm:h-[26px]" style={{ background: "rgba(231,13,105,0.1)" }}><MoreHorizontal className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px]" style={{ color: "#e70d69" }} strokeWidth={2} /></span><span className="font-semibold text-[#081129] font-[Montserrat] text-[13px] sm:text-[14px] lg:text-[14.5px]">More</span><ChevronDown className={`text-[#081129]/60 transition-transform w-3.5 h-3.5 ${moreOpen ? "rotate-180" : ""}`} /></button>
              {moreOpen && <MoreDropdownMenu sections={moreNavigationSections} onItemClick={() => setMoreOpen(false)} onClose={() => setMoreOpen(false)} />}
            </div>
            <div className="shrink-0 flex items-center gap-1 pl-1.5 ml-1.5 border-l border-[#081129]/10"><LanguageSwitcher /><UserMenu /></div>
          </div>
        </div>
      </div>
    </>
  );
}
