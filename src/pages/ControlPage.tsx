import { Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, useParams, Navigate } from "react-router-dom";
import { CONTROL_SECTIONS, getSection } from "@/components/control/sectionRegistry";
import { StatusBadge } from "@/components/control/SectionShell";
import { Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Centralised admin Operations Control Centre.
 * Sits behind AdminRoute (role + MFA). Sections are lazy-loaded.
 */
export default function ControlPage() {
  const { section } = useParams<{ section?: string }>();
  const active = section ?? "overview";
  const current = useMemo(() => getSection(active), [active]);

  if (!current) {
    return <Navigate to="/control/overview" replace />;
  }

  const SectionComponent = current.component;

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <Helmet>
        <title>Operations Control Centre — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r bg-card flex flex-col">
          <div className="px-4 py-4 border-b">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Control Centre
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Internal · admin + MFA only
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-0.5">
              {CONTROL_SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.slug}>
                    <NavLink
                      to={`/control/${s.slug}`}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-sm transition",
                          (isActive || (active === s.slug))
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{s.short}</span>
                      </span>
                      {s.status !== "live" && <StatusBadge status={s.status} />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-4 py-3 border-t text-[10px] text-muted-foreground">
            Build {import.meta.env.MODE} · {new Date().toISOString().slice(0, 10)}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading section…
                </div>
              }
            >
              <SectionComponent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
