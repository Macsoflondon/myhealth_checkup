import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const RATE_LIMIT_MAX = 5; // max submissions per IP
const RATE_LIMIT_WINDOW_MIN = 60; // minutes


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ComplaintBody {
  name?: string;
  email?: string;
  category?: string;
  providerName?: string;
  orderRef?: string;
  message?: string;
  consent?: boolean;
  hp?: string; // honeypot
}

const ALLOWED_CATEGORIES = new Set([
  "complaint",
  "feedback",
  "data_protection",
  "ranking_dispute",
  "accessibility",
  "other",
]);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = (await req.json().catch(() => ({}))) as ComplaintBody;

    // Honeypot
    if (body.hp && body.hp.length > 0) {
      return json({ ok: true, reference: "MHC-IGNORED" });
    }

    const name = (body.name ?? "").trim().slice(0, 120);
    const email = (body.email ?? "").trim().toLowerCase().slice(0, 254);
    const category = (body.category ?? "").trim().toLowerCase();
    const providerName = (body.providerName ?? "").trim().slice(0, 160);
    const orderRef = (body.orderRef ?? "").trim().slice(0, 64);
    const message = (body.message ?? "").trim().slice(0, 5000);
    const consent = body.consent === true;

    if (!name) return json({ error: "Please enter your name." }, 400);
    if (!email || !EMAIL_RE.test(email))
      return json({ error: "Please enter a valid email address." }, 400);
    if (!ALLOWED_CATEGORIES.has(category))
      return json({ error: "Please choose a valid category." }, 400);
    if (message.length < 20)
      return json(
        { error: "Please provide at least 20 characters describing the issue." },
        400,
      );
    if (!consent)
      return json(
        { error: "You must consent to us processing your data to respond." },
        400,
      );

    // Per-IP rate limit (sliding window via api_rate_limits)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const windowStart = new Date(
        Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000,
      ).toISOString();
      const { count: recentCount } = await supabase
        .from("api_rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("client_key", ip)
        .eq("endpoint", "submit-complaint")
        .gte("window_start", windowStart);
      if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
        return json(
          { error: "Too many requests. Please try again later." },
          429,
        );
      }
      await supabase.from("api_rate_limits").insert({
        client_key: ip,
        endpoint: "submit-complaint",
        window_start: new Date().toISOString(),
        request_count: 1,
      });
    }

    const reference = `MHC-${Date.now().toString(36).toUpperCase()}-${Math.random()

      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("[submit-complaint] RESEND_API_KEY missing");
      return json({ error: "Email service unavailable." }, 503);
    }
    const resend = new Resend(apiKey);

    const html = `
      <h2>New consumer ${esc(category)} submission</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Received:</strong> ${new Date().toISOString()}</p>
      <hr/>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Category:</strong> ${esc(category)}</p>
      ${providerName ? `<p><strong>Provider:</strong> ${esc(providerName)}</p>` : ""}
      ${orderRef ? `<p><strong>Order ref:</strong> ${esc(orderRef)}</p>` : ""}
      <hr/>
      <p style="white-space:pre-wrap">${esc(message)}</p>
      <hr/>
      <p style="font-size:12px;color:#666">
        SLA: acknowledge within 2 business days; full response within 10 business
        days; escalation rights to CMA / ASA / ICO disclosed to the consumer.
      </p>
    `;

    // Internal notification to compliance inbox
    await resend.emails.send({
      from: "myhealth checkup <support@myhealthcheckup.co.uk>",
      to: ["support@myhealthcheckup.co.uk", "support@myhealthcheckup.co.uk"],
      reply_to: email,
      subject: `[${reference}] ${category.toUpperCase()} from ${name}`,
      html,
    });

    // Consumer acknowledgement
    await resend.emails.send({
      from: "myhealth checkup <support@myhealthcheckup.co.uk>",
      to: [email],
      subject: `We've received your submission (ref ${reference})`,
      html: `
        <p>Hello ${esc(name)},</p>
        <p>Thank you for contacting myhealth checkup. Your reference is
           <strong>${reference}</strong>.</p>
        <p>Under our published service level:</p>
        <ul>
          <li>We acknowledge every submission within <strong>2 business days</strong>.</li>
          <li>We aim to provide a full response within <strong>10 business days</strong>.</li>
          <li>Complex data protection or regulatory matters may take up to
              <strong>30 calendar days</strong> (UK GDPR Art. 12).</li>
        </ul>
        <p>If you are unhappy with our response you can escalate to the
           Competition and Markets Authority (CMA), the Advertising Standards
           Authority (ASA), or the Information Commissioner's Office (ICO)
           where applicable.</p>
        <p>— Compliance Team, MYHEALTHCHECKUP LTD (Company No. 16589056)</p>
      `,
    });

    return json({ ok: true, reference });
  } catch (err) {
    console.error("[submit-complaint] error", err);
    return json({ error: "Something went wrong. Please try again later." }, 500);
  }
});
