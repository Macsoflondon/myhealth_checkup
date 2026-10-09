/**
 * Building blocks shared by every AI OS section: panels with a source line,
 * KPI tiles with deltas, ranked bar lists, the daily chart (with a table
 * view), status pills and empty states. Chart colours come from the
 * .os-root tokens in src/styles.css.
 */
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatAgo,
  formatDateTime,
  formatDay,
  type Delta,
} from "@/lib/os/format";

// ---------------------------------------------------------------------------
// Panel and source line
// ---------------------------------------------------------------------------

export type SourceInfo = {
  /** Where the figures come from, e.g. "Google Analytics 4". */
  label: string;
  /** When the data was fetched or generated (ISO). */
  updatedAt?: string | null;
  /** Window the figures cover, e.g. "last 28 days to yesterday". */
  window?: string;
};

export function SourceLine({ source }: { source: SourceInfo }) {
  return (
    <p className="text-[11px] leading-snug text-muted-foreground">
      <span className="font-medium text-foreground/80">{source.label}</span>
      {source.window && <> · {source.window}</>}
      {source.updatedAt !== undefined && (
        <>
          {" "}
          ·{" "}
          <time
            dateTime={source.updatedAt ?? undefined}
            title={formatDateTime(source.updatedAt)}
          >
            updated {formatAgo(source.updatedAt)}
          </time>
        </>
      )}
    </p>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  source,
  children,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  source?: SourceInfo;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border bg-card p-4 sm:p-5 flex flex-col gap-3",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-tight">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="min-w-0 flex-1">{children}</div>
      {source && <SourceLine source={source} />}
    </section>
  );
}

// ---------------------------------------------------------------------------
// KPI tile
// ---------------------------------------------------------------------------

export function DeltaText({
  delta,
  goodWhen = "up",
}: {
  delta: Delta;
  /** Which direction is good news for this metric. */
  goodWhen?: "up" | "down";
}) {
  if (delta.direction === "none" || delta.direction === "flat") {
    return <span className="text-muted-foreground">{delta.text}</span>;
  }
  const good = delta.direction === goodWhen;
  const Icon = delta.direction === "up" ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        good
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-rose-700 dark:text-rose-400",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {delta.text}
    </span>
  );
}

export function KpiTile({
  label,
  value,
  delta,
  goodWhen,
  hint,
  loading,
}: {
  label: string;
  value: ReactNode;
  delta?: Delta;
  goodWhen?: "up" | "down";
  hint?: ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        // Wrap rather than truncate: a cut-off figure reads as a different
        // number. Two tiles share a 360px row, so phones get a smaller size.
        <div className="mt-1 break-words text-xl font-semibold leading-tight tabular-nums sm:text-2xl">
          {value}
        </div>
      )}
      {!loading && delta && (
        <div className="mt-1 text-xs">
          <DeltaText delta={delta} goodWhen={goodWhen} />
        </div>
      )}
      {!loading && hint && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>
  );
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export type StatusTone = "ok" | "warn" | "error" | "idle";

const STATUS_STYLE: Record<
  StatusTone,
  { icon: typeof CheckCircle2; className: string }
> = {
  ok: {
    icon: CheckCircle2,
    className:
      "border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300",
  },
  warn: {
    icon: AlertTriangle,
    className:
      "border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300",
  },
  error: {
    icon: XCircle,
    className:
      "border-rose-600/30 bg-rose-600/10 text-rose-800 dark:text-rose-300",
  },
  idle: {
    icon: MinusCircle,
    className: "border-border bg-muted text-muted-foreground",
  },
};

/** Status always carries an icon and a word, never colour alone. */
export function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone;
  children: ReactNode;
}) {
  const { icon: Icon, className } = STATUS_STYLE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Empty, loading and error states
// ---------------------------------------------------------------------------

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-5 text-center">
      <p className="text-sm font-medium">{title}</p>
      {children && (
        <div className="mx-auto mt-1 max-w-prose text-xs text-muted-foreground">
          {children}
        </div>
      )}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
}

export function ErrorNote({ error }: { error: unknown }) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong loading this.";
  return (
    <div
      role="alert"
      className="rounded-lg border border-rose-600/30 bg-rose-600/5 p-3 text-xs text-rose-800 dark:text-rose-300"
    >
      {message}
    </div>
  );
}

export function Limitations({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <details className="rounded-lg border bg-muted/20 px-3 text-xs">
      <summary className="cursor-pointer select-none py-3 font-medium">
        Known limitations
      </summary>
      <ul className="mb-3 list-disc space-y-1 pl-4 text-muted-foreground">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Ranked bar list (magnitude, single hue)
// ---------------------------------------------------------------------------

export type BarListItem = {
  key: string;
  label: ReactNode;
  value: number;
  /** Formatted value shown at the bar tip. */
  display: string;
  /** Secondary text under the label, e.g. a share. */
  meta?: ReactNode;
};

export function BarList({
  items,
  emptyText = "Nothing in this period.",
  max,
}: {
  items: BarListItem[];
  emptyText?: string;
  /** Scale maximum; defaults to the largest value. */
  max?: number;
}) {
  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        {emptyText}
      </p>
    );
  }
  const top = max ?? Math.max(...items.map((i) => i.value), 0);
  return (
    <ol className="space-y-2.5">
      {items.map((item) => {
        const pct = top > 0 ? Math.max(2, (item.value / top) * 100) : 0;
        return (
          <li key={item.key} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">{item.label}</span>
              <span className="shrink-0 font-medium tabular-nums">
                {item.display}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-muted" aria-hidden>
              <div
                className="h-2 rounded-full"
                style={{ width: `${pct}%`, background: "var(--os-series-1)" }}
              />
            </div>
            {item.meta && (
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {item.meta}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Daily columns (stacked, with tooltip, legend and a table view)
// ---------------------------------------------------------------------------

export type ChartColor = "series1" | "series1Soft" | "series2" | "neutral";

const COLOR_VAR: Record<ChartColor, string> = {
  series1: "var(--os-series-1)",
  series1Soft: "var(--os-series-1-soft)",
  series2: "var(--os-series-2)",
  neutral: "var(--os-neutral)",
};

export type DailySeries = { key: string; label: string; color: ChartColor };

type DailyRow = { day: string } & Record<string, number | string>;

function DailyTooltip({
  active,
  payload,
  label,
  series,
  format,
}: TooltipProps<number, string> & {
  series: DailySeries[];
  format: (n: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as DailyRow | undefined;
  if (!row) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-1 font-medium">{formatDay(String(label))}</div>
      {series.map((s) => (
        <div key={s.key} className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: COLOR_VAR[s.color] }}
              aria-hidden
            />
            {s.label}
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {format(Number(row[s.key] ?? 0))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DailyChart({
  data,
  series,
  format,
  ariaLabel,
  height = 220,
}: {
  data: DailyRow[];
  series: DailySeries[];
  format: (n: number) => string;
  ariaLabel: string;
  height?: number;
}) {
  const last = series.length - 1;
  return (
    <div className="space-y-2">
      {series.length > 1 && (
        <ul
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
          aria-label="Legend"
        >
          {series.map((s) => (
            <li key={s.key} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: COLOR_VAR[s.color] }}
                aria-hidden
              />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: -12 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--os-grid)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="day"
              tickFormatter={formatDay}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "var(--os-grid)" }}
              minTickGap={18}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              tickFormatter={(v: number) => format(v)}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              cursor={{ fill: "var(--os-grid)", opacity: 0.6 }}
              content={<DailyTooltip series={series} format={format} />}
            />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stackId="daily"
                fill={COLOR_VAR[s.color]}
                stroke="var(--os-surface)"
                strokeWidth={series.length > 1 ? 1 : 0}
                maxBarSize={24}
                radius={i === last ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="text-xs">
        <summary className="cursor-pointer select-none py-3 text-muted-foreground">
          Show as table
        </summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-card text-muted-foreground">
              <tr>
                <th className="py-1 pr-3 font-medium">Day</th>
                {series.map((s) => (
                  <th key={s.key} className="py-1 pr-3 text-right font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={String(row.day)} className="border-t">
                  <td className="py-1 pr-3">{formatDay(String(row.day))}</td>
                  {series.map((s) => (
                    <td key={s.key} className="py-1 pr-3 text-right">
                      {format(Number(row[s.key] ?? 0))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simple responsive table (scrolls inside its panel, never the page)
// ---------------------------------------------------------------------------

export function DataTable({
  columns,
  rows,
  emptyText = "Nothing in this period.",
}: {
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: { key: string; cells: Record<string, ReactNode> }[];
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        {emptyText}
      </p>
    );
  }
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-1 py-1.5 font-medium",
                  c.align === "right" && "text-right",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t align-top">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-1 py-1.5",
                    c.align === "right" && "text-right tabular-nums",
                  )}
                >
                  {r.cells[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
