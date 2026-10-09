// Pure request builders and response parsers for the Metricool adapter.
// Metricool does not document its post field names, so posts are read
// through ordered lists of candidate keys and any field the mapping does not
// know is reported back for checking. No runtime APIs and only relative pure
// imports, so vitest and the Deno edge function load the same code.
import type {
  MetricoolFollowers,
  MetricoolPosts,
  SocialNetwork,
  SocialPost,
} from "../../_shared/os/contract.ts";

export const METRICOOL_API_BASE = "https://app.metricool.com/api";
/** Days of posts and follower totals each sync reads, today included. */
export const METRICOOL_DAYS = 90;
export const METRICOOL_MAX_POSTS = 200;
export const METRICOOL_MAX_UNMAPPED_KEYS = 40;
export const METRICOOL_NETWORKS: readonly SocialNetwork[] = [
  "facebook",
  "instagram",
  "tiktok",
];

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** Timeline metric that holds each network's follower total. */
export const FOLLOWER_METRICS: Record<SocialNetwork, string> = {
  facebook: "pageFollows",
  instagram: "followers",
  tiktok: "followers_count",
};

const TEXT_MAX = 1000;
const ID_MAX = 200;
const URL_MAX = 2000;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export type MetricoolIds = { userId: string; blogId: string };

export type MetricoolIdResult =
  { ok: true; id: string } | { ok: false; message: string };

/** Metricool user and brand ids are whole numbers. */
export function parseMetricoolId(
  raw: string,
  label: string,
): MetricoolIdResult {
  const id = raw.trim();
  if (/^\d+$/.test(id)) return { ok: true, id };
  return {
    ok: false,
    message: `${label} must be numbers only. Copy it from Metricool's address bar.`,
  };
}

export function parseMetricoolNetworks(values: readonly string[]): {
  networks: SocialNetwork[];
  unknown: string[];
} {
  const networks: SocialNetwork[] = [];
  const unknown: string[] = [];
  for (const raw of values) {
    const value = raw.trim().toLowerCase();
    if (value === "") continue;
    const known = METRICOOL_NETWORKS.find((n) => n === value);
    if (known) {
      if (!networks.includes(known)) networks.push(known);
    } else if (!unknown.includes(raw.trim())) {
      unknown.push(raw.trim());
    }
  }
  return { networks, unknown };
}

// ---------------------------------------------------------------------------
// Dates and time zones
// ---------------------------------------------------------------------------

const ZONE_FORMATS = new Map<string, Intl.DateTimeFormat>();

function zoneFormat(timeZone: string): Intl.DateTimeFormat {
  let format = ZONE_FORMATS.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    ZONE_FORMATS.set(timeZone, format);
  }
  return format;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (timeZone.trim() === "") return false;
  try {
    zoneFormat(timeZone);
    return true;
  } catch {
    return false;
  }
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function zonedParts(at: Date, timeZone: string): ZonedParts {
  const parts: Record<string, string> = {};
  for (const p of zoneFormat(timeZone).formatToParts(at)) {
    parts[p.type] = p.value;
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Some engines print midnight as 24 even with h23.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

/** The calendar date in the time zone as YYYY-MM-DD. */
export function zonedDate(at: Date, timeZone: string): string {
  const p = zonedParts(at, timeZone);
  return `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}`;
}

/** Offset of the time zone from UTC at the instant, in minutes. */
export function zoneOffsetMinutes(at: Date, timeZone: string): number {
  const p = zonedParts(at, timeZone);
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    p.minute,
    p.second,
  );
  const wholeSeconds = Math.floor(at.getTime() / 1000) * 1000;
  return Math.round((asUtc - wholeSeconds) / 60_000);
}

/** The instant a wall-clock time (YYYY-MM-DD, HH:MM:SS) shows in the time zone. */
export function wallTimeToInstant(
  date: string,
  time: string,
  timeZone: string,
): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, ss || 0);
  // Two passes settle the offset across a clock change.
  let t = guess - zoneOffsetMinutes(new Date(guess), timeZone) * 60_000;
  t = guess - zoneOffsetMinutes(new Date(t), timeZone) * 60_000;
  return new Date(t);
}

/** "+01:00" for 60, "-05:30" for -330. */
export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** "2026-07-12T00:00:00+01:00": the wall time with the zone's offset at that moment. */
export function zonedDateTimeWithOffset(
  date: string,
  time: string,
  timeZone: string,
): string {
  const instant = wallTimeToInstant(date, time, timeZone);
  return `${date}T${time}${formatOffset(zoneOffsetMinutes(instant, timeZone))}`;
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** First and last calendar day (YYYY-MM-DD) of the period a sync reads. */
export type MetricoolWindow = { from: string; to: string };

/** The last `days` calendar days in the time zone, today included. */
export function metricoolWindow(
  now: Date,
  timeZone: string,
  days: number = METRICOOL_DAYS,
): MetricoolWindow {
  const to = zonedDate(now, timeZone);
  return { from: addDays(to, -(days - 1)), to };
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export type MetricoolPostEndpoint = {
  network: SocialNetwork;
  kind: "posts" | "reels";
  type: SocialPost["type"];
  /** For messages, e.g. "Instagram reels". */
  label: string;
};

/** Posts for every network, plus reels for Facebook and Instagram. */
export function metricoolPostEndpoints(
  networks: readonly SocialNetwork[],
): MetricoolPostEndpoint[] {
  const out: MetricoolPostEndpoint[] = [];
  for (const network of networks) {
    const name = NETWORK_LABELS[network];
    if (network === "tiktok") {
      out.push({
        network,
        kind: "posts",
        type: "video",
        label: `${name} videos`,
      });
      continue;
    }
    out.push({ network, kind: "posts", type: "post", label: `${name} posts` });
    out.push({ network, kind: "reels", type: "reel", label: `${name} reels` });
  }
  return out;
}

export function metricoolPostsUrl(
  endpoint: MetricoolPostEndpoint,
  window: MetricoolWindow,
  ids: MetricoolIds,
): string {
  const params = new URLSearchParams({
    from: `${window.from}T00:00:00`,
    to: `${window.to}T23:59:59`,
    blogId: ids.blogId,
    userId: ids.userId,
  });
  return `${METRICOOL_API_BASE}/v2/analytics/${endpoint.kind}/${endpoint.network}?${params}`;
}

export function metricoolTimelineUrl(
  network: SocialNetwork,
  window: MetricoolWindow,
  timeZone: string,
  ids: MetricoolIds,
): string {
  const params = new URLSearchParams({
    blogId: ids.blogId,
    userId: ids.userId,
    from: zonedDateTimeWithOffset(window.from, "00:00:00", timeZone),
    to: zonedDateTimeWithOffset(window.to, "23:59:59", timeZone),
    timezone: timeZone,
    metric: FOLLOWER_METRICS[network],
    subject: "account",
    network,
  });
  return `${METRICOOL_API_BASE}/v2/analytics/timelines?${params}`;
}

/** The brand list, used by the connection test. */
export function metricoolProfilesUrl(ids: MetricoolIds): string {
  const params = new URLSearchParams({
    userId: ids.userId,
    blogId: ids.blogId,
  });
  return `${METRICOOL_API_BASE}/admin/simpleProfiles?${params}`;
}

/** Plain explanation for statuses that need action, null for the rest. */
export function metricoolStatusMessage(status: number): string | null {
  if (status === 401 || status === 403) {
    return `Metricool refused the request (${status}). Check the API token in Plugins, and that the Metricool account is on the Advanced or Custom plan, which the API needs.`;
  }
  if (status === 429) {
    return "Metricool is limiting requests (429). The next hourly sync will try again.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Reading values
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Lower-cased key to the object's own spelling (first one wins). */
function keyIndex(item: Record<string, unknown>): Map<string, string> {
  const index = new Map<string, string>();
  for (const key of Object.keys(item)) {
    const lower = key.toLowerCase();
    if (!index.has(lower)) index.set(lower, key);
  }
  return index;
}

function field(
  item: Record<string, unknown>,
  index: Map<string, string>,
  name: string,
): unknown {
  const key = index.get(name.toLowerCase());
  return key === undefined ? undefined : item[key];
}

/** First candidate key whose value reads as non-null. */
function pick<T>(
  item: Record<string, unknown>,
  index: Map<string, string>,
  candidates: readonly string[],
  read: (value: unknown) => T | null,
): T | null {
  for (const name of candidates) {
    const value = field(item, index, name);
    if (value === undefined || value === null) continue;
    const out = read(value);
    if (out !== null) return out;
  }
  return null;
}

/** Inner keys that hold the real value when Metricool wraps one in an object. */
const WRAPPER_KEYS = ["value", "count", "total", "url", "href"];

function unwrap(value: unknown, depth = 0): unknown {
  if (!isRecord(value) || depth > 2) return value;
  const index = keyIndex(value);
  for (const name of WRAPPER_KEYS) {
    const inner = field(value, index, name);
    if (inner !== undefined && inner !== null) return unwrap(inner, depth + 1);
  }
  return value;
}

const NUMERIC = /^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;
const GROUPED = /^-?\d{1,3}(,\d{3})+(\.\d+)?$/;

/** A finite number from a number or numeric string ("1,234", "4.5%"); else null. */
export function readMetricoolNumber(raw: unknown): number | null {
  const value = unwrap(raw);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  let text = value.trim();
  if (text.endsWith("%")) text = text.slice(0, -1).trim();
  if (GROUPED.test(text)) text = text.replace(/,/g, "");
  if (!NUMERIC.test(text)) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

/** Counts and rates cannot be negative; a negative value means "not available". */
function readMetric(raw: unknown): number | null {
  const n = readMetricoolNumber(raw);
  return n === null || n < 0 ? null : n;
}

function readId(raw: unknown): string | null {
  const value = unwrap(raw);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return null;
  const id = value.trim();
  return id === "" || id.length > ID_MAX ? null : id;
}

function readText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  if (text === "") return null;
  const chars = Array.from(text);
  return chars.length > TEXT_MAX
    ? `${chars.slice(0, TEXT_MAX - 1).join("")}…`
    : text;
}

function readUrl(raw: unknown): string | null {
  const value = unwrap(raw);
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length > URL_MAX || !/^https?:\/\//i.test(text)) return null;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? text : null;
  } catch {
    return null;
  }
}

const MIN_INSTANT = Date.UTC(2000, 0, 1);
const MAX_INSTANT = Date.UTC(2100, 0, 1);

function isoInstant(ms: number): string | null {
  if (!Number.isFinite(ms) || ms < MIN_INSTANT || ms >= MAX_INSTANT) {
    return null;
  }
  return new Date(ms).toISOString();
}

/** Unix seconds below 1e11, milliseconds above. */
function fromEpoch(n: number): string | null {
  return isoInstant(n < 1e11 ? n * 1000 : n);
}

const DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;

function validCalendarDate(y: number, m: number, d: number): boolean {
  const t = new Date(Date.UTC(y, m - 1, d));
  return (
    t.getUTCFullYear() === y &&
    t.getUTCMonth() === m - 1 &&
    t.getUTCDate() === d
  );
}

/**
 * An ISO-style date-time string as a UTC instant. Strings without an offset
 * are wall-clock times in `timeZone`.
 */
export function parseZonedDateTime(
  text: string,
  timeZone: string,
): string | null {
  const m = DATE_TIME.exec(text.trim());
  if (!m) {
    // Other formats only when they name their own zone.
    if (!/(GMT|UTC|[+-]\d{4})/i.test(text)) return null;
    return isoInstant(Date.parse(text));
  }
  const [, ys, ms, ds, hs = "00", mins = "00", ss = "00", frac, offset] = m;
  const y = Number(ys);
  const mo = Number(ms);
  const d = Number(ds);
  const h = Number(hs);
  const mi = Number(mins);
  const s = Number(ss);
  if (!validCalendarDate(y, mo, d) || h > 23 || mi > 59 || s > 59) return null;
  const millis = frac ? Math.round(Number(`0.${frac}`) * 1000) : 0;
  if (offset) {
    let offsetMinutes = 0;
    if (offset.toUpperCase() !== "Z") {
      const sign = offset.startsWith("-") ? -1 : 1;
      const digits = offset.slice(1).replace(":", "");
      offsetMinutes =
        sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
    }
    const utc =
      Date.UTC(y, mo - 1, d, h, mi, s) + millis - offsetMinutes * 60_000;
    return isoInstant(utc);
  }
  const instant = wallTimeToInstant(
    `${ys}-${ms}-${ds}`,
    `${hs}:${mins}:${ss}`,
    timeZone,
  );
  return isoInstant(instant.getTime() + millis);
}

const INSTANT_KEYS = ["dateTime", "date", "value", "timestamp"];

/**
 * A timestamp as an ISO UTC instant: unix seconds or milliseconds (number or
 * string), an ISO string, or an object such as { dateTime, timezone }.
 */
export function readMetricoolInstant(
  raw: unknown,
  timeZone: string,
  depth = 0,
): string | null {
  if (isRecord(raw)) {
    if (depth > 2) return null;
    const index = keyIndex(raw);
    const zone = field(raw, index, "timezone");
    const tz =
      typeof zone === "string" && isValidTimeZone(zone) ? zone : timeZone;
    for (const name of INSTANT_KEYS) {
      const inner = field(raw, index, name);
      if (inner === undefined || inner === null) continue;
      const out = readMetricoolInstant(inner, tz, depth + 1);
      if (out !== null) return out;
    }
    return null;
  }
  if (typeof raw === "number") return fromEpoch(raw);
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  if (text === "") return null;
  if (/^\d+(\.\d+)?$/.test(text)) return fromEpoch(Number(text));
  return parseZonedDateTime(text, timeZone);
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

/** Candidate source keys for each SocialPost field, in order of preference. */
export const POST_FIELD_CANDIDATES = {
  id: ["id", "postId", "reelId", "videoId", "mediaId", "uuid"],
  published_at: [
    "publishedAt",
    "published",
    "created",
    "createdAt",
    "date",
    "timestamp",
  ],
  text: ["text", "content", "caption", "message", "description", "title"],
  url: ["url", "link", "permalink", "shareUrl"],
  image_url: [
    "picture",
    "imageUrl",
    "image",
    "thumbnailUrl",
    "thumbnail",
    "mediaUrl",
    "cover",
  ],
  likes: ["likes", "likeCount", "reactions", "diggCount"],
  comments: ["comments", "commentsCount", "commentCount"],
  shares: ["shares", "shareCount", "reposts"],
  saves: ["saved", "saves", "saveCount"],
  reach: ["reach", "reachCount", "impressionsUnique"],
  impressions: ["impressions", "impressionCount"],
  views: [
    "views",
    "videoViews",
    "videoviews",
    "plays",
    "viewCount",
    "blue_reels_play_count",
  ],
  engagement: ["engagement", "engagementRate"],
} as const;

const KNOWN_KEYS = new Set(
  Object.values(POST_FIELD_CANDIDATES).flatMap((keys) =>
    keys.map((k) => k.toLowerCase()),
  ),
);

const SHAPE_ERROR =
  "Metricool answered in a shape the sync does not recognise.";

/** The items of a list answer: a top-level array or { data: [...] }. */
export function metricoolItems(res: unknown): Record<string, unknown>[] {
  if (res === null || res === undefined) return [];
  let list: unknown;
  if (Array.isArray(res)) {
    list = res;
  } else if (isRecord(res)) {
    const index = keyIndex(res);
    if (!index.has("data")) throw new Error(SHAPE_ERROR);
    list = field(res, index, "data");
    if (list === null || list === undefined) return [];
    if (!Array.isArray(list)) throw new Error(SHAPE_ERROR);
  } else {
    throw new Error(SHAPE_ERROR);
  }
  return (list as unknown[]).filter(isRecord);
}

/** 32-bit FNV-1a, as 8 hex characters. Stable across runs and runtimes. */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function fallbackId(
  network: SocialNetwork,
  publishedAt: string | null,
  url: string | null,
  text: string | null,
): string {
  const parts: string[] = [network, publishedAt ?? "", url ?? ""];
  // Without a date or address the text is all that tells posts apart.
  if (publishedAt === null && url === null) parts.push(text ?? "");
  return `${network}-${fnv1a(parts.join("|"))}`;
}

export function normaliseMetricoolPost(
  item: Record<string, unknown>,
  endpoint: Pick<MetricoolPostEndpoint, "network" | "type">,
  timeZone: string,
): SocialPost {
  const index = keyIndex(item);
  const c = POST_FIELD_CANDIDATES;
  const published_at = pick(item, index, c.published_at, (v) =>
    readMetricoolInstant(v, timeZone),
  );
  const text = pick(item, index, c.text, readText);
  const url = pick(item, index, c.url, readUrl);
  const id =
    pick(item, index, c.id, readId) ??
    fallbackId(endpoint.network, published_at, url, text);
  return {
    network: endpoint.network,
    id,
    published_at,
    text,
    url,
    image_url: pick(item, index, c.image_url, readUrl),
    type: endpoint.type,
    metrics: {
      likes: pick(item, index, c.likes, readMetric),
      comments: pick(item, index, c.comments, readMetric),
      shares: pick(item, index, c.shares, readMetric),
      saves: pick(item, index, c.saves, readMetric),
      reach: pick(item, index, c.reach, readMetric),
      impressions: pick(item, index, c.impressions, readMetric),
      views: pick(item, index, c.views, readMetric),
      engagement: pick(item, index, c.engagement, readMetric),
    },
  };
}

/** Top-level keys of an item that no candidate list covers. */
export function unmappedPostKeys(item: Record<string, unknown>): string[] {
  return Object.keys(item).filter((k) => !KNOWN_KEYS.has(k.toLowerCase()));
}

export type MetricoolPostBatch = {
  posts: SocialPost[];
  /** Unmapped keys of the endpoint's first item. */
  unmappedKeys: string[];
};

/** One endpoint's answer as posts, plus the first item's unmapped keys. */
export function parseMetricoolPosts(
  res: unknown,
  endpoint: Pick<MetricoolPostEndpoint, "network" | "type">,
  timeZone: string,
): MetricoolPostBatch {
  const items = metricoolItems(res);
  return {
    posts: items.map((item) =>
      normaliseMetricoolPost(item, endpoint, timeZone),
    ),
    unmappedKeys: items.length > 0 ? unmappedPostKeys(items[0]) : [],
  };
}

function newestFirst(a: SocialPost, b: SocialPost): number {
  if (a.published_at !== b.published_at) {
    if (a.published_at === null) return 1;
    if (b.published_at === null) return -1;
    return a.published_at < b.published_at ? 1 : -1;
  }
  if (a.network !== b.network) return a.network < b.network ? -1 : 1;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
}

/**
 * Joins the endpoint batches: one entry per network and id (a reel wins over
 * the same item listed as a post, since it carries play counts), newest
 * first, at most METRICOOL_MAX_POSTS.
 */
export function buildMetricoolPosts(
  networks: readonly SocialNetwork[],
  batches: readonly MetricoolPostBatch[],
  errors: MetricoolPosts["errors"],
): MetricoolPosts {
  const byKey = new Map<string, SocialPost>();
  const unmapped = new Set<string>();
  for (const batch of batches) {
    for (const key of batch.unmappedKeys) unmapped.add(key);
    for (const post of batch.posts) {
      const key = `${post.network}\u0000${post.id}`;
      const existing = byKey.get(key);
      if (!existing || (existing.type !== "reel" && post.type === "reel")) {
        byKey.set(key, post);
      }
    }
  }
  return {
    networks: [...networks],
    posts: [...byKey.values()].sort(newestFirst).slice(0, METRICOOL_MAX_POSTS),
    unmapped_keys: [...unmapped].sort().slice(0, METRICOOL_MAX_UNMAPPED_KEYS),
    errors: [...errors],
  };
}

// ---------------------------------------------------------------------------
// Follower timelines
// ---------------------------------------------------------------------------

function timelinePoints(res: unknown): unknown[] {
  let items: unknown[];
  if (res === null || res === undefined) return [];
  if (Array.isArray(res)) {
    items = res;
  } else if (isRecord(res)) {
    const data = field(res, keyIndex(res), "data");
    if (data === null || data === undefined) return [];
    if (!Array.isArray(data)) throw new Error(SHAPE_ERROR);
    items = data;
  } else {
    throw new Error(SHAPE_ERROR);
  }
  let empty: unknown[] | null = null;
  for (const item of items) {
    if (!isRecord(item)) continue;
    const values = field(item, keyIndex(item), "values");
    if (!Array.isArray(values)) continue;
    if (values.length > 0) return values;
    empty ??= values;
  }
  if (empty) return empty;
  // Some answers list the points directly.
  const direct = items.filter(
    (item) => isRecord(item) && keyIndex(item).has("datetime"),
  );
  return direct;
}

/**
 * Daily follower totals from a timelines answer, oldest first. Each point's
 * dateTime carries an offset; it is placed on its calendar date in
 * `timeZone`. When several points land on one date the latest one stays.
 * Points without a usable date or a non-negative value are left out.
 */
export function parseMetricoolTimeline(
  res: unknown,
  timeZone: string,
): { date: string; value: number }[] {
  const points: { at: string; order: number; value: number }[] = [];
  timelinePoints(res).forEach((raw, order) => {
    if (!isRecord(raw)) return;
    const index = keyIndex(raw);
    const at = pick(raw, index, ["dateTime", "date", "timestamp"], (v) =>
      readMetricoolInstant(v, timeZone),
    );
    const value = readMetric(field(raw, index, "value"));
    if (at === null || value === null) return;
    points.push({ at, order, value });
  });
  points.sort((a, b) =>
    a.at === b.at ? a.order - b.order : a.at < b.at ? -1 : 1,
  );
  const byDate = new Map<string, number>();
  for (const p of points) {
    byDate.set(zonedDate(new Date(p.at), timeZone), p.value);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, value]) => ({ date, value }));
}

export function buildMetricoolFollowers(
  series: MetricoolFollowers["series"],
  errors: MetricoolFollowers["errors"],
): MetricoolFollowers {
  return { series: [...series], errors: [...errors] };
}

// ---------------------------------------------------------------------------
// Connection test
// ---------------------------------------------------------------------------

export type MetricoolProfileCheck = { ok: boolean; message: string };

/** Reads the brand list and checks the configured brand is on it. */
export function describeMetricoolProfiles(
  res: unknown,
  blogId: string,
): MetricoolProfileCheck {
  let items: Record<string, unknown>[];
  if (isRecord(res) && !keyIndex(res).has("data")) {
    items = [res];
  } else {
    items = metricoolItems(res);
  }
  if (items.length === 0) {
    return {
      ok: false,
      message:
        "Metricool accepted the token but listed no brands. Check the user ID and brand ID.",
    };
  }
  let anyId = false;
  for (const item of items) {
    const index = keyIndex(item);
    const ids = ["id", "blogId"]
      .map((name) => readId(field(item, index, name)))
      .filter((id): id is string => id !== null);
    if (ids.length === 0) continue;
    anyId = true;
    if (!ids.includes(blogId)) continue;
    const label = pick(
      item,
      index,
      ["label", "title", "name", "brandName"],
      readText,
    );
    return {
      ok: true,
      message: label
        ? `Metricool brand found: ${label}`
        : "Metricool brand found",
    };
  }
  if (anyId) {
    const noun = items.length === 1 ? "brand" : "brands";
    return {
      ok: false,
      message: `Metricool accepted the token, but brand ID ${blogId} is not among the ${items.length} ${noun} it lists. Check the brand ID.`,
    };
  }
  if (items.length === 1) return { ok: true, message: "Metricool brand found" };
  return {
    ok: true,
    message: `Metricool accepted the token and listed ${items.length} brands`,
  };
}
