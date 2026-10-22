import { lazy, Suspense, useState } from "react";
import assistantMark from "@/assets/assistant/assistant-mark-96.webp";
import { useLocation } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

// The chat panel pulls in the AI SDK and markdown renderer, so it loads only
// when the visitor opens the assistant.
const ChatPanel = lazy(() =>
  import("./site-assistant-panel").then((m) => ({ default: m.ChatPanel })),
);

/**
 * Floating site assistant, available on every page.
 *
 * The launcher sits above the FloatingNavDock on the right edge. That dock is
 * fixed at bottom-4 right-3 (bottom-6 right-6 from sm) and is a single 32/36px
 * button on the homepage, but a Top + Home + Back stack elsewhere, so the space
 * it needs underneath differs by route and the launcher must never sit on it.
 */
const LAUNCHER_CLEARANCE_HOME = "bottom-[76px]";
const LAUNCHER_CLEARANCE_DOCK = "bottom-[140px] sm:bottom-[164px]";

export const SiteAssistant = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {open && (
        <Suspense fallback={null}>
          <ChatPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}
      <div
        className={cn(
          "fixed right-3 z-[60] flex items-center gap-2 sm:right-6",
          isHome ? LAUNCHER_CLEARANCE_HOME : LAUNCHER_CLEARANCE_DOCK,
          open && "hidden sm:flex",
        )}
      >
        <span className="relative flex items-center gap-1.5 rounded-xl bg-brand-navy px-3 py-1.5 shadow-md">
          <span
            className="size-1.5 shrink-0 animate-pulse rounded-full bg-brand-turquoise"
            aria-hidden="true"
          />
          <span className="font-heading text-[11px] font-semibold whitespace-nowrap text-white">
            <span className="hidden sm:inline">AI assistant chat</span>
            <span className="sm:hidden">AI chat</span>
          </span>
          <span
            className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-brand-navy"
            aria-hidden="true"
          />
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={
            open ? "Close AI assistant chat" : "Open AI assistant chat"
          }
          aria-expanded={open}
          className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-turquoise bg-white/90 shadow-md backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2 sm:size-16"
        >
          <img
            src={assistantMark}
            alt=""
            width={36}
            height={36}
            // Decorative launcher icon: low priority so React does not emit a
            // <link rel="preload"> for it ahead of the stylesheet and hero.
            fetchPriority="low"
            decoding="async"
            className="size-9 sm:size-11"
          />
        </button>
      </div>
    </>
  );
};
