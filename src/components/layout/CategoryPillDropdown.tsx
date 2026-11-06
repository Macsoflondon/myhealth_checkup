import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@/lib/router-compat";
import { ChevronDown } from "lucide-react";
import type { PrimaryNavItem } from "@/components/header/NavigationItems";
import { wellnessCategoryVisuals } from "@/components/layout/wellness-category-visuals";

const PINK = "#e70d69";
const NAVY = "#081129";

interface Props {
  item: PrimaryNavItem;
  color: string;
  Icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
    strokeWidth?: number;
  }>;
  compact: boolean;
  /** Tighter padding/gaps used by the desktop toolbar so the full row fits one line. */
  dense?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * One category in the desktop toolbar. The label links to the parent
 * category; categories with subcategories also open a panel:
 *
 * - mouse: hovering opens it, and a click on the label follows the link;
 * - touch or pen: the first tap opens it, a tap on a link inside navigates,
 *   and a second tap on the label follows the parent link;
 * - keyboard: Enter follows the link, ArrowDown or Space opens the panel and
 *   moves focus to its first link, Escape closes it and returns focus.
 *
 * The panel closes on a click or tap outside, Escape, focus leaving it and
 * route change. It is `position: fixed` and portalled to the body so the
 * toolbar's horizontal scroll and the page-surface mask never clip it.
 */
export function CategoryPillDropdown({
  item,
  color,
  Icon,
  compact,
  dense = false,
}: Props) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const hasDropdown = Boolean(item.hasDropdown && item.dropdownItems?.length);
  const panelId = useId();

  const wrapRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const lastPointerType = useRef<string | null>(null);
  const focusFirstOnOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(
    null,
  );

  const isActiveParent = currentUrl === item.path;

  const subItems = (item.dropdownItems ?? []).filter(
    (s) => !/^view all/i.test(s.name),
  );
  const viewAll = (item.dropdownItems ?? []).find((s) =>
    /^view all/i.test(s.name),
  );
  const twoColumn = subItems.length > 5;
  const visualGrid =
    subItems.length > 0 &&
    subItems.every((s) => Boolean(wellnessCategoryVisuals[s.path]));
  const panelWidth = visualGrid ? 940 : twoColumn ? 460 : 280;

  const measure = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({ left: r.left, top: r.bottom + 12 });
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openNow = () => {
    if (!hasDropdown) return;
    cancelClose();
    measure();
    setOpen(true);
  };

  const close = () => {
    cancelClose();
    setOpen(false);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const isInside = (node: EventTarget | null) =>
    node instanceof Node &&
    Boolean(
      wrapRef.current?.contains(node) || panelRef.current?.contains(node),
    );

  const panelLinks = () =>
    Array.from(
      panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [],
    );

  // Close on route change.
  useEffect(() => close(), [location.key]);
  useEffect(() => () => cancelClose(), []);

  // While open: follow scroll/resize, close on Escape and on outside presses.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const hadFocus = isInside(document.activeElement);
      close();
      if (hadFocus) linkRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!isInside(e.target)) close();
    };
    const onScrollOrResize = () => measure();
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open]);

  // Keyboard opening moves focus into the panel once it has rendered.
  useEffect(() => {
    if (!open || !anchor || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    panelLinks()[0]?.focus();
  }, [open, anchor]);

  const onLinkPointerDown = (e: React.PointerEvent) => {
    lastPointerType.current = e.pointerType;
  };

  const onLinkClick = (e: React.MouseEvent) => {
    const pointer = lastPointerType.current;
    lastPointerType.current = null;
    // Touch and pen have no hover, so the first tap opens the panel instead
    // of leaving the page. Mouse clicks and Enter follow the link as usual.
    if (hasDropdown && !open && (pointer === "touch" || pointer === "pen")) {
      e.preventDefault();
      openNow();
    }
  };

  const onLinkKeyDown = (e: React.KeyboardEvent) => {
    if (!hasDropdown) return;
    if (e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      if (open) {
        panelLinks()[0]?.focus();
      } else {
        focusFirstOnOpen.current = true;
        openNow();
      }
    }
  };

  // Keep Tab order natural although the panel sits at the end of <body>:
  // Tab past the last link continues after this category, Shift+Tab before
  // the first link returns to the category label. Arrow keys move between links.
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    const links = panelLinks();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      links[(index + step + links.length) % links.length]?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    if (e.shiftKey && index === 0) {
      e.preventDefault();
      close();
      linkRef.current?.focus();
    } else if (!e.shiftKey && index === links.length - 1) {
      e.preventDefault();
      close();
      const all = Array.from(
        document.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !panelRef.current?.contains(el));
      const next = all[all.indexOf(linkRef.current as HTMLElement) + 1];
      (next ?? linkRef.current)?.focus();
    }
  };

  const onWrapBlur = (e: React.FocusEvent) => {
    // Focus moving between the label and the portalled panel keeps it open;
    // focus moving anywhere else closes it.
    if (e.relatedTarget && !isInside(e.relatedTarget)) close();
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") openNow();
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") scheduleClose();
  };

  const highlighted = isActiveParent || open;

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onWrapBlur}
    >
      <Link
        ref={linkRef}
        to={item.path}
        onPointerDown={onLinkPointerDown}
        onClick={onLinkClick}
        onKeyDown={onLinkKeyDown}
        data-testid="category-pill"
        data-category={item.name}
        aria-current={isActiveParent ? "page" : undefined}
        aria-expanded={hasDropdown ? open : undefined}
        aria-controls={hasDropdown && open ? panelId : undefined}
        className={`group inline-flex items-center rounded-full no-underline transition-colors duration-200 shrink-0 ${
          dense
            ? "gap-0.5 px-[3px] py-2 xl:gap-1 xl:px-1"
            : "gap-0.5 px-1 py-2 2xl:gap-1 2xl:px-2 2xl:py-2.5"
        } ${compact ? "sm:py-2.5" : "sm:py-2.5"} ${
          highlighted ? "" : "hover:bg-brand-pink/10"
        }`}
        style={
          highlighted
            ? {
                backgroundColor: isActiveParent
                  ? `${PINK}14`
                  : "rgba(34,192,212,0.12)",
              }
            : undefined
        }
      >
        <Icon
          className={`${dense ? "hidden 2xl:block w-[15px] h-[15px] shrink-0" : "w-[14px] h-[14px] shrink-0 2xl:w-[17px] 2xl:h-[17px]"} group-hover:!text-brand-pink`}
          style={{ color: isActiveParent ? PINK : color }}
          strokeWidth={2}
        />
        <span
          className={`font-[Montserrat] whitespace-nowrap group-hover:!text-brand-pink ${
            highlighted ? "font-bold" : "font-bold"
          } ${
            dense
              ? "text-[12px] tracking-[-0.02em] xl:text-[13.5px] xl:tracking-[-0.01em] 2xl:text-[14.5px]"
              : "text-xs sm:text-[12px] tracking-[-0.02em] 2xl:text-sm 2xl:tracking-normal"
          }`}

          style={{
            color: isActiveParent ? PINK : open ? "#127f8e" : "#081129",
          }}
        >
          {item.name}
        </span>

        {hasDropdown && (
          <ChevronDown
            className={`text-[#081129]/45 transition-transform duration-300 shrink-0 ${dense ? "hidden xl:block w-[11px] h-[11px] 2xl:w-[12px] 2xl:h-[12px]" : "w-[12px] h-[12px] 2xl:w-[14px] 2xl:h-[14px]"} group-hover:text-brand-pink ${open ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {open &&
        anchor &&
        hasDropdown &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="group"
            aria-label={`${item.name} subcategories`}
            data-testid="category-panel"
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onKeyDown={onPanelKeyDown}
            style={{
              position: "fixed",
              left: Math.max(
                12,
                Math.min(anchor.left, window.innerWidth - panelWidth - 12),
              ),
              top: anchor.top,
              zIndex: 9999,
              width: panelWidth,
            }}
            className="overflow-hidden rounded-2xl border border-white/50 bg-white/85 backdrop-blur-xl shadow-[0_24px_60px_rgba(8,17,41,0.22)] animate-in fade-in-0 slide-in-from-top-1 duration-150"
          >
            {visualGrid ? (
              <ul className="grid grid-cols-5 gap-2.5 p-3">
                {subItems.map((sub) => {
                  const v = wellnessCategoryVisuals[sub.path];
                  if (!v) return null;
                  const active = currentUrl === sub.path;
                  return (
                    <li key={sub.path + sub.name}>
                      <Link
                        to={sub.path}
                        aria-label={sub.name}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`group/card relative block aspect-[3/4] overflow-hidden rounded-2xl no-underline ring-1 transition-shadow ${
                          active
                            ? "ring-2 ring-brand-pink"
                            : "ring-black/10 hover:ring-2 hover:ring-brand-turquoise"
                        }`}
                      >
                        <img
                          src={v.image}
                          alt=""
                          width={420}
                          height={560}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <span className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/75" />
                        <span className="absolute left-3 right-3 top-3 font-[Montserrat] text-[17px] font-semibold leading-tight text-white">
                          {v.title}
                        </span>
                        <span className="absolute bottom-3 left-2.5 right-2.5 flex flex-wrap gap-1">
                          {v.biomarkers.map((b) => (
                            <span
                              key={b}
                              className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/30 px-2 py-0.5 font-[Montserrat] text-[10px] font-medium text-white backdrop-blur-sm"
                            >
                              <span className="h-1 w-1 rounded-[1px] bg-white" />
                              {b}
                            </span>
                          ))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul
                className={`p-2.5 gap-0.5 ${twoColumn ? "grid grid-cols-2" : "flex flex-col"}`}
              >
                {subItems.map((sub) => {
                  const active = currentUrl === sub.path;
                  return (
                    <li key={sub.path + sub.name}>
                      <Link
                        to={sub.path}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium font-[Montserrat] no-underline transition-colors ${
                          active
                            ? "text-[#e70d69]"
                            : "text-[#081129] hover:bg-white"
                        }`}
                        style={
                          active ? { backgroundColor: `${PINK}14` } : undefined
                        }
                      >
                        <span
                          className="w-7 h-7 rounded-lg inline-flex items-center justify-center shrink-0"
                          style={{
                            background: active ? `${PINK}1f` : `${color}1f`,
                          }}
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: active ? PINK : color }}
                            strokeWidth={2}
                          />
                        </span>
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-[#081129]/[0.07] bg-[#081129]/[0.035] px-4 py-3">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: `${NAVY}66` }}
              >
                {item.name}
              </span>
              {viewAll && (
                <Link
                  to={viewAll.path}
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
