/**
 * CSV export for the AI OS dashboard.
 *
 * toCsv is pure (RFC 4180 quoting, CRLF line ends) so vitest and node can
 * check it. downloadCsv needs a browser: it hands the text to the browser as
 * a file through a Blob and a temporary object URL.
 */

export type CsvValue = string | number | boolean | null | undefined;

export type CsvColumn<T> = {
  /** Header text. Columns are written in the order given. */
  header: string;
  value: (row: T) => CsvValue;
};

// A field needs quotes when it holds a delimiter, a quote or a line break, or
// starts or ends with whitespace that a reader might trim.
const NEEDS_QUOTES = /[",\r\n]|^\s|\s$/;

// Spreadsheet apps run text that starts with one of these as a formula. Scraped
// test names and page paths reach these files, so text cells starting this way
// get a leading apostrophe. Numbers are written as numbers and never changed.
const FORMULA_START = /^[=+\-@\t\r]/;

/** One field as CSV text. Null, undefined, NaN and infinities are empty. */
export function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = FORMULA_START.test(value) ? `'${value}` : value;
  return NEEDS_QUOTES.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** A header row then one row per item, each line ending in CRLF. */
export function toCsv<T>(
  rows: readonly T[],
  columns: readonly CsvColumn<T>[],
): string {
  const lines = [columns.map((c) => csvCell(c.header)).join(",")];
  for (const row of rows) {
    lines.push(columns.map((c) => csvCell(c.value(row))).join(","));
  }
  return `${lines.join("\r\n")}\r\n`;
}

/** A safe download name ending in .csv: letters, digits, dot, dash, underscore. */
export function csvFilename(name: string): string {
  const base = name
    .trim()
    .replace(/\.csv$/i, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return `${base || "export"}.csv`;
}

/** Saves CSV text as a file in the browser. */
export function downloadCsv(filename: string, csv: string): void {
  // The byte order mark tells Excel the file is UTF-8, so £ signs and accented
  // names survive.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = csvFilename(filename);
  link.style.display = "none";
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    // Some browsers read the object URL after click() returns, so release it
    // a moment later rather than straight away.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
