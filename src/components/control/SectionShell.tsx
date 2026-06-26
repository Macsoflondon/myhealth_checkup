import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  title: string;
  description?: string;
  status?: "live" | "beta" | "stub";
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionShell({ title, description, status, actions, children }: SectionShellProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {status && <StatusBadge status={status} />}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div>{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "live" | "beta" | "stub" }) {
  const styles: Record<string, string> = {
    live: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    beta: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    stub: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border", styles[status])}>
      {status === "stub" ? "scaffold" : status}
    </span>
  );
}

export function ScaffoldNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm text-muted-foreground">
        {children ?? "This section is scaffolded. Live data wiring will be added in a follow-up turn."}
      </p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneClass = {
    default: "",
    good: "text-emerald-600",
    warn: "text-amber-600",
    bad: "text-rose-600",
  }[tone];
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className={cn("mt-1 text-2xl font-semibold tabular-nums", toneClass)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function HealthDot({ state }: { state: "good" | "warn" | "bad" | "idle" }) {
  const cls = {
    good: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]",
    warn: "bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]",
    bad: "bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.18)]",
    idle: "bg-muted-foreground/50",
  }[state];
  return <span className={cn("inline-block w-2 h-2 rounded-full", cls)} />;
}
