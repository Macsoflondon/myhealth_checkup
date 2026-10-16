import { describe, expect, it } from "vitest";
import {
  ctr,
  dayNumber,
  daySpan,
  ratio,
  sumBy,
  weightedPosition,
} from "@/lib/os/series";

type Day = {
  date: string;
  sessions: number;
  users: number | null;
  label: string;
};

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
