/**
 * Retest reminder: one optional email, 3, 6 or 12 months later, nudging a
 * visitor to look again at a test or biomarker. Comparison nudge only, never
 * medical advice. Pure logic here; I/O is injected so it can be unit tested.
 */

export const RETEST_CONSENT_TEXT =
  "I agree to receive one email from myhealth checkup at the time I chose. I can unsubscribe at any time.";
export const RETEST_ENDPOINT = "retest-reminder-subscribe";
export const RETEST_RATE_LIMIT_MAX = 5;
export const RETEST_RATE_LIMIT_WINDOW_MIN = 60;
export const RETEST_SUCCESS_MESSAGE = "Done. We will email you on the date you chose.";
export const RETEST_INTERVALS = [3, 6, 12] as const;
export type RetestIntervalMonths = (typeof RETEST_INTERVALS)[number];

export const COMPANY_LINE = "MYHEALTHCHECKUP LTD (Company No. 16589056)";
export const FROM_ADDRESS = "myhealth checkup <support@myhealthcheckup.co.uk>";
export const SITE_URL = "https://myhealthcheckup.co.uk";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SLUG_RE = /^[a-z0-9][a-z0-9._-]{0,119}$/i;
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const escapeHtml = (v: unknown): string =>
  String(v ?? "").replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c] ?? c;
  });

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= 254 && EMAIL_RE.test(email);
}

export function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

export function formatUkDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/public/retest-reminder/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function interestUrl(type: string, slug: string): string {
  const s = encodeURIComponent(slug);
  return type === "biomarker" ? `${SITE_URL}/biomarkers?q=${s}` : `${SITE_URL}/compare?q=${s}`;
}

export function listUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export interface NewRetestReminder {
  email: string;
  interest_type: "test" | "biomarker";
  interest_slug: string;
  interest_label: string;
  interval_months: RetestIntervalMonths;
  remind_at: string;
  consent_text: string;
  consent_ip: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  headers: Record<string, string>;
}

export interface SubscribeDeps {
  countRecent(ip: string, sinceIso: string): Promise<number>;
  recordHit(ip: string): Promise<void>;
  /** Unsubscribe token when inserted; null when the row already existed (nothing changed). */
  insertIfAbsent(row: NewRetestReminder): Promise<string | null>;
  sendEmail(msg: EmailMessage): Promise<void>;
  now(): Date;
}

const json = (payload: unknown, status = 200): Response =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export function confirmationEmail(label: string, remindAt: Date, token: string): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#081129;">
  <p>You asked us to send you one email on ${escapeHtml(formatUkDate(remindAt))} to look at ${escapeHtml(label)} again on myhealth checkup.</p>
  <p>That is the only email we will send for this reminder.</p>
  <p><a href="${escapeHtml(unsubscribeUrl(token))}" style="color:#e70d69;">Unsubscribe</a> if you no longer want it.</p>
  <p style="color:#555;font-size:12px;margin-top:24px;">${escapeHtml(COMPANY_LINE)}</p>
</div>`;
}

export function reminderEmail(type: string, slug: string, label: string, token: string): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#081129;">
  <p>You asked us to remind you to look at ${escapeHtml(label)} again.</p>
  <p><a href="${escapeHtml(interestUrl(type, slug))}" style="color:#e70d69;font-weight:bold;">See current prices and providers</a></p>
  <p>Prices and provider availability change. Check current details with the provider before you book.</p>
  <p>This is the only email we will send for this reminder. <a href="${escapeHtml(unsubscribeUrl(token))}" style="color:#555;">Unsubscribe</a></p>
  <p style="color:#555;font-size:12px;margin-top:24px;">${escapeHtml(COMPANY_LINE)}</p>
</div>`;
}

export async function handleRetestSubscribe(
  request: Request,
  ip: string,
  deps: SubscribeDeps,
): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    raw = {};
  }
  const body: Record<string, unknown> =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  if (typeof body.hp === "string" && body.hp.length > 0) {
    return json({ ok: true, message: RETEST_SUCCESS_MESSAGE });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (body.consent !== true) {
    return json({ error: "Please tick the box to agree to the email." }, 400);
  }
  const interestType = body.interest_type;
  if (interestType !== "test" && interestType !== "biomarker") {
    return json({ error: "Something went wrong. Please try again." }, 400);
  }
  const slug = String(body.interest_slug ?? "").trim();
  const label = String(body.interest_label ?? "").trim().slice(0, 160);
  if (!SLUG_RE.test(slug) || !label) {
    return json({ error: "Something went wrong. Please try again." }, 400);
  }
  const interval = Number(body.interval_months);
  if (interval !== 3 && interval !== 6 && interval !== 12) {
    return json({ error: "Please choose 3, 6 or 12 months." }, 400);
  }

  const now = deps.now();
  const since = new Date(now.getTime() - RETEST_RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
  if ((await deps.countRecent(ip, since)) >= RETEST_RATE_LIMIT_MAX) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }
  await deps.recordHit(ip);

  const remindAt = addMonths(now, interval);
  const token = await deps.insertIfAbsent({
    email,
    interest_type: interestType,
    interest_slug: slug,
    interest_label: label,
    interval_months: interval,
    remind_at: remindAt.toISOString(),
    consent_text: RETEST_CONSENT_TEXT,
    consent_ip: ip,
  });

  if (token) {
    try {
      await deps.sendEmail({
        to: email,
        subject: "Your reminder is set",
        headers: listUnsubscribeHeaders(token),
        html: confirmationEmail(label, remindAt, token),
      });
    } catch {
      console.warn("retest-reminder-subscribe: confirmation email failed");
    }
  }

  // Identical response whether new or existing, so registration is not revealed.
  return json({ ok: true, message: RETEST_SUCCESS_MESSAGE });
}

export function unsubscribePage(): Response {
  const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Reminder cancelled | myhealth checkup</title></head>
<body style="margin:0;font-family:Arial,sans-serif;background:#081129;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;">
<main style="max-width:480px;background:#fff;color:#081129;border-radius:16px;padding:32px;border-top:4px solid #22c0d4;">
<h1 style="margin:0 0 12px;font-size:22px;">You will not get this reminder</h1>
<p style="line-height:1.6;margin:0 0 20px;">If this link matched a reminder, we have cancelled it. We will not email you about it again.</p>
<a href="${SITE_URL}" style="display:inline-block;background:#e70d69;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to myhealth checkup</a>
</main></body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
