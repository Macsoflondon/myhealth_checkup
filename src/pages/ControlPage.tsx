import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, Navigate, useNavigate, useParams } from "@/lib/router-compat";
import {
  CONTROL_SECTIONS,
  DEFAULT_SECTION,
  SECTION_ALIASES,
  SECTION_GROUPS,
  getSection,
  type ControlSection,
} from "@/components/control/sectionRegistry";
import { StatusBadge } from "@/components/control/SectionShell";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, Menu, Search, ShieldCheck } from "lucide-react";
import { useOsRange } from "@/hooks/os/useOs";
import { OS_RANGES, rangeDays, type OsRange } from "@/lib/os/range";
import { cn } from "@/lib/utils";

/**
 * AI OS dashboard: the Crux Control shell. Sits behind AdminRoute (admin role
 * with MFA). Sections are lazy-loaded; growth sections share one date range
 * held in ?range= so a link reproduces the same view.
 */
export default function ControlPage() {
  const { section } = useParams<{ section?: string }>();
  const slug = section ?? DEFAULT_SECTION;
  const current = getSection(slug);
  const [navOpen, setNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const alias = SECTION_ALIASES[slug];
  if (alias) return <Navigate to={`/control/${alias}`} replace />;
  if (!current) return <Navigate to={`/control/${DEFAULT_SECTION}`} replace />;

  const SectionComponent = current.component;

  return (
    <div className="os-root min-h-screen bg-muted/30 text-foreground">
      <Helmet>
        <title>{`${current.title} | AI OS | myhealth checkup`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex min-h-screen">
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col border-r bg-card md:flex">
          <Brand />
          <nav
            className="flex-1 overflow-y-auto p-2"
            aria-label="AI OS sections"
          >
            <SectionNav active={slug} />
          </nav>
          <BuildStamp />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-12 z-[5] border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
              <Sheet open={navOpen} onOpenChange={setNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 md:hidden"
                    aria-label="Open AI OS sections"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>AI OS sections</SheetTitle>
                  </SheetHeader>
                  <Brand />
                  <nav className="p-2" aria-label="AI OS sections">
                    <SectionNav
                      active={slug}
                      onNavigate={() => setNavOpen(false)}
                    />
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <current.icon className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                <h1 className="truncate text-base font-semibold sm:text-lg">
                  {current.title}
                </h1>
                {current.status !== "live" && (
                  <StatusBadge status={current.status} />
                )}
              </div>

              {current.usesRange && <RangePicker />}

              <Button
                variant="outline"
                size="sm"
                className="h-10 shrink-0 gap-2"
                onClick={() => setPaletteOpen(true)}
                aria-label="Search sections"
              >
                <Search className="h-4 w-4" />
                <kbd className="hidden rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground lg:inline">
                  Ctrl K
                </kbd>
              </Button>
            </div>
          </header>

          <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <p className="mb-5 text-sm text-muted-foreground">
              {current.description}
            </p>
            <ErrorBoundary key={slug} fallback={<SectionCrashed />}>
              <Suspense
                fallback={
                  <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading section
                  </div>
                }
              >
                <SectionComponent />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      <CommandDialog
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        label="Go to a section"
      >
        <DialogTitle className="sr-only">Go to a section</DialogTitle>
        <DialogDescription className="sr-only">
          Type a section name, then press Enter to open it.
        </DialogDescription>
        <CommandInput placeholder="Go to a section" />
        <CommandList>
          <CommandEmpty>No section matches.</CommandEmpty>
          {SECTION_GROUPS.map((g) => (
            <CommandGroup key={g.id} heading={g.label}>
              {CONTROL_SECTIONS.filter((s) => s.group === g.id).map((s) => (
                <CommandItem
                  key={s.slug}
                  value={`${s.title} ${s.short} ${s.description}`}
                  onSelect={() => {
                    setPaletteOpen(false);
                    navigate(`/control/${s.slug}`);
                  }}
                >
                  <s.icon className="mr-2 h-4 w-4" />
                  <span>{s.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function Brand() {
  return (
    <div className="border-b px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
        AI OS
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Crux Control · admin with MFA only
      </p>
    </div>
  );
}

function BuildStamp() {
  return (
    <div className="border-t px-4 py-3 text-[10px] text-muted-foreground">
      Build {import.meta.env.MODE}
    </div>
  );
}

function SectionNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-4">
      {SECTION_GROUPS.map((g) => {
        const items = CONTROL_SECTIONS.filter((s) => s.group === g.id);
        if (items.length === 0) return null;
        return (
          <div key={g.id}>
            <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {items.map((s) => (
                <li key={s.slug}>
                  <NavItem
                    section={s}
                    active={active === s.slug}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function NavItem({
  section: s,
  active,
  onNavigate,
}: {
  section: ControlSection;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = s.icon;
  return (
    <NavLink
      to={`/control/${s.slug}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-foreground"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{s.short}</span>
      </span>
      {s.status !== "live" && <StatusBadge status={s.status} />}
    </NavLink>
  );
}

function RangePicker() {
  const [range, setRange] = useOsRange();
  return (
    <div
      role="group"
      aria-label="Date range"
      className="flex shrink-0 rounded-md border bg-background p-0.5"
    >
      {OS_RANGES.map((r: OsRange) => (
        <button
          key={r}
          type="button"
          aria-pressed={range === r}
          aria-label={`Last ${rangeDays(r)} days`}
          onClick={() => setRange(r)}
          className={cn(
            "h-10 min-w-[2.75rem] rounded px-2 text-xs font-medium tabular-nums transition-colors",
            range === r
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
          title={`Last ${rangeDays(r)} days`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function SectionCrashed() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-600/30 bg-rose-600/5 p-6 text-sm"
    >
      <p className="font-medium">This section failed to load.</p>
      <p className="mt-1 text-muted-foreground">
        The rest of the dashboard still works. Reload the page to try again; the
        browser console has the error.
      </p>
    </div>
  );
}
