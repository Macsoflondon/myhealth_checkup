import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { getErrorMessage } from "../_shared/errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPERS = [
  { id: 'lola-health', functionName: 'lola-health-scraper' },
  { id: 'medichecks', functionName: 'medichecks-firecrawl' },
  { id: 'goodbody-clinic', functionName: 'goodbody-scraper' },
  { id: 'thriva', functionName: 'thriva-scraper' },
  { id: 'randox', functionName: 'randox-scraper' },
  { id: 'london-medical-laboratory', functionName: 'scrape-london-lab' },
  { id: 'clinilabs', functionName: 'clinilabs-scraper' },
  { id: 'medical-diagnosis', functionName: 'medical-diagnosis-scraper' },
  { id: 'london-health-company', functionName: 'london-health-scraper' },
];

interface ScraperResult {
  provider: string;
  success: boolean;
  message: string;
}

interface RunAllScrapersBody {
  providerIds?: string[];
  providerId?: string;
  scheduled?: boolean;
}

async function sendSlackNotification(text: string, blocks?: unknown) {
  const url = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
    });
  } catch (err) {
    console.error("Slack notify error:", getErrorMessage(err));
  }
}

async function recordFailureAlerts(
  supabase: any,
  failed: ScraperResult[],
): Promise<void> {
  if (failed.length === 0) return;

  // Look back 24h for repeated-failure detection
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from("scraper_alerts")
    .select("provider_id, created_at")
    .eq("alert_type", "scrape_failed")
    .gte("created_at", since);

  const priorCounts = new Map<string, number>();
  for (const row of recent ?? []) {
    priorCounts.set(row.provider_id, (priorCounts.get(row.provider_id) ?? 0) + 1);
  }

  const rows = failed.map((f) => {
    const prior = priorCounts.get(f.provider) ?? 0;
    const isRepeated = prior >= 1;
    return {
      provider_id: f.provider,
      alert_type: "scrape_failed" as const,
      severity: isRepeated ? "critical" : "warning",
      message: isRepeated
        ? `Repeated failure (${prior + 1} in last 24h): ${f.message}`.slice(0, 1000)
        : `Scraper failed: ${f.message}`.slice(0, 1000),
      current_count: prior + 1,
      previous_count: prior,
    };
  });

  const { error } = await supabase.from("scraper_alerts").insert(rows);
  if (error) console.error("Failed to insert scraper_alerts:", error.message);
}

async function sendAdminNotification(
  supabase: any,
  subject: string,
  htmlContent: string
) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.log("RESEND_API_KEY not configured, skipping email notification");
    return;
  }

  try {
    // Get admin user emails
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError || !adminRoles?.length) {
      console.log("No admin users found or error fetching:", rolesError);
      return;
    }

    // Get admin emails from auth.users
    const adminUserIds = adminRoles.map((r: { user_id: string }) => r.user_id);
    const { data: authData } = await supabase.auth.admin.listUsers();
    
    const adminEmails = authData?.users
      ?.filter((u: any) => adminUserIds.includes(u.id))
      ?.map((u: any) => u.email)
      ?.filter(Boolean) || [];

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return;
    }

    console.log(`Sending notification to ${adminEmails.length} admin(s)`);

    const resend = new Resend(resendApiKey);
    
    const { error: emailError } = await resend.emails.send({
      from: "myhealth checkup <notifications@resend.dev>",
      to: adminEmails,
      subject: subject,
      html: htmlContent,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
    } else {
      console.log("Admin notification sent successfully");
    }
  } catch (error) {
    console.error("Error in sendAdminNotification:", getErrorMessage(error));
  }
}


function generateEmailHtml(results: ScraperResult[], allSuccess: boolean): string {
  const successCount = results.filter(r => r.success).length;
  const failedResults = results.filter(r => !r.success);
  
  const statusColor = allSuccess ? '#22c0d4' : '#e70d69';
  const statusText = allSuccess ? 'All Scrapers Completed Successfully' : 'Some Scrapers Failed';
  
  let resultsHtml = results.map(r => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${r.provider}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">
        <span style="color: ${r.success ? '#22c0d4' : '#e70d69'}; font-weight: 600;">
          ${r.success ? '✓ Success' : '✗ Failed'}
        </span>
      </td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 12px; color: #666;">
        ${r.message}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #081129; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">myhealth checkup</h1>
          <p style="color: #22c0d4; margin: 8px 0 0 0; font-size: 14px;">Scraper Status Report</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: ${statusColor}; font-size: 18px;">${statusText}</h2>
            <p style="margin: 8px 0 0 0; color: #333;">${successCount} of ${results.length} scrapers completed successfully</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e70d69;">Provider</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e70d69;">Status</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e70d69;">Details</th>
              </tr>
            </thead>
            <tbody>
              ${resultsHtml}
            </tbody>
          </table>
          
          ${failedResults.length > 0 ? `
            <div style="margin-top: 24px; padding: 16px; background: #fff5f5; border-radius: 4px;">
              <h3 style="margin: 0 0 8px 0; color: #e70d69; font-size: 14px;">⚠️ Failed Scrapers Require Attention</h3>
              <p style="margin: 0; font-size: 13px; color: #666;">
                Please check the edge function logs for more details on the failures.
              </p>
            </div>
          ` : ''}
          
          <p style="margin-top: 24px; font-size: 12px; color: #999; text-align: center;">
            Run at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK time)
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">myhealth checkup Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Detect Supabase Edge Runtime (Deno Deploy) waitUntil API. Falls back to a
// no-op shim in local/dev so the function still runs synchronously there.
declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;
const waitUntil = (p: Promise<unknown>): void => {
  try {
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(p);
      return;
    }
  } catch {
    // ignore — fall through to await-less detach
  }
  // Best-effort detach: attach a catch so unhandled rejections don't crash the isolate.
  p.catch((err) => console.error("[run-all-scrapers] background task error:", getErrorMessage(err)));
};

async function runBatch(
  runId: string,
  scrapersToRun: typeof SCRAPERS,
): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(
    `[${new Date().toISOString()}] [${runId}] Starting scraping run for ${scrapersToRun.length} provider(s)`,
  );

  // Bounded concurrency: run scrapers in parallel batches to cut wall time
  // from ~3-5 min (sequential + 2s sleeps) to ~60-90 s without overwhelming
  // upstream providers. Each scraper is independent.
  const CONCURRENCY = 3;
  const results: ScraperResult[] = [];

  async function runScraper(scraper: typeof SCRAPERS[number]): Promise<ScraperResult> {
    console.log(`[${new Date().toISOString()}] [${runId}] Running ${scraper.id} scraper...`);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/${scraper.functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ replace: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`[${new Date().toISOString()}] [${runId}] ${scraper.id} completed: ${JSON.stringify(data)}`);
      return {
        provider: scraper.id,
        success: true,
        message: data.message || 'Completed successfully',
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [${runId}] ${scraper.id} failed:`, getErrorMessage(error));
      return {
        provider: scraper.id,
        success: false,
        message: getErrorMessage(error),
      };
    }
  }

  try {
    for (let i = 0; i < scrapersToRun.length; i += CONCURRENCY) {
      const batch = scrapersToRun.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(batch.map(runScraper));
      results.push(...batchResults);
    }

    const successCount = results.filter(r => r.success).length;
    const failedResults = results.filter(r => !r.success);
    const allSuccess = successCount === scrapersToRun.length;
    const summary = `Completed ${successCount}/${scrapersToRun.length} scrapers successfully`;

    console.log(`[${new Date().toISOString()}] [${runId}] ${summary}`);

    // Chain popular-tests refresh + sanitise so homepage rankings track the
    // freshly scraped catalogue, not stale pinned rows.
    try {
      console.log(`[${runId}] Chaining scrape-popular-tests...`);
      const popRes = await fetch(`${supabaseUrl}/functions/v1/scrape-popular-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({}),
      });
      console.log(`[${runId}] scrape-popular-tests status: ${popRes.status}`);
    } catch (e) {
      console.error(`[${runId}] scrape-popular-tests failed:`, getErrorMessage(e));
    }
    try {
      await supabase.rpc('sanitize_popular_provider_tests');
      console.log(`[${runId}] sanitize_popular_provider_tests OK`);
    } catch (e) {
      console.error(`[${runId}] sanitize_popular_provider_tests failed:`, getErrorMessage(e));
    }

    // Persist dashboard alerts for any failures (warning, or critical if repeated)
    await recordFailureAlerts(supabase, failedResults);

    const emailSubject = allSuccess
      ? `✓ Scraper Run Complete: ${successCount}/${scrapersToRun.length} succeeded`
      : `⚠️ Scraper Run: ${scrapersToRun.length - successCount} failed`;

    if (!allSuccess) {
      await sendSlackNotification(
        `:rotating_light: ${emailSubject}\n` +
          failedResults.map((r) => `• *${r.provider}*: ${r.message}`).join("\n"),
      );
    }

    await sendAdminNotification(
      supabase,
      emailSubject,
      generateEmailHtml(results, allSuccess)
    );

  } catch (err) {
    console.error(`[${new Date().toISOString()}] [${runId}] Batch run crashed:`, getErrorMessage(err));
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const body: RunAllScrapersBody = req.method === "POST"
    ? await req.json().catch(() => ({}))
    : {};

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const cronSecret = Deno.env.get("SCRAPER_CRON_SECRET") ?? "";

  const isServiceRole = serviceKey.length > 0 && authHeader === `Bearer ${serviceKey}`;
  // Scheduled runs must present a dedicated cron secret (not the public anon key).
  const isScheduledRun = Boolean(body.scheduled) && cronSecret.length > 0 && authHeader === `Bearer ${cronSecret}`;

  let isAdminUser = false;
  if (!isServiceRole && !isScheduledRun) {
    if (!authHeader || !supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: hasAdminRole, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (roleErr || !hasAdminRole) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    isAdminUser = true;
  }

  const requestedProviderIds = [body.providerId, ...(body.providerIds ?? [])].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
  const scrapersToRun = requestedProviderIds.length > 0
    ? SCRAPERS.filter((scraper) => requestedProviderIds.includes(scraper.id))
    : SCRAPERS;

  if (requestedProviderIds.length > 0 && scrapersToRun.length === 0) {
    return new Response(JSON.stringify({ error: "No matching providers found" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const runId = crypto.randomUUID().slice(0, 8);
  const startedAt = new Date().toISOString();

  // Fire-and-forget: detach the batch from the request so HTTP timeouts,
  // client disconnects, or cron invoker cancellations cannot abort it.
  waitUntil(runBatch(runId, scrapersToRun));

  return new Response(
    JSON.stringify({
      success: true,
      message: `Scraper batch dispatched (${scrapersToRun.length} provider${scrapersToRun.length === 1 ? "" : "s"}). Running in background.`,
      runId,
      providers: scrapersToRun.map(s => s.id),
      startedAt,
      mode: isServiceRole ? "service" : isScheduledRun ? "scheduled" : isAdminUser ? "admin" : "unknown",
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 202,
    }
  );
});
