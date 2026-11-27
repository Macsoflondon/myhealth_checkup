import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { clientIp } from "../_shared/client-ip.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE = "https://myhealthcheckup.co.uk";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_LIMIT_MAX = 5; // signups per IP
const RATE_LIMIT_WINDOW_MIN = 60; // minutes
const MIN_FILL_MS = 1500; // faster than this is a bot

const INTERESTS: Record<string, { label: string; href: string }> = {
  "blood-panels": { label: "Full blood panels", href: `${SITE}/wellness` },
  cancer: { label: "Cancer screening", href: `${SITE}/tests/cancer` },
  heart: { label: "Heart health", href: `${SITE}/compare` },
  hormones: { label: "Hormone health", href: `${SITE}/compare` },
  vitamins: { label: "Vitamins and nutrients", href: `${SITE}/compare` },
  thyroid: { label: "Thyroid function", href: `${SITE}/compare` },
  womens: { label: "Women's health and fertility", href: `${SITE}/womens-health` },
  mens: { label: "Men's health", href: `${SITE}/mens-health` },
  longevity: { label: "Longevity and healthy ageing", href: `${SITE}/compare/goals` },
  "not-sure": { label: "Not sure yet", href: `${SITE}/find-test` },
};

interface Body {
  firstName?: string;
  email?: string;
  interests?: string[];
  consent?: boolean;
  consentVersion?: string;
  source?: string;
  utm?: Record<string, string>;
  referrerHost?: string;
  hp?: string;
  t?: number;
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return v.length ? v : null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function buildEmail(firstName: string, interests: string[]): string {
  const seen = new Set<string>();
  const links = interests
    .map((k) => INTERESTS[k])
    .filter((i) => i && !seen.has(i.href) && seen.add(i.href))
    .map(
      (i) =>
        `<li style="margin:0 0 10px;"><a href="${i.href}" style="color:#081129;font-weight:600;">${escapeHtml(i.label)}</a></li>`,
    )
    .join("");

  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#081129;">
    <div style="background:#081129;padding:28px 24px;border-radius:8px 8px 0 0;">
      <div style="color:#ffffff;font-size:20px;font-weight:700;">myhealth <span style="color:#22c0d4;">checkup</span></div>
    </div>
    <div style="background:#ffffff;padding:28px 24px;border:1px solid #e3e8ee;border-top:0;border-radius:0 0 8px 8px;">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hello ${escapeHtml(firstName)},</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Thank you for signing up. Here are the comparison pages for the test types you chose.</p>
      <ul style="font-size:16px;line-height:1.5;padding-left:20px;margin:0 0 20px;">${links}</ul>
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Not sure where to start? Our <a href="${SITE}/find-test" style="color:#081129;font-weight:600;">test finder</a> asks six questions and takes about two minutes.</p>
      <p style="font-size:13px;line-height:1.6;color:#4a5568;margin:24px 0 8px;">myhealth checkup compares tests offered by other providers. We do not give medical advice. If you have symptoms that worry you, speak to your GP.</p>
      <p style="font-size:13px;line-height:1.6;color:#4a5568;margin:0 0 8px;">You agreed to receive comparison links and occasional updates. To unsubscribe, reply to this email with the word unsubscribe.</p>
      <p style="font-size:12px;line-height:1.6;color:#718096;margin:16px 0 0;">MYHEALTHCHECKUP LTD. Registered in England and Wales, Company No. 16589056.</p>
    </div>
  </div>`;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    // Bot traps: filled honeypot or an impossibly fast submit. Pretend success.
    if (
      (typeof body.hp === "string" && body.hp.length > 0) ||
      (typeof body.t === "number" && body.t < MIN_FILL_MS)
    ) {
      return json({ ok: true });
    }

    const firstName = clean(body.firstName, 80);
    const email = (typeof body.email === "string" ? body.email : "")
      .trim()
      .toLowerCase();
    const interests = Array.from(
      new Set(
        (Array.isArray(body.interests) ? body.interests : []).filter(
          (k) => typeof k === "string" && k in INTERESTS,
        ),
      ),
    );

    if (!firstName) {
      return json({ error: "Please enter your first name." }, 400);
    }
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    if (interests.length === 0) {
      return json({ error: "Please choose at least one option." }, 400);
    }
    if (body.consent !== true) {
      return json({ error: "Your consent is required to sign up." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Cloudflare and the Supabase gateway set these two headers. A caller can
    // set X-Forwarded-For to anything, so it is never used (22 Nov 2026 screening).
    const ip = clientIp(req.headers);
    const ua = clean(req.headers.get("user-agent") ?? "", 300);

    // Per-IP rate limit, same pattern as newsletter-subscribe
    const limitKey = ip ?? "unknown";
    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000,
    ).toISOString();
    const { count: recentCount } = await supabase
      .from("api_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("client_key", limitKey)
      .eq("endpoint", "landing-signup")
      .gte("window_start", windowStart);

    if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
      return json({ error: "Too many requests. Please try again later." }, 429);
    }
    await supabase.from("api_rate_limits").insert({
      client_key: limitKey,
      endpoint: "landing-signup",
      window_start: new Date().toISOString(),
      request_count: 1,
    });

    // An unauthenticated request never changes an existing record, and the
    // response is identical either way so the endpoint does not reveal who is on the list.
    const { data: existing } = await supabase
      .from("landing_signups")
      .select("id")
      .ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`))
      .maybeSingle();
    if (existing) {
      return json({ ok: true });
    }

    const utm = body.utm ?? {};
    const { error: insErr } = await supabase.from("landing_signups").insert({
      first_name: firstName,
      email,
      interests,
      consent_given: true,
      consent_text_version: clean(body.consentVersion, 40) ?? "unknown",
      consent_ip: ip,
      consent_user_agent: ua,
      page_source: clean(body.source, 64) ?? "landing",
      utm_source: clean(utm.source, 100),
      utm_medium: clean(utm.medium, 100),
      utm_campaign: clean(utm.campaign, 100),
      utm_content: clean(utm.content, 100),
      utm_term: clean(utm.term, 100),
      referrer_host: clean(body.referrerHost, 100),
    });

    if (insErr) {
      // 23505 = unique violation from a simultaneous duplicate. Treat as success.
      if ((insErr as { code?: string }).code === "23505") {
        return json({ ok: true });
      }
      throw insErr;
    }

    // Best-effort confirmation email. A failure never blocks the signup.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "myhealth checkup <support@myhealthcheckup.co.uk>",
          reply_to: "support@myhealthcheckup.co.uk",
          to: [email],
          subject: "Your myhealth checkup comparison links",
          html: buildEmail(firstName, interests),
        });
      } catch (mailErr) {
        console.warn("landing-signup confirmation email failed");
      }
    }

    return json({ ok: true });
  } catch (err) {
    console.error("landing-signup error:", (err as Error)?.message ?? "unknown");
    return json({ error: "Sign up failed. Please try again." }, 500);
  }
});
