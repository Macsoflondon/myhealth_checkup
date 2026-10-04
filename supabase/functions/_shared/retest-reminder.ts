// Shared helpers for the retest reminder edge functions.

export const COMPANY_LINE =
  "MYHEALTHCHECKUP LTD (Company No. 16589056)";
export const FROM_ADDRESS = "myhealth checkup <support@myhealthcheckup.co.uk>";
export const SITE_URL = "https://myhealthcheckup.co.uk";

export const escapeHtml = (v: unknown): string =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );

export function unsubscribeUrl(supabaseUrl: string, token: string): string {
  return `${supabaseUrl}/functions/v1/retest-reminder-unsubscribe?token=${encodeURIComponent(token)}`;
}

export function interestUrl(type: string, slug: string): string {
  const s = encodeURIComponent(slug);
  return type === "biomarker"
    ? `${SITE_URL}/biomarkers?q=${s}`
    : `${SITE_URL}/compare?q=${s}`;
}

export function formatUkDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}
