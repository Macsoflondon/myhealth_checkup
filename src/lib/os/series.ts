/**
 * Pure helpers for the Traffic and Social sections of the AI OS dashboard:
 * sums over daily rows, impression-weighted search position, ratios,
 * follower change and post windows. No imports and no runtime APIs, so
 * vitest and plain node load the file as it is.
 */

const DAY_MS = 86_400_000;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Keys of T whose values are numbers (or missing). */
export type NumericKeys<T> = {
  [P in keyof T]-?: T[P] extends number | null | undefined ? P : never;
}[keyof T];

/**
 * Sum of one numeric field across rows. Null, missing and non-finite values
 * are skipped, so an empty list sums to 0.
 */
export function sumBy<T, K extends keyof T & NumericKeys<T>>(
  rows: readonly T[],
  key: K,
): number {
  let total = 0;
  for (const row of rows) {
    const value = row[key] as unknown;
    if (typeof value === "number" && Number.isFinite(value)) total += value;
  }
  return total;
}

/** part / whole, or null when the whole is zero, negative or not a number. */
export function ratio(part: number, whole: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
    return null;
  }
  return part / whole;
}

/** Click-through rate (0 to 1): clicks / impressions, null without impressions. */
export function ctr(clicks: number, impressions: number): number | null {
  return ratio(clicks, impressions);
}

/**
 * Search position averaged over impressions, the way Search Console totals
 * it: sum(position * impressions) / sum(impressions). Rows without
 * impressions carry no weight. Null when no row has impressions.
 */
export function weightedPosition(
  rows: readonly { position: number; impressions: number }[],
): number | null {
  let weight = 0;
  let weighted = 0;
  for (const row of rows) {
    const { position, impressions } = row;
    if (!Number.isFinite(position) || !Number.isFinite(impressions)) continue;
    if (impressions <= 0) continue;
    weight += impressions;
    weighted += position * impressions;
  }
  return weight > 0 ? weighted / weight : null;
}

/** Days since 1970-01-01 for a YYYY-MM-DD date, NaN when it is not one. */
export function dayNumber(isoDate: string): number {
  const m = ISO_DAY.exec(isoDate);
  if (!m) return Number.NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const t = Date.UTC(y, mo - 1, d);
  const check = new Date(t);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== mo - 1 ||
    check.getUTCDate() !== d
  ) {
    return Number.NaN;
  }
  return t / DAY_MS;
}

/**
 * Calendar days a daily series covers, first to last day inclusive. 0 for an
 * empty series. Gaps inside the series still count as covered days.
 */
export function daySpan(rows: readonly { date: string }[]): number {
  let first = Number.POSITIVE_INFINITY;
  let last = Number.NEGATIVE_INFINITY;
  for (const row of rows) {
    const n = dayNumber(row.date);
    if (Number.isNaN(n)) continue;
    if (n < first) first = n;
    if (n > last) last = n;
  }
  return Number.isFinite(first) ? last - first + 1 : 0;
}

export type FollowerPoint = { date: string; value: number };

export type FollowerChange = {
  /** The newest point. */
  latest: FollowerPoint;
  /** The point the change is measured from. */
  base: FollowerPoint;
  /** latest.value - base.value */
  change: number;
  /** Calendar days from base to latest. */
  days: number;
};

/**
 * Follower change over `days`: the newest point against the earlier point
 * closest to `days` days before it. When two points are equally close, the
 * earlier one wins. Null with fewer than two usable points on different
 * days. The caller shows base.date, since a short series gives a shorter
 * span than asked for.
 */
export function followerChange(
  points: readonly FollowerPoint[],
  days: number,
): FollowerChange | null {
  const usable = points
    .map((p) => ({ point: p, day: dayNumber(p.date) }))
    .filter((p) => !Number.isNaN(p.day) && Number.isFinite(p.point.value))
    .sort((a, b) => a.day - b.day);
  if (usable.length < 2) return null;
  const latest = usable[usable.length - 1];
  const target = latest.day - days;
  let base: (typeof usable)[number] | null = null;
  for (const p of usable) {
    if (p.day >= latest.day) break;
    if (
      base === null ||
      Math.abs(p.day - target) < Math.abs(base.day - target)
    ) {
      base = p;
    }
  }
  if (base === null) return null;
  return {
    latest: latest.point,
    base: base.point,
    change: latest.point.value - base.point.value,
    days: latest.day - base.day,
  };
}

/**
 * Posts published from `fromIso` (inclusive) to `toIso` (exclusive), in
 * their original order. Posts without a usable date are left out.
 */
export function postsInWindow<T extends { published_at: string | null }>(
  posts: readonly T[],
  fromIso: string,
  toIso: string,
): T[] {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (Number.isNaN(from) || Number.isNaN(to)) return [];
  return posts.filter((p) => {
    if (!p.published_at) return false;
    const t = Date.parse(p.published_at);
    return !Number.isNaN(t) && t >= from && t < to;
  });
}

export type InteractionMetrics = {
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
};

/**
 * Likes + comments + shares + saves, counting only the figures the network
 * reported. Null when it reported none of them.
 */
export function postInteractions(post: {
  metrics: InteractionMetrics;
}): number | null {
  const m = post.metrics;
  let total: number | null = null;
  for (const value of [m.likes, m.comments, m.shares, m.saves]) {
    if (typeof value === "number" && Number.isFinite(value)) {
      total = (total ?? 0) + value;
    }
  }
  return total;
}

/** Interactions across posts. Null when no post reported any. */
export function totalInteractions(
  posts: readonly { metrics: InteractionMetrics }[],
): number | null {
  let total: number | null = null;
  for (const post of posts) {
    const n = postInteractions(post);
    if (n !== null) total = (total ?? 0) + n;
  }
  return total;
}

/**
 * The post with the most interactions, with its count. On a tie the one
 * listed first wins (newest, for a newest-first list). Null when no post
 * reported interactions.
 */
export function bestPost<T extends { metrics: InteractionMetrics }>(
  posts: readonly T[],
): { post: T; interactions: number } | null {
  let best: { post: T; interactions: number } | null = null;
  for (const post of posts) {
    const n = postInteractions(post);
    if (n === null) continue;
    if (best === null || n > best.interactions) {
      best = { post, interactions: n };
    }
  }
  return best;
}
