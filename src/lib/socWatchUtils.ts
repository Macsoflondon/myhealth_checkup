export type SocSeverity = "critical" | "high" | "medium" | "low" | "info";

export const SOC_SEVERITY_ORDER: Record<SocSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

const KNOWN_SEVERITIES: Record<string, SocSeverity> = {
  critical: "critical",
  emergency: "critical",
  severe: "critical",
  high: "high",
  error: "high",
  failed: "high",
  warning: "medium",
  warn: "medium",
  medium: "medium",
  denied: "medium",
  low: "low",
  resolved: "low",
  success: "low",
  info: "info",
  informational: "info",
  logged: "info",
};

export function normaliseSocSeverity(value: unknown): SocSeverity {
  if (typeof value !== "string") return "info";
  const key = value.trim().toLowerCase();
  return KNOWN_SEVERITIES[key] ?? "info";
}

export function severityFromHttpStatus(status: number | null | undefined): SocSeverity {
  if (typeof status !== "number") return "info";
  if (status >= 500) return "high";
  if (status >= 400) return "medium";
  if (status >= 300) return "low";
  return "info";
}

export function maskSensitiveIdentifier(value: string | null | undefined): string {
  if (!value) return "—";
  const trimmed = value.trim();
  if (!trimmed) return "—";

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed)) {
    const parts = trimmed.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.•••`;
  }

  const emailParts = trimmed.match(/^(.)([^@]*)(@.+)$/);
  if (emailParts) {
    return `${emailParts[1]}•••${emailParts[3]}`;
  }

  if (trimmed.length <= 8) return trimmed;
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
}

export function humaniseToken(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatSocDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function compareSeverityThenTime<T extends { severity: SocSeverity; occurredAt: string }>(
  left: T,
  right: T,
): number {
  const severityDelta = SOC_SEVERITY_ORDER[right.severity] - SOC_SEVERITY_ORDER[left.severity];
  if (severityDelta !== 0) return severityDelta;
  return new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();
}