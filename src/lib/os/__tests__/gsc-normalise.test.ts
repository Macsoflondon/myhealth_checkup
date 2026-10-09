import { describe, expect, it } from "vitest";
import {
  addDays,
  gscDailyWindow,
  gscQueryBody,
  gscQueryPath,
  gscRangeWindows,
  gscRows,
  gscTestWindow,
  gscTotalClicks,
  gscWindowEnding,
  gscYesterday,
  londonDate,
  parseGscDaily,
  parseGscSiteUrl,
  parseGscTopPages,
  parseGscTopQueries,
  toRanged,
} from "../../../../supabase/functions/os-plugins/adapters/gsc-normalise";

const SITE = "https://www.myhealthcheckup.co.uk/";

describe("parseGscSiteUrl and gscQueryPath", () => {
  it("accepts URL-prefix and domain properties unchanged", () => {
    expect(parseGscSiteUrl(` ${SITE} `)).toEqual({ ok: true, siteUrl: SITE });
    expect(parseGscSiteUrl("sc-domain:myhealthcheckup.co.uk")).toEqual({
      ok: true,
      siteUrl: "sc-domain:myhealthcheckup.co.uk",
    });
  });

  it("explains a bare domain", () => {
    const result = parseGscSiteUrl("myhealthcheckup.co.uk");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/sc-domain:/);
  });

  it("encodes the property into the query path", () => {
    expect(gscQueryPath(SITE)).toBe(
      "/webmasters/v3/sites/https%3A%2F%2Fwww.myhealthcheckup.co.uk%2F/searchAnalytics/query",
    );
    expect(gscQueryPath("sc-domain:myhealthcheckup.co.uk")).toBe(
      "/webmasters/v3/sites/sc-domain%3Amyhealthcheckup.co.uk/searchAnalytics/query",
    );
  });
});

describe("London dates", () => {
  it("uses the London calendar day, not UTC", () => {
    // 23:30 UTC on 9 October is 00:30 BST on 10 October.
    expect(londonDate(new Date("2026-10-09T23:30:00Z"))).toBe("2026-10-10");
    // In winter London is on UTC.
    expect(londonDate(new Date("2026-12-31T23:30:00Z"))).toBe("2026-12-31");
    expect(gscYesterday(new Date("2026-10-09T23:30:00Z"))).toBe("2026-10-09");
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("builds windows that end yesterday and include their end day", () => {
    const now = new Date("2026-10-09T10:00:00Z");
    expect(gscDailyWindow(now)).toEqual({
      startDate: "2026-07-11",
      endDate: "2026-10-08",
    });
    expect(gscWindowEnding("2026-10-08", 7)).toEqual({
      startDate: "2026-10-02",
      endDate: "2026-10-08",
    });
    expect(gscTestWindow(now)).toEqual({
      startDate: "2026-10-05",
      endDate: "2026-10-05",
    });
  });

  it("builds the 7, 28 and 90 day ranges", () => {
    expect(gscRangeWindows("2026-10-05")).toEqual({
      "7": { startDate: "2026-09-29", endDate: "2026-10-05" },
      "28": { startDate: "2026-09-08", endDate: "2026-10-05" },
      "90": { startDate: "2026-07-08", endDate: "2026-10-05" },
    });
  });

  it("asks for final data only", () => {
    expect(
      gscQueryBody(gscWindowEnding("2026-10-05", 7), ["query"], 25),
    ).toEqual({
      startDate: "2026-09-29",
      endDate: "2026-10-05",
      dimensions: ["query"],
      rowLimit: 25,
      dataState: "final",
    });
  });
});

describe("gscRows", () => {
  it("reads a missing rows field, an empty object and null as no rows", () => {
    expect(gscRows({})).toEqual([]);
    expect(gscRows({ responseAggregationType: "byProperty" })).toEqual([]);
    expect(gscRows(null)).toEqual([]);
  });

  it("refuses an answer it cannot read", () => {
    expect(() => gscRows("nope")).toThrow();
    expect(() => gscRows({ rows: "nope" })).toThrow();
  });
});

describe("parseGscDaily", () => {
  const daily = parseGscDaily(
    {
      rows: [
        {
          keys: ["2026-10-06"],
          clicks: 5,
          impressions: 100,
          ctr: 0.05,
          position: 7.25,
        },
        {
          keys: ["2026-10-03"],
          clicks: 1,
          impressions: 10,
          ctr: 0.1,
          position: 3.5,
        },
      ],
    },
    SITE,
  );

  it("sorts oldest first and fills gaps between returned days", () => {
    expect(daily.site_url).toBe(SITE);
    expect(daily.days.map((d) => d.date)).toEqual([
      "2026-10-03",
      "2026-10-04",
      "2026-10-05",
      "2026-10-06",
    ]);
    expect(daily.days[1]).toEqual({
      date: "2026-10-04",
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    });
  });

  it("does not add days after the last one Google returned", () => {
    // Yesterday would be later than 6 October, but Google has not published it.
    expect(daily.days[daily.days.length - 1].date).toBe("2026-10-06");
  });

  it("passes ctr and position through unchanged", () => {
    expect(daily.days[3]).toEqual({
      date: "2026-10-06",
      clicks: 5,
      impressions: 100,
      ctr: 0.05,
      position: 7.25,
    });
    expect(daily.days[0].ctr).toBe(0.1);
    expect(daily.days[0].position).toBe(3.5);
  });

  it("returns no days when Google sends no rows", () => {
    expect(parseGscDaily({}, SITE)).toEqual({ site_url: SITE, days: [] });
  });

  it("skips rows without a real date", () => {
    const parsed = parseGscDaily(
      { rows: [{ keys: ["not-a-date"], clicks: 3 }, { clicks: 1 }] },
      SITE,
    );
    expect(parsed.days).toEqual([]);
  });
});

describe("top queries and pages", () => {
  it("parses ranged queries with the most clicks first", () => {
    const answers = [
      {
        rows: [
          {
            keys: ["thyroid test"],
            clicks: 2,
            impressions: 40,
            ctr: 0.05,
            position: 4.4,
          },
          {
            keys: ["vitamin d test"],
            clicks: 6,
            impressions: 30,
            ctr: 0.2,
            position: 2.1,
          },
        ],
      },
      {},
      {
        rows: [
          {
            keys: ["thyroid test"],
            clicks: 9,
            impressions: 99,
            ctr: 0.0909,
            position: 5,
          },
        ],
      },
    ];
    const ranges = toRanged(answers.map(parseGscTopQueries));
    expect(ranges["7"]).toEqual([
      {
        query: "vitamin d test",
        clicks: 6,
        impressions: 30,
        ctr: 0.2,
        position: 2.1,
      },
      {
        query: "thyroid test",
        clicks: 2,
        impressions: 40,
        ctr: 0.05,
        position: 4.4,
      },
    ]);
    expect(ranges["28"]).toEqual([]);
    expect(ranges["90"][0].ctr).toBe(0.0909);
  });

  it("parses top pages as full URLs and drops rows without a key", () => {
    expect(
      parseGscTopPages({
        rows: [
          {
            keys: [`${SITE}compare`],
            clicks: 1,
            impressions: 9,
            ctr: 0.111,
            position: 6,
          },
          { keys: [], clicks: 4, impressions: 4, ctr: 1, position: 1 },
        ],
      }),
    ).toEqual([
      {
        page: `${SITE}compare`,
        clicks: 1,
        impressions: 9,
        ctr: 0.111,
        position: 6,
      },
    ]);
  });

  it("totals clicks for the connection test", () => {
    expect(gscTotalClicks({})).toEqual({ rows: 0, clicks: 0 });
    expect(
      gscTotalClicks({ rows: [{ keys: ["2026-10-05"], clicks: 12 }] }),
    ).toEqual({ rows: 1, clicks: 12 });
  });
});
