/**
 * Encode one CSV cell so spreadsheet apps never treat it as a formula.
 * Cells starting with =, +, -, @, tab or carriage return get a leading
 * apostrophe; quotes, commas and newlines are escaped by RFC 4180 quoting.
 */
export const csvSafeCell = (value: unknown): string => {
  const raw = value == null ? "" : String(value);
  const neutralised = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return /[",\n\r]/.test(neutralised)
    ? `"${neutralised.replace(/"/g, '""')}"`
    : neutralised;
};

export const csvSafeRow = (cells: readonly unknown[]): string =>
  cells.map(csvSafeCell).join(",");
