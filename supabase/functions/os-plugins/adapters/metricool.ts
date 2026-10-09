// Metricool adapter: the last 90 days of posts and reels with their metrics,
// and daily follower totals, for the Facebook, Instagram and TikTok accounts
// of one Metricool brand. A network or endpoint that fails is recorded in the
// payload's errors and the rest still sync; the sync fails only when every
// call fails. Request shapes and parsing live in metricool-normalise.ts
// (pure, tested).
import type {
  MetricoolFollowers,
  MetricoolPosts,
  SocialNetwork,
} from "../../_shared/os/contract.ts";
import { HttpError, redact } from "../lib/http.ts";
import {
  buildMetricoolFollowers,
  buildMetricoolPosts,
  describeMetricoolProfiles,
  FOLLOWER_METRICS,
  isValidTimeZone,
  METRICOOL_DAYS,
  METRICOOL_MAX_POSTS,
  metricoolPostEndpoints,
  metricoolPostsUrl,
  metricoolProfilesUrl,
  metricoolStatusMessage,
  metricoolTimelineUrl,
  metricoolWindow,
  NETWORK_LABELS,
  parseMetricoolId,
  parseMetricoolNetworks,
  parseMetricoolPosts,
  parseMetricoolTimeline,
  type MetricoolIds,
  type MetricoolPostBatch,
} from "./metricool-normalise.ts";
import {
  ConfigError,
  requireString,
  stringList,
  type AdapterContext,
  type AdapterResult,
  type PluginAdapter,
} from "./types.ts";

const TOKEN_KEY = "METRICOOL_USER_TOKEN";
const REQUEST_TIMEOUT_MS = 15_000;
/** Calls in flight at once. Eight calls in three waves fit the 60 s sync limit. */
const CONCURRENCY = 3;
const ERROR_MAX = 300;

type Settings = {
  ids: MetricoolIds;
  timeZone: string;
  networks: SocialNetwork[];
  token: string;
  warnings: string[];
};

function idFrom(
  config: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const parsed = parseMetricoolId(requireString(config, key, label), label);
  if (!parsed.ok) throw new ConfigError(parsed.message);
  return parsed.id;
}

function readSettings(ctx: AdapterContext, needNetworks: boolean): Settings {
  const token = ctx.secrets[TOKEN_KEY];
  if (typeof token !== "string" || token.trim() === "") {
    throw new ConfigError(
      "The Metricool API token is not set. Add it to Social media (Metricool) in Plugins.",
    );
  }
  const ids = {
    userId: idFrom(ctx.config, "user_id", "Metricool user ID"),
    blogId: idFrom(ctx.config, "blog_id", "Metricool brand ID"),
  };
  const timeZone = requireString(ctx.config, "timezone", "Time zone");
  if (!isValidTimeZone(timeZone)) {
    throw new ConfigError(
      `"${timeZone}" is not a time zone the sync recognises. Use an IANA name such as Europe/London.`,
    );
  }
  const warnings: string[] = [];
  const { networks, unknown } = parseMetricoolNetworks(
    stringList(ctx.config, "networks"),
  );
  if (unknown.length > 0) {
    warnings.push(
      `Ignored networks the sync does not support: ${unknown.join(", ")}. Use facebook, instagram or tiktok`,
    );
  }
  if (needNetworks && networks.length === 0) {
    throw new ConfigError(
      "Networks lists none of facebook, instagram and tiktok.",
    );
  }
  return { ids, timeZone, networks, token: token.trim(), warnings };
}

/** Rewords refusals and rate limits; keeps the status for callers. */
function describeError(e: unknown): unknown {
  if (!(e instanceof HttpError)) return e;
  const message = metricoolStatusMessage(e.status);
  return message ? new HttpError(e.status, message, e.body) : e;
}

async function get(
  ctx: AdapterContext,
  token: string,
  url: string,
): Promise<unknown> {
  try {
    return await ctx.http.json<unknown>(url, {
      headers: { "X-Mc-Auth": token },
      timeoutMs: REQUEST_TIMEOUT_MS,
    });
  } catch (e) {
    throw describeError(e);
  }
}

type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown };

/** Runs the tasks at most `limit` at a time; never rejects. */
async function settle<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<Outcome<T>[]> {
  const results: Outcome<T>[] = new Array(tasks.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < tasks.length) {
      const i = next;
      next += 1;
      try {
        results[i] = { ok: true, value: await tasks[i]() };
      } catch (error) {
        results[i] = { ok: false, error };
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, worker),
  );
  return results;
}

/**
 * Error text for the payload and the sync log. The payload skips the
 * runner's redaction, so this redacts too.
 */
function shortMessage(e: unknown, token: string): string {
  const text = redact((e instanceof Error ? e.message : String(e)).trim(), [
    token,
  ]);
  const chars = Array.from(text || "The request failed without a message.");
  return chars.length > ERROR_MAX
    ? `${chars.slice(0, ERROR_MAX - 1).join("")}…`
    : chars.join("");
}

function withoutFinalStop(text: string): string {
  return text.trim().replace(/[.\s]+$/, "");
}

type JobValue =
  | { kind: "posts"; batch: MetricoolPostBatch }
  | { kind: "followers"; points: { date: string; value: number }[] };

type Job = {
  kind: JobValue["kind"];
  network: SocialNetwork;
  label: string;
  run: () => Promise<JobValue>;
};

async function sync(ctx: AdapterContext): Promise<AdapterResult> {
  const { ids, timeZone, networks, token, warnings } = readSettings(ctx, true);
  const span = metricoolWindow(ctx.now, timeZone);

  const jobs: Job[] = [
    ...metricoolPostEndpoints(networks).map((endpoint): Job => ({
      kind: "posts",
      network: endpoint.network,
      label: endpoint.label,
      run: async () => ({
        kind: "posts",
        batch: parseMetricoolPosts(
          await get(ctx, token, metricoolPostsUrl(endpoint, span, ids)),
          endpoint,
          timeZone,
        ),
      }),
    })),
    ...networks.map((network): Job => ({
      kind: "followers",
      network,
      label: `${NETWORK_LABELS[network]} followers`,
      run: async () => ({
        kind: "followers",
        points: parseMetricoolTimeline(
          await get(
            ctx,
            token,
            metricoolTimelineUrl(network, span, timeZone, ids),
          ),
          timeZone,
        ),
      }),
    })),
  ];

  const outcomes = await settle(
    jobs.map((job) => job.run),
    CONCURRENCY,
  );

  const firstFailure = outcomes.find(
    (o): o is { ok: false; error: unknown } => !o.ok,
  );
  if (firstFailure && outcomes.every((o) => !o.ok)) throw firstFailure.error;

  const batches: MetricoolPostBatch[] = [];
  const series: MetricoolFollowers["series"] = [];
  const postErrors: MetricoolPosts["errors"] = [];
  const followerErrors: MetricoolFollowers["errors"] = [];

  outcomes.forEach((outcome, i) => {
    const job = jobs[i];
    if (!outcome.ok) {
      const message = `${job.label}: ${shortMessage(outcome.error, token)}`;
      if (job.kind === "posts") {
        postErrors.push({ network: job.network, message });
      } else {
        followerErrors.push({ network: job.network, message });
      }
      warnings.push(
        `${job.label} could not be read: ${withoutFinalStop(shortMessage(outcome.error, token))}`,
      );
      return;
    }
    const value = outcome.value;
    if (value.kind === "posts") {
      batches.push(value.batch);
      return;
    }
    series.push({
      network: job.network,
      metric: FOLLOWER_METRICS[job.network],
      points: value.points,
    });
    if (value.points.length === 0) {
      warnings.push(
        `Metricool returned no follower totals for ${NETWORK_LABELS[job.network]} in the last ${METRICOOL_DAYS} days`,
      );
    }
  });

  const posts = buildMetricoolPosts(networks, batches, postErrors);
  for (const network of posts.truncated ?? []) {
    warnings.push(
      `${NETWORK_LABELS[network]} had more than ${METRICOOL_MAX_POSTS} posts in the last ${METRICOOL_DAYS} days, so its oldest posts were not stored`,
    );
  }
  const followers = buildMetricoolFollowers(series, followerErrors);
  const period = { period_start: span.from, period_end: span.to };

  return {
    datasets: [
      { dataset: "posts", payload: posts, ...period },
      { dataset: "followers", payload: followers, ...period },
    ],
    records: posts.posts.length,
    warnings,
  };
}

async function test(ctx: AdapterContext): Promise<string> {
  const { ids, token } = readSettings(ctx, false);
  const check = describeMetricoolProfiles(
    await get(ctx, token, metricoolProfilesUrl(ids)),
    ids.blogId,
  );
  if (!check.ok) throw new Error(check.message);
  return check.message;
}

export const adapter: PluginAdapter = { id: "metricool", sync, test };
