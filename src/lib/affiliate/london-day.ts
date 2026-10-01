/** Offset of Europe/London from UTC, in ms, at the given instant. */
function londonOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (t: string): number =>
    Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** Midnight in Europe/London on the given YYYY-MM-DD date, as a UTC instant. */
export function londonDayStart(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  // Two passes settle the offset across a clock change.
  let t = guess - londonOffsetMs(new Date(guess));
  t = guess - londonOffsetMs(new Date(t));
  return new Date(t);
}

/** Exclusive upper bound: midnight in Europe/London at the start of the next day. */
export function nextLondonDayStart(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  return londonDayStart(next);
}
