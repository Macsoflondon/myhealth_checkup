import { describe, expect, it } from "vitest";
import {
  buildMetricoolPosts,
  describeMetricoolProfiles,
  FOLLOWER_METRICS,
  formatOffset,
  isValidTimeZone,
  metricoolItems,
  metricoolPostEndpoints,
  metricoolPostsUrl,
  metricoolProfilesUrl,
  metricoolStatusMessage,
  metricoolTimelineUrl,
  metricoolWindow,
  METRICOOL_MAX_POSTS,
  METRICOOL_MAX_UNMAPPED_KEYS,
  normaliseMetricoolPost,
  parseMetricoolId,
  parseMetricoolNetworks,
  parseMetricoolPosts,
  parseMetricoolTimeline,
  parseZonedDateTime,
  readMetricoolInstant,
  readMetricoolNumber,
  zonedDate,
  zonedDateTimeWithOffset,
} from "../../../../supabase/functions/os-plugins/adapters/metricool-normalise";
import { adapter as metricool } from "../../../../supabase/functions/os-plugins/adapters/metricool";
import type { AdapterContext } from "../../../../supabase/functions/os-plugins/adapters/types";
import {
  HttpError,
  type Http,
} from "../../../../supabase/functions/os-plugins/lib/http";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type {
  MetricoolFollowers,
  MetricoolPosts,
  SocialPost,
} from "../../../../supabase/functions/_shared/os/contract";

const LONDON = "Europe/London";
const IDS = { userId: "5383189", blogId: "6977338" };
const IG_POST = { network: "instagram", type: "post" } as const;

function post(overrides: Partial<SocialPost>): SocialPost {
  return {
    network: "instagram",
    id: "1",
    published_at: null,
    text: null,
    url: null,
    image_url: null,
    type: "post",
    metrics: {
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      reach: null,
      impressions: null,
      views: null,
      engagement: null,
    },
    ...overrides,
  };
}

describe("config parsing", () => {
  it("accepts numeric ids and explains anything else", () => {
    expect(parseMetricoolId(" 5383189 ", "Metricool user ID")).toEqual({
      ok: true,
      id: "5383189",
    });
    const bad = parseMetricoolId("abc", "Metricool brand ID");
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.message).toContain("Metricool brand ID");
  });

  it("keeps known networks once, in order, and reports the rest", () => {
    expect(
      parseMetricoolNetworks([
        "Instagram",
        "facebook",
        "instagram",
        " twitter ",
        "",
      ]),
    ).toEqual({ networks: ["instagram", "facebook"], unknown: ["twitter"] });
  });

  it("checks time zone names", () => {
    expect(isValidTimeZone(LONDON)).toBe(true);
    expect(isValidTimeZone("Europe/Nowhere")).toBe(false);
    expect(isValidTimeZone("")).toBe(false);
  });
});

describe("dates and offsets", () => {
  it("places 23:30 UTC in summer on the next London day", () => {
    expect(zonedDate(new Date("2026-08-14T23:30:00Z"), LONDON)).toBe(
      "2026-08-15",
    );
    expect(zonedDate(new Date("2026-12-14T23:30:00Z"), LONDON)).toBe(
      "2026-12-14",
    );
  });

  it("formats offsets", () => {
    expect(formatOffset(60)).toBe("+01:00");
    expect(formatOffset(0)).toBe("+00:00");
    expect(formatOffset(-330)).toBe("-05:30");
  });

  it("gives London's offset for each wall time, either side of the clock change", () => {
    // British Summer Time ends at 02:00 on Sunday 25 October 2026.
    expect(zonedDateTimeWithOffset("2026-10-25", "00:00:00", LONDON)).toBe(
      "2026-10-25T00:00:00+01:00",
    );
    expect(zonedDateTimeWithOffset("2026-10-25", "23:59:59", LONDON)).toBe(
      "2026-10-25T23:59:59+00:00",
    );
    expect(zonedDateTimeWithOffset("2026-03-29", "00:00:00", LONDON)).toBe(
      "2026-03-29T00:00:00+00:00",
    );
    expect(zonedDateTimeWithOffset("2026-03-29", "23:59:59", LONDON)).toBe(
      "2026-03-29T23:59:59+01:00",
    );
  });

  it("covers the last 90 days, today included", () => {
    expect(metricoolWindow(new Date("2026-10-09T12:00:00Z"), LONDON)).toEqual({
      from: "2026-07-12",
      to: "2026-10-09",
    });
    // 23:30 UTC on 9 October is already 10 October in London.
    expect(metricoolWindow(new Date("2026-10-09T23:30:00Z"), LONDON)).toEqual({
      from: "2026-07-13",
      to: "2026-10-10",
    });
  });
});

describe("request URLs", () => {
  const window = { from: "2026-07-12", to: "2026-10-09" };

  it("asks for posts, reels and TikTok videos per network", () => {
    expect(
      metricoolPostEndpoints(["facebook", "instagram", "tiktok"]).map(
        (e) => `${e.kind}/${e.network}:${e.type}`,
      ),
    ).toEqual([
      "posts/facebook:post",
      "reels/facebook:reel",
      "posts/instagram:post",
      "reels/instagram:reel",
      "posts/tiktok:video",
    ]);
  });

  it("builds the posts URL with whole-day bounds and both ids", () => {
    const [endpoint] = metricoolPostEndpoints(["instagram"]);
    const url = new URL(metricoolPostsUrl(endpoint, window, IDS));
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://app.metricool.com/api/v2/analytics/posts/instagram",
    );
    expect(url.searchParams.get("from")).toBe("2026-07-12T00:00:00");
    expect(url.searchParams.get("to")).toBe("2026-10-09T23:59:59");
    expect(url.searchParams.get("blogId")).toBe("6977338");
    expect(url.searchParams.get("userId")).toBe("5383189");
  });

  it("builds the timeline URL with encoded offsets and the network's metric", () => {
    const raw = metricoolTimelineUrl("facebook", window, LONDON, IDS);
    expect(raw).toContain("from=2026-07-12T00%3A00%3A00%2B01%3A00");
    expect(raw).toContain("timezone=Europe%2FLondon");
    const url = new URL(raw);
    expect(url.pathname).toBe("/api/v2/analytics/timelines");
    expect(url.searchParams.get("to")).toBe("2026-10-09T23:59:59+01:00");
    expect(url.searchParams.get("metric")).toBe("pageFollows");
    expect(url.searchParams.get("subject")).toBe("account");
    expect(url.searchParams.get("network")).toBe("facebook");
    expect(FOLLOWER_METRICS).toEqual({
      facebook: "pageFollows",
      instagram: "followers",
      tiktok: "followers_count",
    });
  });

  it("uses the winter offset for a winter end date", () => {
    const url = new URL(
      metricoolTimelineUrl(
        "tiktok",
        { from: "2026-09-17", to: "2026-12-15" },
        LONDON,
        IDS,
      ),
    );
    expect(url.searchParams.get("from")).toBe("2026-09-17T00:00:00+01:00");
    expect(url.searchParams.get("to")).toBe("2026-12-15T23:59:59+00:00");
    expect(url.searchParams.get("metric")).toBe("followers_count");
  });

  it("builds the brand list URL for the connection test", () => {
    expect(metricoolProfilesUrl(IDS)).toBe(
      "https://app.metricool.com/api/admin/simpleProfiles?userId=5383189&blogId=6977338",
    );
  });

  it("explains refusals in terms of the token and the plan", () => {
    for (const status of [401, 403]) {
      const message = metricoolStatusMessage(status) ?? "";
      expect(message).toContain("API token");
      expect(message).toContain("Advanced or Custom plan");
    }
    expect(metricoolStatusMessage(500)).toBeNull();
  });
});

describe("readMetricoolNumber", () => {
  it("reads numbers, numeric strings, grouped thousands and percentages", () => {
    expect(readMetricoolNumber(12)).toBe(12);
    expect(readMetricoolNumber("12")).toBe(12);
    expect(readMetricoolNumber(" 1,234 ")).toBe(1234);
    expect(readMetricoolNumber("4.5%")).toBe(4.5);
    expect(readMetricoolNumber({ value: "7" })).toBe(7);
    expect(readMetricoolNumber({ count: 3 })).toBe(3);
  });

  it("returns null for anything that is not a number", () => {
    expect(readMetricoolNumber("")).toBeNull();
    expect(readMetricoolNumber("n/a")).toBeNull();
    expect(readMetricoolNumber("0x10")).toBeNull();
    expect(readMetricoolNumber(Number.NaN)).toBeNull();
    expect(readMetricoolNumber(true)).toBeNull();
    expect(readMetricoolNumber(null)).toBeNull();
    expect(readMetricoolNumber([1])).toBeNull();
  });
});

describe("readMetricoolInstant", () => {
  it("reads unix seconds and milliseconds, as numbers or strings", () => {
    expect(readMetricoolInstant(1790000000, LONDON)).toBe(
      "2026-09-21T14:13:20.000Z",
    );
    expect(readMetricoolInstant(1790000000000, LONDON)).toBe(
      "2026-09-21T14:13:20.000Z",
    );
    expect(readMetricoolInstant("1790000000", LONDON)).toBe(
      "2026-09-21T14:13:20.000Z",
    );
  });

  it("reads ISO strings with an offset as given", () => {
    expect(readMetricoolInstant("2026-10-01T12:00:00+01:00", LONDON)).toBe(
      "2026-10-01T11:00:00.000Z",
    );
    expect(readMetricoolInstant("2026-10-01T12:00:00.250Z", LONDON)).toBe(
      "2026-10-01T12:00:00.250Z",
    );
  });

  it("rounds fractional seconds to the nearest millisecond", () => {
    expect(readMetricoolInstant("2026-10-01T12:00:00.123+01:00", LONDON)).toBe(
      "2026-10-01T11:00:00.123Z",
    );
    expect(readMetricoolInstant("2026-10-01T12:00:00.0569999Z", LONDON)).toBe(
      "2026-10-01T12:00:00.057Z",
    );
  });

  it("reads strings without an offset as wall time in the time zone", () => {
    expect(readMetricoolInstant("2026-10-01T12:00:00", LONDON)).toBe(
      "2026-10-01T11:00:00.000Z",
    );
    expect(readMetricoolInstant("2026-12-01 12:00:00", LONDON)).toBe(
      "2026-12-01T12:00:00.000Z",
    );
  });

  it("unwraps { dateTime } and honours a timezone beside it", () => {
    expect(
      readMetricoolInstant({ dateTime: "2026-10-01T12:00:00" }, LONDON),
    ).toBe("2026-10-01T11:00:00.000Z");
    expect(
      readMetricoolInstant(
        { dateTime: "2026-10-01T12:00:00", timezone: "Europe/Madrid" },
        LONDON,
      ),
    ).toBe("2026-10-01T10:00:00.000Z");
  });

  it("rejects impossible or out-of-range dates", () => {
    expect(readMetricoolInstant("2026-02-30T10:00:00", LONDON)).toBeNull();
    expect(readMetricoolInstant(0, LONDON)).toBeNull();
    expect(readMetricoolInstant("yesterday", LONDON)).toBeNull();
    expect(parseZonedDateTime("2026-10-01T25:00:00", LONDON)).toBeNull();
  });
});

describe("metricoolItems", () => {
  it("accepts a top-level array or { data: [...] }", () => {
    expect(metricoolItems([{ id: 1 }, "skip", { id: 2 }])).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(metricoolItems({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(metricoolItems({ Data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
  });

  it("treats no answer or empty data as no posts", () => {
    expect(metricoolItems(null)).toEqual([]);
    expect(metricoolItems({ data: null })).toEqual([]);
    expect(metricoolItems([])).toEqual([]);
  });

  it("refuses shapes it does not know rather than guessing", () => {
    expect(() => metricoolItems({ posts: [] })).toThrow(/shape/);
    expect(() => metricoolItems({ data: { posts: [] } })).toThrow(/shape/);
    expect(() => metricoolItems("oops")).toThrow(/shape/);
  });
});

describe("normaliseMetricoolPost", () => {
  it("maps candidate keys case-insensitively, with string numbers", () => {
    const out = normaliseMetricoolPost(
      {
        PostId: 98765,
        publishedAt: { dateTime: "2026-09-30T18:15:00+01:00" },
        Caption: "  Vitamin D testing explained  ",
        permalink: "https://www.instagram.com/p/abc/",
        thumbnailUrl: "https://cdn.example.com/a.jpg",
        LIKES: "1,204",
        commentsCount: "17",
        shareCount: 3,
        saved: "9",
        reach: { value: "5400" },
        impressions: 6100,
        blue_reels_play_count: "8000",
        engagementRate: "4.2",
      },
      IG_POST,
      LONDON,
    );
    expect(out).toEqual({
      network: "instagram",
      id: "98765",
      published_at: "2026-09-30T17:15:00.000Z",
      text: "Vitamin D testing explained",
      url: "https://www.instagram.com/p/abc/",
      image_url: "https://cdn.example.com/a.jpg",
      type: "post",
      metrics: {
        likes: 1204,
        comments: 17,
        shares: 3,
        saves: 9,
        reach: 5400,
        impressions: 6100,
        views: 8000,
        engagement: 4.2,
      },
    });
  });

  it("falls through to the next candidate when one is empty", () => {
    const out = normaliseMetricoolPost(
      {
        id: "",
        postId: "p-1",
        likes: null,
        reactions: 12,
        text: "   ",
        message: "From the message field",
        url: "not a link",
        link: "https://facebook.com/1",
      },
      { network: "facebook", type: "post" },
      LONDON,
    );
    expect(out.id).toBe("p-1");
    expect(out.metrics.likes).toBe(12);
    expect(out.text).toBe("From the message field");
    expect(out.url).toBe("https://facebook.com/1");
  });

  it("reads unix timestamps in seconds and milliseconds", () => {
    expect(
      normaliseMetricoolPost({ id: 1, created: 1790000000 }, IG_POST, LONDON)
        .published_at,
    ).toBe("2026-09-21T14:13:20.000Z");
    expect(
      normaliseMetricoolPost(
        { id: 1, timestamp: "1790000000000" },
        IG_POST,
        LONDON,
      ).published_at,
    ).toBe("2026-09-21T14:13:20.000Z");
  });

  it("leaves unknown, negative and non-numeric metrics empty, never zero", () => {
    const out = normaliseMetricoolPost(
      { id: 1, likes: -1, comments: "n/a", views: { foo: 1 } },
      IG_POST,
      LONDON,
    );
    expect(out.metrics).toEqual({
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      reach: null,
      impressions: null,
      views: null,
      engagement: null,
    });
    expect(out.published_at).toBeNull();
  });

  it("only keeps http and https links", () => {
    const out = normaliseMetricoolPost(
      {
        id: 1,
        url: "javascript:alert(1)",
        picture: "data:image/png;base64,AAAA",
        image: { url: "https://cdn.example.com/b.jpg" },
      },
      IG_POST,
      LONDON,
    );
    expect(out.url).toBeNull();
    expect(out.image_url).toBe("https://cdn.example.com/b.jpg");
  });

  it("gives posts without an id a stable id from network, date and link", () => {
    const item = {
      date: "2026-10-01T09:00:00Z",
      url: "https://www.tiktok.com/@brand/video/1",
    };
    const tiktok = { network: "tiktok", type: "video" } as const;
    const a = normaliseMetricoolPost(item, tiktok, LONDON);
    const b = normaliseMetricoolPost({ ...item }, tiktok, LONDON);
    const c = normaliseMetricoolPost(
      { ...item, url: "https://www.tiktok.com/@brand/video/2" },
      tiktok,
      LONDON,
    );
    expect(a.id).toMatch(/^tiktok-[0-9a-f]{8}$/);
    expect(a.id).toBe(b.id);
    expect(c.id).not.toBe(a.id);
  });
});

describe("parseMetricoolPosts", () => {
  it("reports the first item's unmapped keys", () => {
    const batch = parseMetricoolPosts(
      {
        data: [
          { id: 1, likes: 2, interactions: 5, Type: "IMAGE" },
          { id: 2, onlyOnSecondItem: true },
        ],
      },
      IG_POST,
      LONDON,
    );
    expect(batch.posts).toHaveLength(2);
    expect(batch.unmappedKeys).toEqual(["interactions", "Type"]);
  });

  it("returns nothing for an empty answer", () => {
    expect(parseMetricoolPosts([], IG_POST, LONDON)).toEqual({
      posts: [],
      unmappedKeys: [],
    });
  });
});

describe("buildMetricoolPosts", () => {
  it("keeps one entry per network and id, preferring the reel", () => {
    const asPost = post({
      id: "9",
      type: "post",
      published_at: "2026-10-01T10:00:00.000Z",
    });
    const asReel = post({
      id: "9",
      type: "reel",
      published_at: "2026-10-01T10:00:00.000Z",
    });
    const otherNetwork = post({ id: "9", network: "facebook" });
    const out = buildMetricoolPosts(
      ["instagram", "facebook"],
      [
        { posts: [asPost, otherNetwork], unmappedKeys: [] },
        { posts: [asReel], unmappedKeys: [] },
      ],
      [],
    );
    expect(out.posts).toHaveLength(2);
    expect(out.posts.find((p) => p.network === "instagram")?.type).toBe("reel");
  });

  it("sorts newest first with undated posts last, and caps the list", () => {
    const many = Array.from({ length: METRICOOL_MAX_POSTS + 5 }, (_, i) =>
      post({
        id: String(i),
        published_at: new Date(
          Date.UTC(2026, 8, 1) + i * 3_600_000,
        ).toISOString(),
      }),
    );
    const undated = post({ id: "undated" });
    const out = buildMetricoolPosts(
      ["instagram"],
      [{ posts: [undated, ...many], unmappedKeys: [] }],
      [],
    );
    expect(out.posts).toHaveLength(METRICOOL_MAX_POSTS);
    expect(out.posts[0].id).toBe(String(METRICOOL_MAX_POSTS + 4));
    expect(out.posts.some((p) => p.id === "undated")).toBe(false);
    const few = buildMetricoolPosts(
      ["instagram"],
      [{ posts: [undated, many[0], many[1]], unmappedKeys: [] }],
      [],
    );
    expect(few.posts.map((p) => p.id)).toEqual(["1", "0", "undated"]);
  });

  it("deduplicates and caps unmapped keys and passes errors through", () => {
    const keys = Array.from(
      { length: 50 },
      (_, i) => `k${String(i).padStart(2, "0")}`,
    );
    const errors: MetricoolPosts["errors"] = [
      { network: "tiktok", message: "TikTok videos: failed" },
    ];
    const out = buildMetricoolPosts(
      ["instagram", "tiktok"],
      [
        { posts: [], unmappedKeys: ["zeta", "alpha"] },
        { posts: [], unmappedKeys: ["alpha", ...keys] },
      ],
      errors,
    );
    expect(out.unmapped_keys).toHaveLength(METRICOOL_MAX_UNMAPPED_KEYS);
    expect(out.unmapped_keys[0]).toBe("alpha");
    expect(new Set(out.unmapped_keys).size).toBe(out.unmapped_keys.length);
    expect(out.networks).toEqual(["instagram", "tiktok"]);
    expect(out.errors).toEqual(errors);
  });
});

describe("parseMetricoolTimeline", () => {
  it("reads the first item that has values, oldest first", () => {
    expect(
      parseMetricoolTimeline(
        {
          data: [
            { metric: "followers" },
            {
              values: [
                { dateTime: "2026-10-02T00:00:00+01:00", value: "1201" },
                { dateTime: "2026-10-01T00:00:00+01:00", value: 1200 },
              ],
            },
            { values: [{ dateTime: "2026-10-03T00:00:00+01:00", value: 1 }] },
          ],
        },
        LONDON,
      ),
    ).toEqual([
      { date: "2026-10-01", value: 1200 },
      { date: "2026-10-02", value: 1201 },
    ]);
  });

  it("keeps calendar dates in order across the end of British Summer Time", () => {
    expect(
      parseMetricoolTimeline(
        {
          data: [
            {
              values: [
                { dateTime: "2026-10-24T00:00:00+01:00", value: 500 },
                { dateTime: "2026-10-25T00:00:00+01:00", value: 501 },
                { dateTime: "2026-10-26T00:00:00+00:00", value: 503 },
                { dateTime: "2026-10-27T00:00:00Z", value: 504 },
              ],
            },
          ],
        },
        LONDON,
      ),
    ).toEqual([
      { date: "2026-10-24", value: 500 },
      { date: "2026-10-25", value: 501 },
      { date: "2026-10-26", value: 503 },
      { date: "2026-10-27", value: 504 },
    ]);
  });

  it("places points by instant, so a summer offset after the change lands on the day before", () => {
    // 2026-10-26T00:00:00+01:00 is 23:00 on 25 October in London (GMT), so it
    // shares that date with the midnight point and, being later, replaces it.
    expect(
      parseMetricoolTimeline(
        [
          {
            values: [
              { dateTime: "2026-10-25T00:00:00+01:00", value: 501 },
              { dateTime: "2026-10-26T00:00:00+01:00", value: 502 },
            ],
          },
        ],
        LONDON,
      ),
    ).toEqual([{ date: "2026-10-25", value: 502 }]);
  });

  it("keeps the latest point when several land on one date", () => {
    expect(
      parseMetricoolTimeline(
        {
          data: [
            {
              values: [
                { dateTime: "2026-08-01T18:00:00+01:00", value: 12 },
                { dateTime: "2026-08-01T06:00:00+01:00", value: 10 },
                { dateTime: "2026-07-31T23:30:00Z", value: 11 },
              ],
            },
          ],
        },
        LONDON,
      ),
    ).toEqual([{ date: "2026-08-01", value: 12 }]);
  });

  it("skips points without a usable date or value instead of inventing zeros", () => {
    expect(
      parseMetricoolTimeline(
        {
          data: [
            {
              values: [
                { dateTime: "2026-08-01T00:00:00+01:00", value: null },
                { dateTime: "not a date", value: 5 },
                { dateTime: "2026-08-02T00:00:00+01:00", value: -1 },
                {
                  dateTime: "2026-08-03T00:00:00+01:00",
                  value: { value: "9" },
                },
              ],
            },
          ],
        },
        LONDON,
      ),
    ).toEqual([{ date: "2026-08-03", value: 9 }]);
  });

  it("returns an empty series for empty answers and refuses unknown shapes", () => {
    expect(parseMetricoolTimeline({ data: [] }, LONDON)).toEqual([]);
    expect(parseMetricoolTimeline({ data: [{ values: [] }] }, LONDON)).toEqual(
      [],
    );
    expect(parseMetricoolTimeline(null, LONDON)).toEqual([]);
    expect(() => parseMetricoolTimeline({ data: 5 }, LONDON)).toThrow(/shape/);
  });
});

describe("describeMetricoolProfiles", () => {
  it("names the configured brand when the list has it", () => {
    expect(
      describeMetricoolProfiles(
        [
          { id: 1, label: "Other brand" },
          { id: 6977338, label: "Myhealth Checkup" },
        ],
        "6977338",
      ),
    ).toEqual({ ok: true, message: "Metricool brand found: Myhealth Checkup" });
  });

  it("fails when the brand is missing or nothing is listed", () => {
    const missing = describeMetricoolProfiles(
      { data: [{ id: 1, label: "Other brand" }] },
      "6977338",
    );
    expect(missing.ok).toBe(false);
    expect(missing.message).toContain("6977338");
    expect(describeMetricoolProfiles([], "6977338").ok).toBe(false);
  });

  it("matches the brand on blogId when id is a different number", () => {
    expect(
      describeMetricoolProfiles(
        [{ id: 42, blogId: "6977338", title: "Myhealth Checkup" }],
        "6977338",
      ),
    ).toEqual({ ok: true, message: "Metricool brand found: Myhealth Checkup" });
  });

  it("accepts a single brand object without an id", () => {
    expect(describeMetricoolProfiles({ label: "Brand" }, "6977338")).toEqual({
      ok: true,
      message: "Metricool brand found",
    });
  });
});

// ---------------------------------------------------------------------------
// Adapter, with a fake Metricool
// ---------------------------------------------------------------------------

type Answer = unknown | HttpError;

function context(
  answer: (url: URL) => Answer,
  config: Record<string, unknown> = {},
): {
  ctx: AdapterContext;
  calls: { url: URL; headers: Record<string, string> }[];
} {
  const plugin = getOsPlugin("metricool");
  if (!plugin) throw new Error("metricool is missing from the catalogue");
  const calls: { url: URL; headers: Record<string, string> }[] = [];
  const http: Http = {
    json: async <T>(
      url: string,
      init?: { headers?: Record<string, string> },
    ) => {
      const parsed = new URL(url);
      calls.push({ url: parsed, headers: init?.headers ?? {} });
      const out = answer(parsed);
      if (out instanceof Error) throw out;
      return out as T;
    },
    raw: () => Promise.reject(new Error("not used")),
  };
  return {
    calls,
    ctx: {
      plugin,
      config: { ...plugin.defaultConfig, ...config },
      secrets: { METRICOOL_USER_TOKEN: "mc-token-123456" },
      http,
      db: { rpc: () => Promise.reject(new Error("not used")) },
      previous: {},
      now: new Date("2026-10-09T12:00:00Z"),
    },
  };
}

function route(url: URL): Answer {
  if (url.pathname.endsWith("/timelines")) {
    return {
      data: [
        {
          values: [{ dateTime: "2026-10-09T00:00:00+01:00", value: 321 }],
        },
      ],
    };
  }
  const network = url.pathname.split("/").pop();
  const kind = url.pathname.includes("/reels/") ? "reel" : "post";
  return [
    {
      id: `${network}-${kind}-1`,
      publishedAt: "2026-10-01T09:00:00Z",
      likes: 4,
    },
  ];
}

describe("metricool adapter", () => {
  it("syncs posts and followers for every network with the token header", async () => {
    const { ctx, calls } = context(route);
    const out = await metricool.sync(ctx);
    expect(calls).toHaveLength(8);
    expect(
      calls.every((c) => c.headers["X-Mc-Auth"] === "mc-token-123456"),
    ).toBe(true);
    const posts = out.datasets.find((d) => d.dataset === "posts")
      ?.payload as MetricoolPosts;
    const followers = out.datasets.find((d) => d.dataset === "followers")
      ?.payload as MetricoolFollowers;
    expect(posts.posts).toHaveLength(5);
    expect(posts.errors).toEqual([]);
    expect(out.records).toBe(5);
    expect(followers.series.map((s) => [s.network, s.metric])).toEqual([
      ["facebook", "pageFollows"],
      ["instagram", "followers"],
      ["tiktok", "followers_count"],
    ]);
    expect(followers.series[0].points).toEqual([
      { date: "2026-10-09", value: 321 },
    ]);
    expect(out.datasets[0]).toMatchObject({
      period_start: "2026-07-12",
      period_end: "2026-10-09",
    });
  });

  it("records a failing endpoint and keeps the rest", async () => {
    const { ctx } = context((url) =>
      url.pathname.includes("/reels/instagram")
        ? new HttpError(500, "app.metricool.com answered 500", "")
        : route(url),
    );
    const out = await metricool.sync(ctx);
    const posts = out.datasets.find((d) => d.dataset === "posts")
      ?.payload as MetricoolPosts;
    expect(posts.errors).toEqual([
      {
        network: "instagram",
        message: "Instagram reels: app.metricool.com answered 500",
      },
    ]);
    expect(posts.posts).toHaveLength(4);
    expect(out.warnings?.join(" ")).toContain(
      "Instagram reels could not be read",
    );
  });

  it("redacts the token from error text stored in the payload", async () => {
    const { ctx } = context((url) =>
      url.pathname.endsWith("/timelines")
        ? new Error("upstream echoed mc-token-123456 back")
        : route(url),
    );
    const out = await metricool.sync(ctx);
    const followers = out.datasets.find((d) => d.dataset === "followers")
      ?.payload as MetricoolFollowers;
    expect(followers.series).toEqual([]);
    expect(followers.errors).toHaveLength(3);
    expect(JSON.stringify(followers)).not.toContain("mc-token-123456");
    expect(followers.errors[0].message).toBe(
      "Facebook followers: upstream echoed [redacted] back",
    );
  });

  it("fails with the plan and token explanation when every call is refused", async () => {
    const { ctx } = context(
      () => new HttpError(403, "app.metricool.com answered 403", ""),
    );
    await expect(metricool.sync(ctx)).rejects.toThrow(
      /Advanced or Custom plan/,
    );
  });

  it("tests the connection against the brand list", async () => {
    const { ctx, calls } = context(() => [
      { id: 6977338, label: "Myhealth Checkup" },
    ]);
    await expect(metricool.test(ctx)).resolves.toBe(
      "Metricool brand found: Myhealth Checkup",
    );
    expect(calls[0].url.pathname).toBe("/api/admin/simpleProfiles");
  });
});
