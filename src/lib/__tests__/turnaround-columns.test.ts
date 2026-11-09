import { describe, expect, it } from "vitest";
import { turnaroundColumns } from "../../../supabase/functions/_shared/scrape/parseTurnaround";

describe("turnaroundColumns", () => {
  it("drops Lola sentence fragments", () => {
    expect(turnaroundColumns("results")).toBeNull();
    expect(
      turnaroundColumns("results, but do not provide consultations, medical advice, or diagnoses"),
    ).toBeNull();
  });
  it("writes raw, days, hours and unit together", () => {
    expect(turnaroundColumns("2 working days")).toEqual({
      turnaround_raw: "2 working days",
      turnaround_days: 2,
      turnaround_hours: 48,
      turnaround_unit: "days",
    });
    expect(turnaroundColumns("24-48 hours")?.turnaround_unit).toBe("hours");
  });
});
