/** Only infrastructure-overwritten headers may identify the client. */
export function clientIp(headers: Headers): string | null {
  for (const name of ["cf-connecting-ip", "x-real-ip"]) {
    const value = headers.get(name)?.trim();
    if (!value) continue;
    if (isIpLiteral(value)) return value;
  }
  return null;
}

function isIpLiteral(value: string): boolean {
  if (/^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  if (!value.includes(":") || !/^[\da-f:.]+$/i.test(value)) return false;
  try {
    // WHATWG URL validates compressed IPv6 and embedded IPv4 without Node APIs.
    return new URL(`http://[${value}]/`).hostname.startsWith("[");
  } catch {
    return false;
  }
}
