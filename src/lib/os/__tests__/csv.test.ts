import { afterEach, describe, expect, it, vi } from "vitest";
import { csvCell, csvFilename, downloadCsv, toCsv } from "@/lib/os/csv";

type Row = {
  page: string | null;
  clicks: number | null;
  share?: number;
};

const columns = [
  { header: "Page", value: (r: Row) => r.page },
  { header: "Clicks", value: (r: Row) => r.clicks },
  { header: "Share", value: (r: Row) => r.share },
];

describe("csvCell", () => {
  it("leaves plain text alone", () => {
    expect(csvCell("Medichecks")).toBe("Medichecks");
    expect(csvCell("/provider/lola-health")).toBe("/provider/lola-health");
  });

  it("quotes commas, quotes and line breaks", () => {
    expect(csvCell("Thyroid, iron and vitamin D")).toBe(
      '"Thyroid, iron and vitamin D"',
    );
    expect(csvCell('The "Advanced" panel')).toBe('"The ""Advanced"" panel"');
    expect(csvCell("line one\nline two")).toBe('"line one\nline two"');
    expect(csvCell("line one\r\nline two")).toBe('"line one\r\nline two"');
    expect(csvCell(" padded ")).toBe('" padded "');
  });

  it("writes null, undefined and non-finite numbers as empty fields", () => {
    expect(csvCell(null)).toBe("");
    expect(csvCell(undefined)).toBe("");
    expect(csvCell(Number.NaN)).toBe("");
    expect(csvCell(Number.POSITIVE_INFINITY)).toBe("");
  });

  it("writes numbers without grouping or currency symbols", () => {
    expect(csvCell(0)).toBe("0");
    expect(csvCell(1234567)).toBe("1234567");
    expect(csvCell(12.5)).toBe("12.5");
    expect(csvCell(-3.25)).toBe("-3.25");
    expect(csvCell(true)).toBe("true");
    expect(csvCell(false)).toBe("false");
  });

  it("stops text cells running as spreadsheet formulas", () => {
    expect(csvCell("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
    expect(csvCell("+44 20")).toBe("'+44 20");
    expect(csvCell("-1")).toBe("'-1");
    expect(csvCell("@cmd")).toBe("'@cmd");
    expect(csvCell('=HYPERLINK("x","y")')).toBe(`"'=HYPERLINK(""x"",""y"")"`);
  });
});

describe("toCsv", () => {
  it("writes the header in column order, then one CRLF line per row", () => {
    const csv = toCsv<Row>(
      [
        { page: "/compare", clicks: 12, share: 0.5 },
        { page: "/a,b", clicks: null },
      ],
      columns,
    );
    expect(csv).toBe('Page,Clicks,Share\r\n/compare,12,0.5\r\n"/a,b",,\r\n');
  });

  it("follows the order of the columns, not of the row's keys", () => {
    const reversed = [...columns].reverse();
    const csv = toCsv<Row>([{ page: "/x", clicks: 3, share: 1 }], reversed);
    expect(csv.split("\r\n")[0]).toBe("Share,Clicks,Page");
    expect(csv.split("\r\n")[1]).toBe("1,3,/x");
  });

  it("quotes headers that need it", () => {
    const csv = toCsv<Row>(
      [],
      [{ header: "Commission, GBP", value: (r) => r.clicks }],
    );
    expect(csv).toBe('"Commission, GBP"\r\n');
  });

  it("returns only the header when there are no rows", () => {
    expect(toCsv<Row>([], columns)).toBe("Page,Clicks,Share\r\n");
  });

  it("keeps a quoted field with a line break as one record", () => {
    const csv = toCsv<Row>([{ page: "a\nb", clicks: 1 }], columns);
    expect(csv).toBe('Page,Clicks,Share\r\n"a\nb",1,\r\n');
  });
});

describe("csvFilename", () => {
  it("keeps safe names and adds the extension once", () => {
    expect(csvFilename("provider-clicks-2026-10-09")).toBe(
      "provider-clicks-2026-10-09.csv",
    );
    expect(csvFilename("clicks.csv")).toBe("clicks.csv");
  });

  it("replaces unsafe characters and never returns an empty name", () => {
    expect(csvFilename("clicks / by provider")).toBe("clicks-by-provider.csv");
    expect(csvFilename("../../etc")).toBe("etc.csv");
    expect(csvFilename("")).toBe("export.csv");
  });
});

describe("downloadCsv", () => {
  const original = {
    create: URL.createObjectURL,
    revoke: URL.revokeObjectURL,
  };

  afterEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      value: original.create,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: original.revoke,
      configurable: true,
      writable: true,
    });
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("clicks a temporary link to a CSV blob, then releases it", () => {
    vi.useFakeTimers();
    const create = vi.fn((_blob: Blob) => "blob:mock-csv");
    const revoke = vi.fn((_url: string) => undefined);
    Object.defineProperty(URL, "createObjectURL", {
      value: create,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: revoke,
      configurable: true,
      writable: true,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    downloadCsv("clicks by day", "Day,Clicks\r\n");

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0].type).toContain("text/csv");
    expect(click).toHaveBeenCalledTimes(1);
    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe("clicks-by-day.csv");
    expect(link.getAttribute("href")).toBe("blob:mock-csv");
    expect(document.querySelector("a[download]")).toBeNull();

    expect(revoke).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith("blob:mock-csv");
  });
});
