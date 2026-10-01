import { describe, expect, it } from "vitest";
import { parseConversionsCsv } from "../parse-conversions-csv";
import { londonDayStart, nextLondonDayStart } from "../london-day";

describe("conversion CSV dedup and provider check", () => {
  it("keeps the last duplicate and reports how many were dropped", () => {
    const csv =
      "Order ID,Status,Commission,Date\nR1,pending,5,01/02/2026\nR2,pending,1,01/02/2026\nR1,approved,7,03/02/2026";
    const r = parseConversionsCsv(csv, "medichecks");
    expect(r.duplicatesDropped).toBe(1);
    expect(r.rows).toHaveLength(2);
    expect(r.rows.find((x) => x.network_reference === "R1")).toMatchObject({
      status: "confirmed",
      commission_gbp: 7,
    });
  });
  it("treats the same reference for different providers as distinct", () => {
    const csv =
      "provider,reference,date\nmedichecks,R1,01/02/2026\nrandox,R1,01/02/2026";
    expect(parseConversionsCsv(csv, null).duplicatesDropped).toBe(0);
  });
  it("rejects unknown providers in row errors", () => {
    const csv =
      "provider,reference,date\nthriva,R1,01/02/2026\nconstructor,R2,01/02/2026\nmedichecks,R3,01/02/2026";
    const r = parseConversionsCsv(csv, null);
    expect(r.rows.map((x) => x.network_reference)).toEqual(["R3"]);
    expect(r.errors).toEqual([
      'Row 2: unknown provider "thriva".',
      'Row 3: unknown provider "constructor".',
    ]);
  });
});

describe("London day bounds", () => {
  it("uses GMT in winter", () => {
    expect(londonDayStart("2026-01-15").toISOString()).toBe(
      "2026-01-15T00:00:00.000Z",
    );
    expect(nextLondonDayStart("2026-01-31").toISOString()).toBe(
      "2026-02-01T00:00:00.000Z",
    );
  });
  it("uses BST in summer, so the last day is fully counted", () => {
    expect(nextLondonDayStart("2026-07-10").toISOString()).toBe(
      "2026-07-10T23:00:00.000Z",
    );
    expect(londonDayStart("2026-07-10").toISOString()).toBe(
      "2026-07-09T23:00:00.000Z",
    );
  });
  it("handles the clock-change days", () => {
    expect(nextLondonDayStart("2026-03-28").toISOString()).toBe(
      "2026-03-29T00:00:00.000Z",
    );
    expect(nextLondonDayStart("2026-03-29").toISOString()).toBe(
      "2026-03-29T23:00:00.000Z",
    );
    expect(nextLondonDayStart("2026-10-24").toISOString()).toBe(
      "2026-10-24T23:00:00.000Z",
    );
    expect(nextLondonDayStart("2026-10-25").toISOString()).toBe(
      "2026-10-26T00:00:00.000Z",
    );
  });
});
