import { describe, expect, it } from "vitest";
import {
  checkPoint,
  extractNumbers,
  MAX_BRIEF_POINTS,
  validateBrief,
} from "../../../../supabase/functions/os-plugins/lib/number-check";
import type { OsFact } from "../../../../supabase/functions/_shared/os/contract";

function fact(partial: Partial<OsFact> & Pick<OsFact, "id" | "value">): OsFact {
  return {
    label: "Figure",
    unit: "count",
    period: "",
    source: "Test",
    ...partial,
  };
}

const clicks = fact({
  id: "clicks.qualified",
  label: "Qualified provider clicks",
  value: 1234,
  period: "last 28 days",
});
const share = fact({
  id: "clicks.top_share",
  label: "Share of clicks to the top provider",
  value: 64.347,
  unit: "percent",
  period: "last 7 days",
});
const commission = fact({
  id: "revenue.commission",
  label: "Commission",
  value: 1234.5,
  unit: "gbp",
  period: "last 28 days",
});
const lastClick = fact({
  id: "clicks.last_at",
  label: "Last qualified click",
  value: "4 Oct 2026",
  unit: "text",
});
const change = fact({ id: "clicks.change", label: "Change", value: -3 });
const FACTS = [clicks, share, commission, lastClick, change];

describe("extractNumbers", () => {
  it("reads thousands separators, decimals, pounds, percentages and both minus signs", () => {
    const values = extractNumbers(
      "1,234 clicks, 12.5%, £1,234.50, -3 and −3",
    ).map((n) => n.value);
    expect(values).toEqual([1234, 12.5, 1234.5, -3, -3]);
  });

  it("does not read hyphens inside dates or compound words as minus signs", () => {
    const values = extractNumbers("On 2026-10-04 the 28-day total").map(
      (n) => n.value,
    );
    expect(values).toEqual([2026, 10, 4, 28]);
  });

  it("ignores digits that are part of a name such as GA4", () => {
    expect(extractNumbers("GA4 reports")).toEqual([]);
  });
});

describe("checkPoint", () => {
  it("allows the exact value written with a thousands separator", () => {
    expect(checkPoint("Qualified clicks reached 1,234.", [clicks]).ok).toBe(
      true,
    );
  });

  it("allows rounding to 0, 1 or 2 decimal places and nothing else", () => {
    expect(checkPoint("64.35% went to one provider.", [share]).ok).toBe(true);
    expect(checkPoint("64.3% went to one provider.", [share]).ok).toBe(true);
    const wrong = checkPoint("64.4% went to one provider.", [share]);
    expect(wrong.ok).toBe(false);
    expect(wrong.offending).toEqual(["64.4%"]);
  });

  it("lets a percent fact appear as a whole percentage", () => {
    expect(
      checkPoint("About 64% of clicks went to one provider.", [share]).ok,
    ).toBe(true);
    expect(
      checkPoint("A share of 0.64 went to one provider.", [share]).ok,
    ).toBe(false);
  });

  it("allows a currency figure with pound sign and pence", () => {
    expect(checkPoint("Commission was £1,234.50.", [commission]).ok).toBe(true);
    expect(checkPoint("Commission was £1,235.", [commission]).ok).toBe(true);
    expect(checkPoint("Commission was £1,300.", [commission]).ok).toBe(false);
  });

  it("allows numbers written in the label or period", () => {
    expect(
      checkPoint("Over the last 28 days there were 1,234 clicks.", [clicks]).ok,
    ).toBe(true);
    expect(
      checkPoint("Over the last 30 days there were 1,234 clicks.", [clicks]),
    ).toEqual({ ok: false, offending: ["30"] });
  });

  it("allows the day and year of a date held as text", () => {
    expect(
      checkPoint("The last click was on 4 Oct 2026.", [lastClick]).ok,
    ).toBe(true);
    expect(
      checkPoint("The last click was on 5 Oct 2026.", [lastClick]).ok,
    ).toBe(false);
  });

  it("accepts a unicode minus for a negative fact but not an invented sign", () => {
    expect(checkPoint("Clicks moved by −3.", [change]).ok).toBe(true);
    expect(checkPoint("Clicks fell by 3.", [change]).ok).toBe(true);
    const positive = fact({ id: "p", value: 3 });
    expect(checkPoint("Clicks moved by −3.", [positive]).ok).toBe(false);
  });

  it("only counts the facts the point cites", () => {
    expect(checkPoint("Commission was £1,234.50.", [clicks]).ok).toBe(false);
  });

  it("treats number words as numbers", () => {
    expect(checkPoint("Two plugins are failing.", [clicks]).ok).toBe(false);
  });

  it("does not let digits from a cited date or time stand for other figures", () => {
    const lastAt = fact({
      id: "clicks.last_click_at",
      label: "Last provider click of any kind",
      value: "4 Oct, 14:05 London time",
      unit: "text",
    });
    expect(
      checkPoint("The last click was at 14:05 on 4 Oct.", [lastAt]).ok,
    ).toBe(true);
    expect(checkPoint("The last click was 14 days ago.", [lastAt])).toEqual({
      ok: false,
      offending: ["14"],
    });
    const gsc = fact({
      id: "gsc.clicks",
      label: "Search clicks",
      value: 530,
      period: "28 days to 6 Oct",
    });
    expect(checkPoint("Search clicks fell 6%.", [gsc]).ok).toBe(false);
    expect(
      checkPoint("Search clicks were 530 in the 28 days to 6 Oct.", [gsc]).ok,
    ).toBe(true);
  });

  it("checks teens, zero, compounds and vague amounts", () => {
    const fifteen = fact({ id: "d", value: 15, unit: "days" });
    expect(checkPoint("No clicks for fifteen days.", [fifteen]).ok).toBe(true);
    expect(checkPoint("No clicks for sixteen days.", [fifteen]).ok).toBe(false);
    expect(checkPoint("Clicks rose from zero.", [clicks]).ok).toBe(false);
    expect(checkPoint("Twenty-five clicks arrived.", [clicks]).ok).toBe(false);
    const twentyFive = fact({ id: "c25", value: 25 });
    expect(checkPoint("Twenty-five clicks arrived.", [twentyFive]).ok).toBe(
      true,
    );
    expect(checkPoint("Hundreds of clicks arrived.", [clicks]).ok).toBe(false);
  });

  it("matches £ only to money, % only to percentages and plain only to counts", () => {
    const pounds = fact({ id: "r", value: 45.5, unit: "gbp" });
    expect(checkPoint("Commission rose 46%.", [pounds]).ok).toBe(false);
    expect(checkPoint("Clicks earned £1,234.", [clicks]).ok).toBe(false);
    expect(checkPoint("Commission was 45.50.", [pounds]).ok).toBe(false);
    expect(checkPoint("Commission was £45.50.", [pounds]).ok).toBe(true);
  });

  it("rejects a direction word that contradicts the cited change", () => {
    const changePct = fact({
      id: "clicks.change_pct",
      label: "Change in qualified provider clicks",
      value: -12.5,
      unit: "percent",
    });
    expect(checkPoint("Clicks rose 12.5%.", [changePct]).ok).toBe(false);
    expect(checkPoint("Clicks fell 12.5%.", [changePct]).ok).toBe(true);
    expect(checkPoint("Clicks changed by −12.5%.", [changePct]).ok).toBe(true);
    expect(checkPoint("Clicks changed by +12.5%.", [changePct]).ok).toBe(false);
  });
});

describe("validateBrief", () => {
  it("keeps points whose numbers match their cited facts", () => {
    const out = validateBrief(
      {
        headline: "1,234 qualified clicks in the last 28 days",
        points: [
          { text: "Qualified clicks reached 1,234.", fact_ids: [clicks.id] },
        ],
      },
      FACTS,
    );
    expect(out).toEqual({
      headline: "1,234 qualified clicks in the last 28 days",
      points: [
        { text: "Qualified clicks reached 1,234.", fact_ids: [clicks.id] },
      ],
      dropped: 0,
    });
  });

  it("drops a point that cites an unknown fact id", () => {
    const out = validateBrief(
      {
        headline: "Clicks are steady",
        points: [
          { text: "Clicks reached 1,234.", fact_ids: [clicks.id, "made.up"] },
          { text: "Commission was £1,234.50.", fact_ids: [commission.id] },
        ],
      },
      FACTS,
    );
    expect(out.points.map((p) => p.fact_ids)).toEqual([[commission.id]]);
    expect(out.dropped).toBe(1);
  });

  it("drops a point with an invented number", () => {
    const out = validateBrief(
      {
        headline: "Clicks are up",
        points: [
          { text: "Clicks rose 15% to 1,234.", fact_ids: [clicks.id] },
          { text: "Clicks reached 1,234.", fact_ids: [clicks.id] },
        ],
      },
      FACTS,
    );
    expect(out.points).toHaveLength(1);
    expect(out.points[0].text).toBe("Clicks reached 1,234.");
    expect(out.dropped).toBe(1);
  });

  it("drops a point that cites no facts", () => {
    const out = validateBrief(
      {
        headline: "Nothing to report",
        points: [
          { text: "Everything looks fine.", fact_ids: [] },
          { text: "Clicks reached 1,234.", fact_ids: [clicks.id] },
        ],
      },
      FACTS,
    );
    expect(out.points).toHaveLength(1);
    expect(out.dropped).toBe(1);
  });

  it("nulls a headline with a number that no surviving point cites", () => {
    const out = validateBrief(
      {
        headline: "Commission reached £1,234.50",
        points: [
          { text: "Clicks reached 1,234.", fact_ids: [clicks.id] },
          // Dropped, so its fact cannot support the headline.
          { text: "Commission was £9,999.", fact_ids: [commission.id] },
        ],
      },
      FACTS,
    );
    expect(out.headline).toBeNull();
    expect(out.points).toHaveLength(1);
    expect(out.dropped).toBe(1);
  });

  it("nulls the headline when no point survives", () => {
    const out = validateBrief(
      {
        headline: "Quiet week",
        points: [{ text: "Clicks reached 42.", fact_ids: [clicks.id] }],
      },
      FACTS,
    );
    expect(out).toEqual({ headline: null, points: [], dropped: 1 });
  });

  it("keeps at most five points and removes repeated fact ids", () => {
    const points = Array.from({ length: 7 }, () => ({
      text: "Clicks reached 1,234.",
      fact_ids: [clicks.id, clicks.id],
    }));
    const out = validateBrief({ headline: "Clicks", points }, FACTS);
    expect(out.points).toHaveLength(MAX_BRIEF_POINTS);
    expect(out.points[0].fact_ids).toEqual([clicks.id]);
  });

  it("returns nothing for a reply that is not the expected shape", () => {
    expect(validateBrief(null, FACTS)).toEqual({
      headline: null,
      points: [],
      dropped: 0,
    });
    expect(validateBrief({ headline: "x", points: "y" }, FACTS).points).toEqual(
      [],
    );
  });
});
