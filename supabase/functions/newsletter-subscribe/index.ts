import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface SubscribeBody {
  email?: string;
  source?: string;
  consent?: boolean;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as SubscribeBody;
    const email = (body.email ?? "").trim().toLowerCase();
    const source = (body.source ?? "footer").slice(0, 64);
    const consent = body.consent === true;

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    if (!consent) {
      return json({ error: "Consent is required to subscribe." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ua = req.headers.get("user-agent") ?? null;

    // Upsert: re-activate if previously unsubscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return json({ ok: true, message: "You're already subscribed." });
      }
      const { error: updErr } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          source,
          consent_ip: ip,
          consent_user_agent: ua,
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
    } else {
      const { error: insErr } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email,
          source,
          status: "active",
          consent_ip: ip,
          consent_user_agent: ua,
        });
      if (insErr) throw insErr;
    }

    // Best-effort welcome email (non-blocking failure)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "myhealth checkup <notifications@updates.myhealthcheckup.co.uk>",
          to: [email],
          subject: "Welcome to myhealth checkup",
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#081129;padding:32px 24px;text-align:center;border-radius:8px 8px 0 0;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;">You're subscribed</h1>
              </div>
              <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 8px 8px;">
                <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 16px;">
                  Thanks for joining myhealth checkup. You'll receive independent updates on private health testing, new providers, and price changes — no spam.
                </p>
                <p style="color:#666;font-size:13px;line-height:1.6;margin:24px 0 0;">
                  You can unsubscribe at any time by replying to any of our emails.
                </p>
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.warn("Welcome email failed:", mailErr);
      }
    }

    return json({ ok: true, message: "Thanks — you're subscribed." });
  } catch (err) {
    console.error("newsletter-subscribe error:", err);
    return json({ error: "Subscription failed. Please try again." }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
