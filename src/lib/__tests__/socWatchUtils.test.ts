import { describe, expect, it } from "vitest";
import {
  compareSeverityThenTime,
  formatSocDateTime,
  maskSensitiveIdentifier,
  normaliseSocSeverity,
  severityFromHttpStatus,
} from "../socWatchUtils";

describe("socWatchUtils", () => {
  it("normalises operational severity labels", () => {
    expect(normaliseSocSeverity("critical")).toBe("critical");
    expect(normaliseSocSeverity("ERROR")).toBe("high");
    expect(normaliseSocSeverity("warning")).toBe("medium");
    expect(normaliseSocSeverity("unknown")).toBe("info");
  });

  it("classifies HTTP status codes without leaking transport detail", () => {
    expect(severityFromHttpStatus(503)).toBe("high");
    expect(severityFromHttpStatus(403)).toBe("medium");
    expect(severityFromHttpStatus(302)).toBe("low");
    expect(severityFromHttpStatus(200)).toBe("info");
  });

  it("masks user, email and IP identifiers for GDPR-safe displays", () => {
    expect(maskSensitiveIdentifier("192.168.10.22")).toBe("192.168.10.•••");
    expect(maskSensitiveIdentifier("person@example.co.uk")).toBe("p•••@example.co.uk");
    expect(maskSensitiveIdentifier("7f0d79ec-0db6-4a31-b2fd-bbb9dbd902da")).toBe("7f0d79…02da");
  });

  it("formats timestamps using UK date ordering", () => {
    expect(formatSocDateTime("2026-07-05T09:14:00Z")).toContain("05/07/2026");
  });

  it("orders higher severity before newer lower-severity records", () => {
    const ordered = [
      { severity: "low" as const, occurredAt: "2026-07-05T11:00:00Z" },
      { severity: "critical" as const, occurredAt: "2026-07-05T10:00:00Z" },
    ].sort(compareSeverityThenTime);

    expect(ordered[0].severity).toBe("critical");
  });
});