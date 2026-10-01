import { describe, expect, it, vi } from "vitest";
import {
  appendClickId,
  handleAffiliateAnchorClick,
  inferPlacement,
  sanitiseSourcePage,
  type AffiliateClickPayload,
} from "../affiliate-tracking";
import { providerForHost } from "../affiliate-config";
import {
  normaliseStatus,
  parseConversionsCsv,
  parseDate,
  parseMoney,
  splitCsv,
} from "../parse-conversions-csv";

const CID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("affiliate config", () => {
  it("maps hosts and subdomains to providers", () => {
    expect(providerForHost("www.medichecks.com")).toBe("medichecks");
    expect(providerForHost("evilmedichecks.com")).toBeNull();
  });
});

describe("appendClickId", () => {
  it("leaves the URL unchanged when no parameter is configured", () => {
    expect(appendClickId("https://medichecks.com/a", "medichecks", CID)).toBe(
      "https://medichecks.com/a",
    );
  });
  it("adds the configured parameter", () => {
    const out = appendClickId("https://x.com/a?b=1", "p", CID, {
      p: { hosts: ["x.com"], subIdParam: "clickref" },
    });
    expect(new URL(out).searchParams.get("clickref")).toBe(CID);
    expect(new URL(out).searchParams.get("b")).toBe("1");
  });
});

describe("source page and placement", () => {
  it("strips query strings and hashes", () => {
    expect(sanitiseSourcePage("/compare?q=x#y")).toBe("/compare");
  });
  it("infers placement from the route", () => {
    expect(inferPlacement("/provider/randox/tests/abc")).toBe("detail");
    expect(inferPlacement("/compare")).toBe("comparison");
  });
});

describe("handleAffiliateAnchorClick", () => {
  it("logs provider links with declared placement and test id, no personal data", () => {
    document.body.innerHTML = `<div data-affiliate-test-id="t1"><a data-affiliate-placement="card" href="https://www.randoxhealth.com/x?utm=1">Book</a></div>`;
    const a = document.querySelector("a")!;
    const send = vi.fn<(p: AffiliateClickPayload) => void>();
    const p = handleAffiliateAnchorClick(a, "/tests?secret=1", send);
    expect(p).toMatchObject({
      provider_id: "randox",
      test_id: "t1",
      placement: "card",
      source_page: "/tests",
      destination_host: "www.randoxhealth.com",
    });
    expect(Object.keys(p!).sort()).toEqual([
      "click_id",
      "destination_host",
      "placement",
      "provider_id",
      "source_page",
      "test_id",
    ]);
    expect(send).toHaveBeenCalledOnce();
  });
  it("ignores non-provider links", () => {
    document.body.innerHTML = `<a href="https://example.com">x</a>`;
    expect(
      handleAffiliateAnchorClick(document.querySelector("a")!, "/", vi.fn()),
    ).toBeNull();
  });
  it("never throws when sending fails", () => {
    document.body.innerHTML = `<a href="https://medichecks.com/x">x</a>`;
    const a = document.querySelector("a")!;
    expect(() =>
      handleAffiliateAnchorClick(a, "/", () => {
        throw new Error("down");
      }),
    ).not.toThrow();
    expect(a.href).toBe("https://medichecks.com/x");
  });
});

describe("conversion CSV parsing", () => {
  it("splits quoted fields", () => {
    expect(splitCsv('a,"b,""c"""\r\n1,2')).toEqual([
      ["a", 'b,"c"'],
      ["1", "2"],
    ]);
  });
  it("normalises status, money and UK dates", () => {
    expect(normaliseStatus("Approved")).toBe("confirmed");
    expect(normaliseStatus("declined")).toBe("reversed");
    expect(normaliseStatus("weird")).toBeNull();
    expect(parseMoney("£1,234.567")).toBe(1234.57);
    expect(parseDate("31/01/2026")).toBe("2026-01-31T00:00:00.000Z");
    expect(parseDate("31/02/2026")).toBeNull();
  });
  it("maps network aliases and uses the chosen provider", () => {
    const csv = `Order ID,SubID,Status,Sale Amount,Commission,Date\nR1,${CID},approved,100,10,01/02/2026\nR2,,pending,50,5,02/02/2026`;
    const { rows, errors } = parseConversionsCsv(csv, "medichecks");
    expect(errors).toEqual([]);
    expect(rows[0]).toEqual({
      click_id: CID,
      provider_id: "medichecks",
      network_reference: "R1",
      status: "confirmed",
      order_value_gbp: 100,
      commission_gbp: 10,
      converted_at: "2026-02-01T00:00:00.000Z",
    });
    expect(rows[1].click_id).toBeNull();
  });
  it("reports missing columns and bad rows", () => {
    expect(parseConversionsCsv("foo\n1", "x").errors.length).toBeGreaterThan(0);
    const r = parseConversionsCsv("reference,date\nR1,notadate", "x");
    expect(r.rows).toEqual([]);
    expect(r.errors[0]).toMatch(/Row 2/);
  });
});
