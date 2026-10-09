/**
 * Social media: followers and recent posts on Facebook, Instagram and TikTok,
 * read from the Metricool snapshots. Each network reports a different set of
 * metrics, so a figure the network did not report shows as a dash, never as
 * zero.
 */
import { useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DailyChart,
  EmptyState,
  ErrorNote,
  Limitations,
  LoadingRows,
  Panel,
  SourceLine,
  StatusPill,
  type SourceInfo,
} from "@/components/os/ui";
import {
  useOsRange,
  useOsWindow,
  usePluginStatus,
  useSnapshot,
} from "@/hooks/os/useOs";
import { formatAgo, formatDate, formatDay, formatInt } from "@/lib/os/format";
import { lastNDays, rangeDays, type OsWindow } from "@/lib/os/range";
import {
  bestPost,
  followerChange,
  postsInWindow,
  totalInteractions,
  type FollowerPoint,
} from "@/lib/os/series";
import type { OsStatusResponse } from "@/lib/os/types";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/router-compat";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type {
  MetricoolFollowers,
  MetricoolPosts,
  SocialNetwork,
  SocialPost,
} from "../../../../supabase/functions/_shared/os/contract";

const SOURCE = "Metricool";
const PAGE_SIZE = 12;
/** The sync runs hourly; older than this means it has stopped or is failing. */
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

const NETWORKS: readonly SocialNetwork[] = ["facebook", "instagram", "tiktok"];

const NETWORK_LABEL: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const POST_TYPE_LABEL: Record<SocialPost["type"], string> = {
  post: "Post",
  reel: "Reel",
  video: "Video",
  story: "Story",
};

type NetworkFilter = "all" | SocialNetwork;

const FILTERS: { id: NetworkFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...NETWORKS.map((n) => ({ id: n, label: NETWORK_LABEL[n] })),
];

const percentFmt = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 2,
});

type Connection = "connected" | "off" | "not_connected" | "unknown";

function connectionOf(
  status: OsStatusResponse | undefined,
  pluginId: string,
): Connection {
  const plugin = status?.plugins.find((p) => p.plugin_id === pluginId);
  if (!plugin) return "unknown";
  if (!plugin.enabled) return "off";
  return plugin.ready ? "connected" : "not_connected";
}

/** The older of two timestamps, so a source line never overstates freshness. */
function oldest(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(a) <= Date.parse(b) ? a : b;
}

/** Posts a snapshot written before 9 Oct 2026 kept across all networks. */
const LEGACY_POST_CAP = 200;

/**
 * True when the stored posts for `network` stop after the window starts,
 * because the sync kept only the newest posts.
 */
function cutShort(
  posts: MetricoolPosts | null,
  network: SocialNetwork,
  fromMs: number,
): boolean {
  if (!posts) return false;
  const legacy =
    !Array.isArray(posts.truncated) && posts.posts.length >= LEGACY_POST_CAP;
  if (!legacy && !(posts.truncated ?? []).includes(network)) return false;
  const times = posts.posts
    .filter((p) => legacy || p.network === network)
    .map((p) => Date.parse(p.published_at ?? ""))
    .filter(Number.isFinite);
  return times.length === 0 || Math.min(...times) > fromMs;
}

/** "+12", "−3" or "No change". */
function formatSigned(n: number): string {
  if (n === 0) return "No change";
  return n > 0 ? `+${formatInt(n)}` : `−${formatInt(-n)}`;
}

function followerPoints(
  followers: MetricoolFollowers | null,
  network: SocialNetwork,
): FollowerPoint[] {
  const series = (followers?.series ?? []).filter((s) => s.network === network);
  const withPoints = series.find((s) => (s.points ?? []).length > 0);
  return withPoints?.points ?? [];
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function SocialSection() {
  const [range] = useOsRange();
  const days = rangeDays(range);
  const win = useOsWindow(range);
  const status = usePluginStatus();
  const posts = useSnapshot<MetricoolPosts>("metricool", "posts");
  const followers = useSnapshot<MetricoolFollowers>("metricool", "followers");
  const [filter, setFilter] = useState<NetworkFilter>("all");

  const limitations = getOsPlugin("metricool")?.limitations ?? [];
  const connection = connectionOf(status.data, "metricool");
  const loading = posts.isLoading || followers.isLoading;
  const error = posts.error ?? followers.error;

  let body: ReactNode;
  if (loading) {
    body = <SocialLoading />;
  } else if (error) {
    body = <ErrorNote error={error} />;
  } else if (!posts.data && !followers.data) {
    body = <NotSyncedState connection={connection} />;
  } else {
    body = (
      <SocialBody
        posts={posts.data}
        followers={followers.data}
        postsFetchedAt={posts.fetchedAt}
        followersFetchedAt={followers.fetchedAt}
        connection={connection}
        filter={filter}
        onFilter={setFilter}
        days={days}
        win={win}
      />
    );
  }

  return (
    <div className="space-y-8">
      {body}
      <Limitations items={limitations} />
    </div>
  );
}

function SocialLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {NETWORKS.map((n) => (
        <Panel key={n} title={NETWORK_LABEL[n]}>
          <LoadingRows rows={4} />
        </Panel>
      ))}
    </div>
  );
}

function SocialBody({
  posts,
  followers,
  postsFetchedAt,
  followersFetchedAt,
  connection,
  filter,
  onFilter,
  days,
  win,
}: {
  posts: MetricoolPosts | null;
  followers: MetricoolFollowers | null;
  postsFetchedAt: string | null;
  followersFetchedAt: string | null;
  connection: Connection;
  filter: NetworkFilter;
  onFilter: (next: NetworkFilter) => void;
  days: number;
  win: OsWindow;
}) {
  const postErrors = posts?.errors ?? [];
  const followerErrors = followers?.errors ?? [];
  const errors = [...postErrors, ...followerErrors];

  const synced = new Set<SocialNetwork>([
    ...(posts?.networks ?? []),
    ...(followers?.series ?? []).map((s) => s.network),
    ...errors.map((e) => e.network),
  ]);
  const networks = NETWORKS.filter((n) => synced.has(n));
  const shown =
    filter === "all" ? networks : networks.filter((n) => n === filter);

  const windowPosts = postsInWindow(
    posts?.posts ?? [],
    win.from.toISOString(),
    win.to.toISOString(),
  ).sort(newestFirst);
  const cardUpdatedAt = oldest(postsFetchedAt, followersFetchedAt);
  const unmappedKeys = posts?.unmapped_keys ?? [];

  return (
    <>
      <NetworkChips value={filter} onChange={onFilter} />

      <SyncNote fetchedAt={cardUpdatedAt} connection={connection} />

      {errors.length > 0 && (
        <Panel
          title="Problems in the last sync"
          subtitle="Metricool could not supply these. The figures below leave them out."
        >
          <ul className="flex flex-col items-start gap-2">
            {errors.map((e, i) => (
              <li key={`${e.network}-${i}`} className="max-w-full">
                <StatusPill tone="warn">{errorText(e)}</StatusPill>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {networks.length === 0 ? (
        <EmptyState
          title="No networks in the last sync"
          action={<PluginsButton />}
        >
          Metricool returned no Facebook, Instagram or TikTok accounts. Check
          the networks listed for Social media in Plugins.
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState
          title={`${filter === "all" ? "This network" : NETWORK_LABEL[filter]} is not in the sync`}
          action={<PluginsButton />}
        >
          Add it to the networks listed for Social media in Plugins, and connect
          it in Metricool.
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="social-accounts" className="space-y-3">
            <h2 id="social-accounts" className="text-lg font-semibold">
              Accounts
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {shown.map((n) => (
                <NetworkCard
                  key={n}
                  network={n}
                  points={followerPoints(followers, n)}
                  followersRead={followers !== null}
                  followersFailed={followerErrors.some((e) => e.network === n)}
                  posts={windowPosts.filter((p) => p.network === n)}
                  postsRead={posts !== null}
                  postsIncomplete={
                    postErrors.some((e) => e.network === n) ||
                    cutShort(posts, n, win.from.getTime())
                  }
                  days={days}
                  win={win}
                  updatedAt={cardUpdatedAt}
                />
              ))}
            </div>
          </section>

          <FollowerCharts
            networks={shown}
            followers={followers}
            fetchedAt={followersFetchedAt}
            days={days}
          />

          <section aria-labelledby="social-posts" className="space-y-3">
            <div>
              <h2 id="social-posts" className="text-lg font-semibold">
                Recent posts
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Posts published in the {win.label}, newest first.
              </p>
            </div>
            {posts === null ? (
              <EmptyState title="No posts in the last sync">
                The last sync read follower totals but no posts. The next hourly
                sync will try again.
              </EmptyState>
            ) : (
              <PostFeed
                key={`${filter}:${win.range}`}
                posts={windowPosts.filter((p) => shown.includes(p.network))}
                cutShort={shown.some((n) =>
                  cutShort(posts, n, win.from.getTime()),
                )}
              />
            )}
            <SourceLine
              source={{
                label: SOURCE,
                updatedAt: postsFetchedAt,
                window: win.label,
              }}
            />
          </section>
        </>
      )}

      {unmappedKeys.length > 0 && (
        <details className="rounded-lg border bg-muted/20 px-3 text-xs">
          <summary className="cursor-pointer select-none py-3 font-medium">
            Fields this dashboard does not read yet
          </summary>
          <p className="pb-3 text-muted-foreground">
            Metricool returned fields this dashboard does not read yet:{" "}
            <span className="break-words font-mono">
              {unmappedKeys.join(", ")}
            </span>
            . Use the list to check the mapping when a figure you expect is
            missing.
          </p>
        </details>
      )}
    </>
  );
}

function newestFirst(a: SocialPost, b: SocialPost): number {
  const ta = a.published_at ? Date.parse(a.published_at) : Number.NaN;
  const tb = b.published_at ? Date.parse(b.published_at) : Number.NaN;
  if (Number.isNaN(ta) || Number.isNaN(tb)) {
    return Number.isNaN(ta) ? (Number.isNaN(tb) ? 0 : 1) : -1;
  }
  return tb - ta;
}

/** Metricool messages start with what failed ("Instagram reels: ..."). */
function errorText(e: { network: SocialNetwork; message: string }): string {
  const label = NETWORK_LABEL[e.network] ?? e.network;
  return e.message.toLowerCase().startsWith(label.toLowerCase())
    ? e.message
    : `${label}: ${e.message}`;
}

// ---------------------------------------------------------------------------
// Filter chips
// ---------------------------------------------------------------------------

function NetworkChips({
  value,
  onChange,
}: {
  value: NetworkFilter;
  onChange: (next: NetworkFilter) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter by network"
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f.id)}
            className={cn(
              "h-10 min-w-[3rem] rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-foreground bg-foreground text-background"
                : "bg-background text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Network summary card
// ---------------------------------------------------------------------------

function NetworkCard({
  network,
  points,
  followersRead,
  followersFailed,
  posts,
  postsRead,
  postsIncomplete,
  days,
  win,
  updatedAt,
}: {
  network: SocialNetwork;
  points: FollowerPoint[];
  /** The last sync wrote a followers snapshot. */
  followersRead: boolean;
  followersFailed: boolean;
  /** This network's posts in the window, newest first. */
  posts: SocialPost[];
  /** The last sync wrote a posts snapshot. */
  postsRead: boolean;
  /** At least one of this network's post requests failed in the last sync. */
  postsIncomplete: boolean;
  days: number;
  win: OsWindow;
  updatedAt: string | null;
}) {
  const latest = points.length > 0 ? points[points.length - 1] : null;
  const change = followerChange(points, days);
  const interactions = totalInteractions(posts);
  const best = bestPost(posts);
  const source: SourceInfo = { label: SOURCE, updatedAt };

  let followersHint = "Metricool returned no totals";
  if (latest) followersHint = `On ${formatDay(latest.date)}`;
  else if (followersFailed) {
    followersHint = "Could not be read in the last sync";
  } else if (!followersRead) followersHint = "Not in the last sync";

  // A failed request leaves the count unknown, so a zero would mislead.
  const postsUnknown = !postsRead || (postsIncomplete && posts.length === 0);
  let postsHint = `In the ${win.label}`;
  if (!postsRead) postsHint = "Not in the last sync";
  else if (postsIncomplete) {
    postsHint =
      posts.length === 0
        ? "Could not be read in the last sync"
        : "Some posts could not be read";
  }

  let interactionsHint = "Likes, comments, shares and saves";
  if (postsUnknown) interactionsHint = "Posts could not be read";
  else if (posts.length === 0) interactionsHint = "No posts in this period";
  else if (interactions === null) {
    interactionsHint = "The network reported none for these posts";
  } else if (postsIncomplete) {
    interactionsHint = "From the posts that could be read";
  }

  return (
    <Panel title={NETWORK_LABEL[network]} source={source}>
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-4">
          <Stat
            label="Followers"
            value={latest ? formatInt(latest.value) : "–"}
            hint={followersHint}
          />
          <Stat
            label={`Change, ${days} days`}
            value={change ? formatSigned(change.change) : "–"}
            hint={
              change
                ? `Since ${formatDay(change.base.date)}`
                : latest
                  ? "Needs totals from two different days"
                  : undefined
            }
          />
          <Stat
            label="Posts"
            value={postsUnknown ? "–" : formatInt(posts.length)}
            hint={postsHint}
          />
          <Stat
            label="Interactions"
            value={
              postsUnknown || interactions === null
                ? "–"
                : formatInt(interactions)
            }
            hint={interactionsHint}
          />
        </dl>

        <div className="border-t pt-3">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Best post
          </h3>
          {best ? (
            <div className="mt-1 space-y-1">
              <p className="line-clamp-2 break-words text-sm">
                {best.post.text ?? (
                  <span className="text-muted-foreground">No caption</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatInt(best.interactions)}{" "}
                {best.interactions === 1 ? "interaction" : "interactions"} ·{" "}
                {formatDate(best.post.published_at)}
              </p>
              {best.post.url && (
                <OpenPostLink url={best.post.url} network={network} />
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              No post in this period has interaction figures.
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate text-xl font-semibold tabular-nums">{value}</dd>
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Followers per day
// ---------------------------------------------------------------------------

function FollowerCharts({
  networks,
  followers,
  fetchedAt,
  days,
}: {
  networks: SocialNetwork[];
  followers: MetricoolFollowers | null;
  fetchedAt: string | null;
  days: number;
}) {
  const charts = networks
    .map((n) => ({
      network: n,
      points: lastNDays(followerPoints(followers, n), days),
    }))
    .filter((c) => c.points.length > 0);
  if (charts.length === 0) return null;
  return (
    <section aria-labelledby="social-followers" className="space-y-3">
      <div>
        <h2 id="social-followers" className="text-lg font-semibold">
          Followers per day
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Total followers at the end of each day.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {charts.map(({ network, points }) => {
          const lastDay = points[points.length - 1].date;
          return (
            <Panel
              key={network}
              title={NETWORK_LABEL[network]}
              source={{
                label: SOURCE,
                updatedAt: fetchedAt,
                window: `${days} days to ${formatDay(lastDay)}`,
              }}
            >
              <DailyChart
                data={points.map((p) => ({ day: p.date, followers: p.value }))}
                series={[
                  { key: "followers", label: "Followers", color: "series1" },
                ]}
                format={formatInt}
                height={160}
                ariaLabel={`${NETWORK_LABEL[network]} followers per day, ${days} days to ${formatDay(lastDay)}`}
              />
            </Panel>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Recent posts
// ---------------------------------------------------------------------------

function PostFeed({
  posts,
  cutShort,
}: {
  posts: SocialPost[];
  cutShort: boolean;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed bg-muted/30 p-5 text-center text-xs text-muted-foreground">
        No posts in this period.
      </p>
    );
  }
  const shown = posts.slice(0, visible);
  return (
    <div className="space-y-3">
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((post) => (
          <li key={`${post.network}:${post.id}`} className="min-w-0">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Showing {formatInt(shown.length)} of {formatInt(posts.length)}{" "}
          {posts.length === 1 ? "post" : "posts"}
          {cutShort &&
            ". The sync keeps the newest posts only, so the oldest in this period are missing"}
        </p>
        {visible < posts.length && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Show more
          </Button>
        )}
      </div>
    </div>
  );
}

const METRIC_CHIPS: {
  key: keyof SocialPost["metrics"];
  label: string;
  format: (n: number) => string;
}[] = [
  { key: "likes", label: "Likes", format: formatInt },
  { key: "comments", label: "Comments", format: formatInt },
  { key: "shares", label: "Shares", format: formatInt },
  { key: "saves", label: "Saves", format: formatInt },
  { key: "reach", label: "Reach", format: formatInt },
  { key: "views", label: "Views", format: formatInt },
  {
    key: "engagement",
    label: "Engagement",
    format: (n) => `${percentFmt.format(n)}%`,
  },
];

function PostCard({ post }: { post: SocialPost }) {
  const [imageFailed, setImageFailed] = useState(false);
  const metrics = METRIC_CHIPS.flatMap((m) => {
    const value = post.metrics?.[m.key];
    return typeof value === "number" && Number.isFinite(value)
      ? [{ ...m, value }]
      : [];
  });
  return (
    <article className="flex h-full min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex min-w-0 items-start gap-3">
        {post.image_url && !imageFailed && (
          <img
            src={post.image_url}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-16 w-16 shrink-0 rounded-md border object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="rounded-full border bg-muted px-2 py-0.5 font-medium">
              {NETWORK_LABEL[post.network] ?? post.network}
            </span>
            <span className="text-muted-foreground">
              {POST_TYPE_LABEL[post.type] ?? post.type}
            </span>
            <time
              dateTime={post.published_at ?? undefined}
              className="text-muted-foreground"
            >
              {formatDate(post.published_at)}
            </time>
          </div>
          <p className="mt-1.5 line-clamp-3 break-words text-sm">
            {post.text ?? (
              <span className="text-muted-foreground">No caption</span>
            )}
          </p>
        </div>
      </div>

      {metrics.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Post figures">
          {metrics.map((m) => (
            <li
              key={m.key}
              className="rounded-md bg-muted px-2 py-1 text-xs tabular-nums"
            >
              <span className="text-muted-foreground">{m.label}</span>{" "}
              <span className="font-medium">{m.format(m.value)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          The network reported no figures for this post.
        </p>
      )}

      {post.url && (
        <div className="mt-auto">
          <OpenPostLink url={post.url} network={post.network} />
        </div>
      )}
    </article>
  );
}

function OpenPostLink({
  url,
  network,
}: {
  url: string;
  network: SocialNetwork;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline"
    >
      Open post
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">
        {" "}
        on {NETWORK_LABEL[network] ?? network} (opens in a new tab)
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function PluginsButton() {
  return (
    <Button asChild variant="outline" size="sm" className="h-10">
      <Link to="/control/plugins">Open Plugins</Link>
    </Button>
  );
}

function NotSyncedState({ connection }: { connection: Connection }) {
  const needs =
    "It needs a Metricool API token, and Metricool's API needs the Advanced or Custom plan. Plugins already holds the user and brand IDs for the Myhealth Checkup brand.";
  const copy: Record<Connection, { title: string; body: string }> = {
    not_connected: {
      title: "Social media is not connected",
      body: `Connect Metricool in Plugins. ${needs}`,
    },
    unknown: {
      title: "No social media data yet",
      body: `Connect Metricool in Plugins, or run a sync there if it is already connected. ${needs}`,
    },
    off: {
      title: "Social media is turned off",
      body: "Turn Social media (Metricool) on in Plugins. Figures appear here after the next sync.",
    },
    connected: {
      title: "Social media has not synced yet",
      body: "Metricool is connected. Run a sync in Plugins, or wait for the hourly sync.",
    },
  };
  const { title, body } = copy[connection];
  return (
    <EmptyState title={title} action={<PluginsButton />}>
      {body}
    </EmptyState>
  );
}

/** Warns when the figures shown may be out of date. */
function SyncNote({
  fetchedAt,
  connection,
}: {
  fetchedAt: string | null;
  connection: Connection;
}) {
  const notes: string[] = [];
  if (connection === "off") {
    notes.push(
      "Social media is turned off in Plugins. These figures come from its last sync.",
    );
  } else if (connection === "not_connected") {
    notes.push(
      "Social media is missing a setting or credential in Plugins. These figures come from its last sync.",
    );
  }
  const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : Number.NaN;
  if (Number.isFinite(fetchedMs) && Date.now() - fetchedMs > STALE_AFTER_MS) {
    notes.push(
      `Last synced ${formatAgo(fetchedAt)}. The sync runs every hour, so check the sync log in Plugins.`,
    );
  }
  if (notes.length === 0) return null;
  return (
    <ul className="flex flex-col items-start gap-2">
      {notes.map((note) => (
        <li key={note} className="max-w-full">
          <StatusPill tone="warn">{note}</StatusPill>
        </li>
      ))}
    </ul>
  );
}
