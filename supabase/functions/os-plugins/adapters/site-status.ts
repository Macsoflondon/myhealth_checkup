// Site status: one anonymous GET per configured address, following
// redirects, timed, and classified by site-status-check.ts (which spots
// Lovable's "No published build" placeholder as well as plain errors).
import type { SiteCheck, SiteStatusChecks } from "../../_shared/os/contract.ts";
import { errorText } from "../lib/http.ts";
import {
  classifySiteResponse,
  headersToRecord,
  mergeSiteHistory,
} from "./site-status-check.ts";
import {
  type AdapterContext,
  ConfigError,
  type PluginAdapter,
  stringList,
} from "./types.ts";

/** Addresses checked per run. Each may take up to 15 s; they run together. */
const MAX_URLS = 10;

const REQUEST_HEADERS = {
  "user-agent": "myhealthcheckup-ai-os-status/1.0",
  accept: "text/html",
};

function configuredUrls(ctx: AdapterContext): {
  urls: string[];
  warnings: string[];
} {
  const listed = [...new Set(stringList(ctx.config, "urls"))];
  if (listed.length === 0) {
    throw new ConfigError("Addresses to check is not set.");
  }
  for (const url of listed) {
    let parsed: URL | null = null;
    try {
      parsed = new URL(url);
    } catch {
      parsed = null;
    }
    const web =
      parsed !== null &&
      (parsed.protocol === "https:" || parsed.protocol === "http:");
    if (!web) {
      throw new ConfigError(
        `"${url}" is not a full web address. Use the form https://www.example.co.uk/.`,
      );
    }
  }
  const warnings: string[] = [];
  if (listed.length > MAX_URLS) {
    warnings.push(
      `Only the first ${MAX_URLS} of ${listed.length} addresses were checked.`,
    );
  }
  return { urls: listed.slice(0, MAX_URLS), warnings };
}

async function checkUrl(ctx: AdapterContext, url: string): Promise<SiteCheck> {
  // Every check in a run carries the run's time, so the dashboard can group them.
  const checkedAt = ctx.now.toISOString();
  try {
    const res = await ctx.http.raw(url, {
      redirect: "follow",
      timeoutMs: 15_000,
      headers: REQUEST_HEADERS,
    });
    const verdict = classifySiteResponse({
      status: res.status,
      finalUrl: res.url,
      headers: headersToRecord(res.headers),
      bodySnippet: res.text.slice(0, 4000),
    });
    return {
      url,
      checked_at: checkedAt,
      status: res.status,
      ok: verdict.ok,
      latency_ms: res.ms,
      final_url: res.url || null,
      problem: verdict.problem,
    };
  } catch (e) {
    // http.raw throws HttpError (status 0, message already redacted) for
    // network failures and timeouts.
    const message = errorText(e, "The request failed.").slice(0, 300);
    return {
      url,
      checked_at: checkedAt,
      status: null,
      ok: false,
      latency_ms: null,
      final_url: null,
      problem: message,
    };
  }
}

function previousHistory(previous: Record<string, unknown>): unknown {
  const checks = previous.checks;
  if (typeof checks !== "object" || checks === null) return [];
  return (checks as Partial<SiteStatusChecks>).history ?? [];
}

export const adapter: PluginAdapter = {
  id: "site_status",

  async sync(ctx) {
    const { urls, warnings } = configuredUrls(ctx);
    const latest = await Promise.all(urls.map((url) => checkUrl(ctx, url)));
    for (const check of latest) {
      if (!check.ok) {
        warnings.push(`${check.url}: ${check.problem ?? "failed."}`);
      }
    }
    const payload: SiteStatusChecks = {
      latest,
      history: mergeSiteHistory(latest, previousHistory(ctx.previous)),
    };
    return {
      datasets: [{ dataset: "checks", payload }],
      records: latest.length,
      warnings,
    };
  },

  async test(ctx) {
    const { urls } = configuredUrls(ctx);
    const check = await checkUrl(ctx, urls[0]);
    if (!check.ok) {
      throw new Error(`${check.url}: ${check.problem ?? "failed."}`);
    }
    const redirected =
      check.final_url && check.final_url !== check.url
        ? ` after redirecting to ${check.final_url}`
        : "";
    return (
      `${check.url} answered ${check.status} in ${check.latency_ms} ms` +
      `${redirected}.`
    );
  },
};
