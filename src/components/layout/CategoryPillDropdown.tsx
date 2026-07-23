import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { PrimaryNavItem } from "@/components/header/NavigationItems";

const PINK = "#e70d69";

interface Props {
  item: PrimaryNavItem;
  color: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  compact: boolean;
}

/**
 * Pill for the Browse-by-category bar. Clicking the pill navigates to the
 * parent category. Hovering (or focusing) reveals the subcategory dropdown.
 *
 * Panel is `position: fixed`, anchored to the pill's bounding rect on open,
 * so it isn't clipped by the pill strip's mask.
 */
export function CategoryPillDropdown({ item, color, Icon, compact }: Props) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const hasDropdown = Boolean(item.hasDropdown && item.dropdownItems?.length);

  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);

  const isActiveParent = currentUrl === item.path;

  const measure = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({ left: r.left, top: r.bottom + 8 });
  };

  const openNow = () => {
    if (!hasDropdown) return;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    measure();
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  // Close on route change / Escape / scroll / resize.
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onScrollOrResize = () => measure();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={scheduleClose}
    >
      <Link
        to={item.path}
        data-testid="category-pill"
        data-category={item.name}
        aria-current={isActiveParent ? "page" : undefined}
        aria-haspopup={hasDropdown ? "menu" : undefined}
        aria-expanded={hasDropdown ? open : undefined}
        className={`group inline-flex max-w-[220px] items-center rounded-full no-underline bg-white border-[1.5px] hover:-translate-y-0.5 transition-all duration-200 shrink-0 md:max-w-[150px] lg:max-w-[170px] xl:max-w-[190px] 2xl:max-w-none ${
          compact
            ? "gap-1 pl-2 pr-2.5 py-1.5 sm:gap-1.5 sm:pl-2.5 sm:pr-3 sm:py-2"
            : "gap-2 pl-4 pr-5 sm:pl-5 sm:pr-6 py-4 sm:py-[18px]"
        }`}
        style={{
          borderColor: isActiveParent ? PINK : "rgba(8,17,41,0.1)",
          boxShadow: isActiveParent ? `0 8px 20px ${PINK}26` : undefined,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 8px 20px ${color}26`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isActiveParent ? PINK : "rgba(8,17,41,0.1)";
          e.currentTarget.style.boxShadow = isActiveParent
            ? `0 8px 20px ${PINK}26`
            : "0 1px 2px rgba(8,17,41,0.04)";
        }}
      >
        <span
          className={`rounded-full inline-flex items-center justify-center shrink-0 ${
            compact
              ? "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
              : "w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
          }`}
          style={{ background: `${color}1a` }}
        >
          <Icon
            className={compact ? "w-[9px] h-[9px] sm:w-[10px] sm:h-[10px]" : "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"}
            style={{ color }}
            strokeWidth={2}
          />
        </span>
        <span
          className={`font-semibold text-[#081129] font-[Montserrat] whitespace-nowrap ${
            compact ? "min-w-0 truncate text-[10px] sm:text-[10.5px] lg:text-[11px] 2xl:text-xs" : "min-w-0 truncate text-[15px] sm:text-[17px]"
          }`}
        >
          {item.name}
        </span>
        {hasDropdown && (
          <ChevronDown
            className={`text-[#081129]/60 transition-transform ${open ? "rotate-180" : ""} ${
              compact ? "w-2.5 h-2.5 shrink-0" : "w-4 h-4 shrink-0"
            }`}
          />
        )}
      </Link>

      {open && anchor && hasDropdown && createPortal(
        <div
          role="menu"
          aria-label={`${item.name} subcategories`}
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
          style={{
            position: "fixed",
            left: Math.max(8, Math.min(anchor.left, window.innerWidth - 272)),
            top: anchor.top,
            zIndex: 60,
            minWidth: 260,
          }}
          className="rounded-2xl bg-white border border-[#081129]/10 shadow-[0_18px_40px_rgba(8,17,41,0.18)] p-2 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div
            className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            {item.name}
          </div>
          <ul className="flex flex-col">
            {item.dropdownItems!.map((sub) => {
              const active = currentUrl === sub.path;
              const isViewAll = /^view all/i.test(sub.name);
              return (
                <li key={sub.path + sub.name}>
                  <Link
                    to={sub.path}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium font-[Montserrat] no-underline transition-colors ${
                      active ? "text-[#e70d69]" : "text-[#081129] hover:bg-[#081129]/5"
                    } ${isViewAll ? "mt-1 border-t border-[#081129]/10 pt-2.5 rounded-t-none" : ""}`}
                    style={active ? { backgroundColor: `${PINK}14` } : undefined}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: active ? PINK : color }}
                    />
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
