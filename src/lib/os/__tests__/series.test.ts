import { describe, expect, it } from "vitest";
import {
  bestPost,
  ctr,
  dayNumber,
  daySpan,
  followerChange,
  postInteractions,
  postsInWindow,
  ratio,
  sumBy,
  totalInteractions,
  weightedPosition,
  type FollowerPoint,
  type InteractionMetrics,
} from "@/lib/os/series";

type Day = {
  date: string;
  sessions: number;
  users: number | null;
  label: string;
};

type Post = {
  id: string;
  published_at: string | null;
  metrics: InteractionMetrics;
};

function metrics(m: Partial<InteractionMetrics> = {}): InteractionMetrics {
  return { likes: null, comments: null, shares: null, saves: null, ...m };
}

function post(
  id: string,
  publishedAt: string | null,
  m: Partial<InteractionMetrics> = {},
): Post {
  return { id, published_at: publishedAt, metrics: metrics(m) };
}

describe("sumBy", () => {
  it("adds up one numeric field", () => {
    const rows: Day[] = [
      { date: "2026-10-01", sessions: 10, users: 7, label: "a" },
      { date: "2026-10-02", sessions: 5, users: 4, label: "b" },
    ];
    expect(sumBy(rows, "sessions")).toBe(15);
    expect(sumBy(rows, "users")).toBe(11);
  });

  it("returns 0 for no rows", () => {
    expect(sumBy([] as Day[], "sessions")).toBe(0);
  });

  it("skips null and non-finite values", () => {
    const rows: Day[] = [
      { date: "2026-10-01", sessions: Number.NaN, users: null, label: "a" },
      { date: "2026-10-02", sessions: 3, users: 2, label: "b" },
      {
        date: "2026-10-03",
        sessions: Number.POSITIVE_INFINITY,
        users: 1,
        label: "c",
      },
    ];
    expect(sumBy(rows, "sessions")).toBe(3);
    expect(sumBy(rows, "users")).toBe(3);
  });
});

describe("ratio and ctr", () => {
  it("divides clicks by impressions", () => {
    expect(ctr(25, 1000)).toBe(0.025);
    expect(ctr(0, 40)).toBe(0);
    expect(ratio(3, 4)).toBe(0.75);
  });

  it("returns null with zero, negative or missing impressions", () => {
    expect(ctr(0, 0)).toBeNull();
    expect(ctr(5, 0)).toBeNull();
    expect(ctr(5, -1)).toBeNull();
    expect(ctr(Number.NaN, 10)).toBeNull();
    expect(ratio(1, Number.NaN)).toBeNull();
  });
});

describe("weightedPosition", () => {
  it("weights each position by its impressions", () => {
    // (2 * 100 + 10 * 300) / 400 = 8
    expect(
      weightedPosition([
        { position: 2, impressions: 100 },
        { position: 10, impressions: 300 },
      ]),
    ).toBe(8);
  });

  it("returns null for no rows", () => {
    expect(weightedPosition([])).toBeNull();
  });

  it("returns null when no row has impressions", () => {
    expect(
      weightedPosition([
        { position: 0, impressions: 0 },
        { position: 4, impressions: 0 },
      ]),
    ).toBeNull();
  });

  it("gives rows without impressions no weight", () => {
    expect(
      weightedPosition([
        { position: 0, impressions: 0 },
        { position: 3.5, impressions: 20 },
      ]),
    ).toBe(3.5);
  });

  it("skips non-finite rows", () => {
    expect(
      weightedPosition([
        { position: Number.NaN, impressions: 50 },
        { position: 6, impressions: 10 },
      ]),
    ).toBe(6);
  });
});

describe("dayNumber and daySpan", () => {
  it("reads calendar dates and rejects anything else", () => {
    expect(dayNumber("1970-01-02")).toBe(1);
    expect(dayNumber("2026-10-09") - dayNumber("2026-10-01")).toBe(8);
    expect(Number.isNaN(dayNumber("20261009"))).toBe(true);
    expect(Number.isNaN(dayNumber("2026-02-30"))).toBe(true);
    expect(Number.isNaN(dayNumber(""))).toBe(true);
  });

  it("counts covered days from first to last, inclusive", () => {
    expect(daySpan([])).toBe(0);
    expect(daySpan([{ date: "2026-10-09" }])).toBe(1);
    expect(daySpan([{ date: "2026-09-12" }, { date: "2026-10-09" }])).toBe(28);
  });

  it("counts across a month end and ignores unreadable dates", () => {
    expect(
      daySpan([
        { date: "2026-10-02" },
        { date: "not a date" },
        { date: "2026-09-29" },
      ]),
    ).toBe(4);
  });
});

describe("followerChange", () => {
  const points: FollowerPoint[] = [
    { date: "2026-09-01", value: 900 },
    { date: "2026-09-10", value: 940 },
    { date: "2026-09-11", value: 950 },
    { date: "2026-10-01", value: 1000 },
    { date: "2026-10-09", value: 1012 },
  ];

  it("compares the last point with the point N days earlier", () => {
    // 28 days before 9 Oct is 11 Sep.
    expect(followerChange(points, 28)).toEqual({
      latest: { date: "2026-10-09", value: 1012 },
      base: { date: "2026-09-11", value: 950 },
      change: 62,
      days: 28,
    });
  });

  it("uses the closest point when the exact day is missing", () => {
    // 7 days before 9 Oct is 2 Oct; 1 Oct is the closest point.
    const result = followerChange(points, 7);
    expect(result?.base).toEqual({ date: "2026-10-01", value: 1000 });
    expect(result?.change).toBe(12);
    expect(result?.days).toBe(8);
  });

  it("falls back to the earliest point when the series is short", () => {
    const result = followerChange(points, 90);
    expect(result?.base).toEqual({ date: "2026-09-01", value: 900 });
    expect(result?.change).toBe(112);
    expect(result?.days).toBe(38);
  });

  it("prefers the earlier point on a tie", () => {
    const result = followerChange(
      [
        { date: "2026-10-01", value: 10 },
        { date: "2026-10-03", value: 12 },
        { date: "2026-10-09", value: 20 },
      ],
      7,
    );
    // 2 Oct is the target; 1 Oct and 3 Oct are both one day away.
    expect(result?.base.date).toBe("2026-10-01");
  });

  it("reports losses as a negative change", () => {
    expect(
      followerChange(
        [
          { date: "2026-10-08", value: 50 },
          { date: "2026-10-09", value: 47 },
        ],
        7,
      )?.change,
    ).toBe(-3);
  });

  it("does not depend on input order", () => {
    const shuffled = [points[3], points[0], points[4], points[2], points[1]];
    expect(followerChange(shuffled, 28)).toEqual(followerChange(points, 28));
  });

  it("returns null without two usable points on different days", () => {
    expect(followerChange([], 28)).toBeNull();
    expect(followerChange([{ date: "2026-10-09", value: 5 }], 28)).toBeNull();
    expect(
      followerChange(
        [
          { date: "2026-10-09", value: 5 },
          { date: "2026-10-09", value: 6 },
        ],
        28,
      ),
    ).toBeNull();
    expect(
      followerChange(
        [
          { date: "bad", value: 5 },
          { date: "2026-10-09", value: 6 },
        ],
        28,
      ),
    ).toBeNull();
  });
});

describe("postsInWindow", () => {
  const posts = [
    post("a", "2026-10-09T08:00:00.000Z"),
    post("b", "2026-10-01T00:00:00.000Z"),
    post("c", null),
    post("d", "2026-09-30T22:59:59.000Z"),
    post("e", "not a date"),
  ];

  it("keeps posts from the start (inclusive) to the end (exclusive)", () => {
    const out = postsInWindow(
      posts,
      "2026-10-01T00:00:00.000Z",
      "2026-10-09T08:00:00.000Z",
    );
    expect(out.map((p) => p.id)).toEqual(["b"]);
  });

  it("keeps the original order and drops undated posts", () => {
    const out = postsInWindow(
      posts,
      "2026-09-01T00:00:00.000Z",
      "2026-10-10T00:00:00.000Z",
    );
    expect(out.map((p) => p.id)).toEqual(["a", "b", "d"]);
  });

  it("compares instants, not strings", () => {
    // 23:30 on 30 Sep in UTC+01:00 is 22:30 UTC, before the window.
    const out = postsInWindow(
      [post("x", "2026-09-30T23:30:00+01:00")],
      "2026-09-30T23:00:00.000Z",
      "2026-10-02T00:00:00.000Z",
    );
    expect(out).toEqual([]);
  });

  it("returns nothing for no posts or an unreadable window", () => {
    expect(
      postsInWindow([], "2026-10-01T00:00:00Z", "2026-10-09T00:00:00Z"),
    ).toEqual([]);
    expect(postsInWindow(posts, "", "2026-10-09T00:00:00Z")).toEqual([]);
  });
});

describe("post interactions", () => {
  it("adds likes, comments, shares and saves that were reported", () => {
    expect(
      postInteractions(
        post("a", null, { likes: 10, comments: 2, shares: 1, saves: 3 }),
      ),
    ).toBe(16);
    expect(postInteractions(post("b", null, { likes: 4 }))).toBe(4);
    expect(postInteractions(post("c", null, { likes: 0 }))).toBe(0);
  });

  it("returns null when nothing was reported", () => {
    expect(postInteractions(post("a", null))).toBeNull();
  });

  it("totals across posts, null only when none reported", () => {
    expect(totalInteractions([])).toBeNull();
    expect(totalInteractions([post("a", null), post("b", null)])).toBeNull();
    expect(
      totalInteractions([
        post("a", null, { likes: 2 }),
        post("b", null),
        post("c", null, { comments: 3, saves: 1 }),
      ]),
    ).toBe(6);
  });

  it("finds the post with the most interactions", () => {
    const list = [
      post("new", null, { likes: 5 }),
      post("none", null),
      post("top", null, { likes: 4, shares: 4 }),
      post("tie", null, { comments: 8 }),
    ];
    expect(bestPost(list)).toEqual({ post: list[2], interactions: 8 });
  });

  it("has no best post without interaction figures", () => {
    expect(bestPost([])).toBeNull();
    expect(bestPost([post("a", null)])).toBeNull();
  });
});
