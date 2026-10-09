import { describe, expect, it } from "vitest";
import {
  classifySiteResponse,
  headersToRecord,
  mergeSiteHistory,
} from "../../../../supabase/functions/os-plugins/adapters/site-status-check";
import { adapter as siteStatus } from "../../../../supabase/functions/os-plugins/adapters/site-status";
import type { AdapterContext } from "../../../../supabase/functions/os-plugins/adapters/types";
import {
  HttpError,
  type Http,
  type RawResponse,
} from "../../../../supabase/functions/os-plugins/lib/http";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type {
  SiteCheck,
  SiteStatusChecks,
} from "../../../../supabase/functions/_shared/os/contract";

const SITE = "https://www.myhealthcheckup.co.uk/";
const APEX = "https://myhealthcheckup.co.uk/";

const REAL_PAGE =
  '<!doctype html><html><head><title>Compare private blood tests | myhealth checkup</title></head><body><div id="root"></div></body></html>';
const LOVABLE_PLACEHOLDER =
  "<!doctype html><html><head><title>No published build</title></head><body><p>This project has no published build yet.</p></body></html>";

describe("classifySiteResponse", () => {
  it("flags Lovable's 404 placeholder and says how to fix it", () => {
    expect(
      classifySiteResponse({
        status: 404,
        finalUrl: SITE,
        headers: { "x-lovable-serve-error": "dwl_no_hash" },
        bodySnippet: LOVABLE_PLACEHOLDER,
      }),
    ).toEqual({
      ok: false,
      problem:
        "The host answered 404: Lovable reports no published build. Republish the project in Lovable.",
    });
  });

  it("passes a normal 200 page", () => {
    expect(
      classifySiteResponse({
        status: 200,
        finalUrl: SITE,
        headers: { "content-type": "text/html" },
        bodySnippet: REAL_PAGE,
      }),
    ).toEqual({ ok: true, problem: null });
  });

  it("fails a server error", () => {
    expect(
      classifySiteResponse({
        status: 500,
        finalUrl: SITE,
        headers: {},
        bodySnippet: "Internal Server Error",
      }),
    ).toEqual({ ok: false, problem: "The host answered 500." });
  });

  it("passes an address that redirects to a working page", () => {
    // Requested the apex domain; fetch followed the redirect to www.
    expect(
      classifySiteResponse({
        status: 200,
        finalUrl: SITE,
        headers: { "content-type": "text/html" },
        bodySnippet: REAL_PAGE,
      }),
    ).toEqual({ ok: true, problem: null });
  });

  it("fails a redirect that ends on Lovable's placeholder", () => {
    expect(
      classifySiteResponse({
        status: 404,
        finalUrl: SITE,
        headers: { "x-lovable-serve-error": "dwl_no_hash" },
        bodySnippet: "",
      }).ok,
    ).toBe(false);
  });

  it("fails a 200 that serves Lovable's placeholder instead of the site", () => {
    expect(
      classifySiteResponse({
        status: 200,
        finalUrl: SITE,
        headers: {},
        bodySnippet: LOVABLE_PLACEHOLDER,
      }),
    ).toEqual({
      ok: false,
      problem:
        "The host answered 200: Lovable reports no published build. Republish the project in Lovable.",
    });
  });

  it("names other Lovable serve errors by their code", () => {
    expect(
      classifySiteResponse({
        status: 502,
        finalUrl: SITE,
        headers: { "x-lovable-serve-error": "upstream_timeout" },
        bodySnippet: "",
      }),
    ).toEqual({
      ok: false,
      problem:
        "The host answered 502: Lovable could not serve the site (upstream_timeout).",
    });
  });
});

describe("headersToRecord", () => {
  it("lower-cases header names", () => {
    const headers = new Map([["X-Lovable-Serve-Error", "dwl_no_hash"]]);
    expect(headersToRecord(headers)).toEqual({
      "x-lovable-serve-error": "dwl_no_hash",
    });
  });
});

function check(url: string, checkedAt: string, ok = true): SiteCheck {
  return {
    url,
    checked_at: checkedAt,
    status: ok ? 200 : 404,
    ok,
    latency_ms: ok ? 300 : 120,
    final_url: url,
    problem: ok ? null : "The host answered 404.",
  };
}

describe("mergeSiteHistory", () => {
  it("puts this run first, keeps a limit per address and drops removed addresses", () => {
    const previous = [
      check(SITE, "2026-10-09T10:23:00Z"),
      check(APEX, "2026-10-09T10:23:00Z"),
      check(SITE, "2026-10-09T09:23:00Z"),
      check("https://old.example.co.uk/", "2026-10-09T09:23:00Z"),
      { url: SITE, checked_at: "not a date" },
    ];
    const latest = [
      check(SITE, "2026-10-09T11:23:00Z", false),
      check(APEX, "2026-10-09T11:23:00Z"),
    ];
    const merged = mergeSiteHistory(latest, previous, 2);
    expect(merged.map((c) => [c.url, c.checked_at])).toEqual([
      [SITE, "2026-10-09T11:23:00Z"],
      [APEX, "2026-10-09T11:23:00Z"],
      [SITE, "2026-10-09T10:23:00Z"],
      [APEX, "2026-10-09T10:23:00Z"],
    ]);
  });

  it("starts a fresh history when there is none", () => {
    const latest = [check(SITE, "2026-10-09T11:23:00Z")];
    expect(mergeSiteHistory(latest, undefined)).toEqual(latest);
  });
});

type FakeAnswer = Omit<RawResponse, "headers"> & {
  headers?: Record<string, string>;
};

/** Adapter context whose http.raw answers from a table of canned responses. */
function fakeContext(
  urls: string[],
  answers: Record<string, FakeAnswer | Error>,
  previous: Record<string, unknown> = {},
): AdapterContext {
  const plugin = getOsPlugin("site_status");
  if (!plugin) throw new Error("site_status is missing from the catalogue");
  const http: Http = {
    json: () => Promise.reject(new Error("not used")),
    raw: async (url) => {
      const answer = answers[url];
      if (!answer) throw new Error(`unexpected request to ${url}`);
      if (answer instanceof Error) throw answer;
      const headers = new Map(Object.entries(answer.headers ?? {}));
      return { ...answer, headers: headers as unknown as Headers };
    },
  };
  return {
    plugin,
    config: { urls },
    secrets: {},
    http,
    db: { rpc: () => Promise.resolve({ data: null, error: null }) },
    previous,
    now: new Date("2026-10-09T12:23:00Z"),
  };
}

describe("site_status adapter", () => {
  it("follows a redirect, flags the placeholder and keeps history", async () => {
    const ctx = fakeContext(
      [APEX, SITE],
      {
        [APEX]: { status: 200, url: SITE, text: REAL_PAGE, ms: 312 },
        [SITE]: {
          status: 404,
          url: SITE,
          text: LOVABLE_PLACEHOLDER,
          ms: 95,
          headers: { "x-lovable-serve-error": "dwl_no_hash" },
        },
      },
      {
        checks: {
          latest: [],
          history: [check(SITE, "2026-10-09T11:23:00Z")],
        },
      },
    );
    const out = await siteStatus.sync(ctx);
    expect(out.records).toBe(2);
    const payload = out.datasets[0].payload as SiteStatusChecks;
    expect(out.datasets[0].dataset).toBe("checks");
    expect(
      payload.latest.map((c) => [c.url, c.ok, c.status, c.final_url]),
    ).toEqual([
      [APEX, true, 200, SITE],
      [SITE, false, 404, SITE],
    ]);
    expect(payload.latest[0].checked_at).toBe("2026-10-09T12:23:00.000Z");
    expect(payload.history.map((c) => c.checked_at)).toEqual([
      "2026-10-09T12:23:00.000Z",
      "2026-10-09T12:23:00.000Z",
      "2026-10-09T11:23:00Z",
    ]);
    expect(out.warnings).toEqual([
      `${SITE}: The host answered 404: Lovable reports no published build. Republish the project in Lovable.`,
    ]);
  });

  it("records a network failure with no status", async () => {
    const ctx = fakeContext([SITE], {
      [SITE]: new HttpError(
        0,
        "www.myhealthcheckup.co.uk did not answer within 15 s.",
        "",
      ),
    });
    const out = await siteStatus.sync(ctx);
    const payload = out.datasets[0].payload as SiteStatusChecks;
    expect(payload.latest[0]).toMatchObject({
      ok: false,
      status: null,
      latency_ms: null,
      problem: "www.myhealthcheckup.co.uk did not answer within 15 s.",
    });
  });

  it("reports the status, time and redirect from a test", async () => {
    const ctx = fakeContext([APEX], {
      [APEX]: { status: 200, url: SITE, text: REAL_PAGE, ms: 312 },
    });
    await expect(siteStatus.test(ctx)).resolves.toBe(
      `${APEX} answered 200 in 312 ms after redirecting to ${SITE}.`,
    );
  });
});
