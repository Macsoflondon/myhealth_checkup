import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@/lib/router-compat";
import { ChevronDown } from "lucide-react";
import type { PrimaryNavItem } from "@/components/header/NavigationItems";

const PINK = "#e70d69";
const NAVY = "#081129";

interface Props {
  item: PrimaryNavItem;
  color: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  compact: boolean;
  /** Tighter padding/gaps used by the straddling toolbar so the full row fits one line. */
  dense?: boolean;
}

/**
 * Category slot inside the floating toolbar dock. Clicking navigates to the
 * parent category; hover/focus reveals the subcategory panel.
 *
 * The panel is `position: fixed` and portalled to the body so the dock's
 * horizontal scroll can never clip it.
 */
export function CategoryPillDropdown({ item, color, Icon, compact, dense = false }: Props) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const hasDropdown = Boolean(item.hasDropdown && item.dropdownItems?.length);

  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);

  const isActiveParent = currentUrl === item.path;

  const subItems = (item.dropdownItems ?? []).filter((s) => !/^view all/i.test(s.name));
  const viewAll = (item.dropdownItems ?? []).find((s) => /^view all/i.test(s.name));
  const twoColumn = subItems.length > 5;
  const panelWidth = twoColumn ? 460 : 280;

  const measure = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({ left: r.left, top: r.bottom + 12 });
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

  const highlighted = isActiveParent || open;

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
        className={`group inline-flex items-center rounded-full no-underline transition-colors duration-200 shrink-0 ${
          dense ? "gap-1.5 px-3 py-2" : "gap-1.5 px-2.5 py-2 2xl:gap-2 2xl:px-4 2xl:py-2.5"
        } ${compact ? "sm:py-2.5" : "sm:py-2.5"} ${
          highlighted ? "" : "hover:bg-[#081129]/[0.055]"
        }`}
        style={
          highlighted
            ? { backgroundColor: isActiveParent ? `${PINK}14` : "rgba(34,192,212,0.12)" }
            : undefined
        }
      >
        <Icon
          className={dense ? "w-[15px] h-[15px] shrink-0" : "w-[15px] h-[15px] shrink-0 2xl:w-[17px] 2xl:h-[17px]"}
          style={{ color: isActiveParent ? PINK : color }}
          strokeWidth={2}
        />
        <span
          className={`font-[Montserrat] whitespace-nowrap ${
            highlighted ? "font-bold" : "font-semibold"
          } ${
            dense
              ? "text-[13px] lg:text-[13.5px] tracking-[-0.015em]"
              : "text-[11.5px] lg:text-[12px] xl:text-[12px] 2xl:text-[14px] tracking-[-0.015em] 2xl:tracking-normal"
          }`}
          style={{ color: isActiveParent ? PINK : open ? "#127f8e" : "rgba(8,17,41,0.72)" }}
        >
          {item.name}
        </span>

        {hasDropdown && (
          <ChevronDown
            className={`text-[#081129]/45 transition-transform duration-300 shrink-0 w-[12px] h-[12px] 2xl:w-[14px] 2xl:h-[14px] ${open ? "rotate-180" : ""}`}
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
            left: Math.max(12, Math.min(anchor.left, window.innerWidth - panelWidth - 12)),
            top: anchor.top,
            zIndex: 9999,
            width: panelWidth,
          }}
          className="overflow-hidden rounded-2xl border border-white/50 bg-white/85 backdrop-blur-xl shadow-[0_24px_60px_rgba(8,17,41,0.22)] animate-in fade-in-0 slide-in-from-top-1 duration-150"
        >
          <ul className={`p-2.5 gap-0.5 ${twoColumn ? "grid grid-cols-2" : "flex flex-col"}`}>
            {subItems.map((sub) => {
              const active = currentUrl === sub.path;
              return (
                <li key={sub.path + sub.name}>
                  <Link
                    to={sub.path}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium font-[Montserrat] no-underline transition-colors ${
                      active ? "text-[#e70d69]" : "text-[#081129] hover:bg-white"
                    }`}
                    style={active ? { backgroundColor: `${PINK}14` } : undefined}
                  >
                    <span
                      className="w-7 h-7 rounded-lg inline-flex items-center justify-center shrink-0"
                      style={{ background: active ? `${PINK}1f` : `${color}1f` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: active ? PINK : color }} strokeWidth={2} />
                    </span>
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-[#081129]/[0.07] bg-[#081129]/[0.035] px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: `${NAVY}66` }}>
              {item.name}
            </span>
            {viewAll && (
              <Link
                to={viewAll.path}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold font-[Montserrat] no-underline hover:underline whitespace-nowrap"
                style={{ color: PINK }}
              >
                {viewAll.name}
              </Link>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
