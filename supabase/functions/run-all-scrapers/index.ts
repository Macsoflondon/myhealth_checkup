import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPERS = [
  { id: 'lola-health', functionName: 'lola-health-scraper' },
  { id: 'medichecks', functionName: 'medichecks-scraper' },
  { id: 'goodbody', functionName: 'goodbody-scraper' },
  { id: 'thriva', functionName: 'thriva-scraper' },
  { id: 'randox', functionName: 'randox-scraper' },
  { id: 'london-medical-laboratory', functionName: 'scrape-london-lab' },
];

interface ScraperResult {
  provider: string;
  success: boolean;
  message: string;
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
    console.error("Error in sendAdminNotification:", error);
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`[${new Date().toISOString()}] Starting scheduled scraping run for all providers`);

  const results: ScraperResult[] = [];

  for (const scraper of SCRAPERS) {
    console.log(`[${new Date().toISOString()}] Running ${scraper.id} scraper...`);
    
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
      console.log(`[${new Date().toISOString()}] ${scraper.id} completed: ${JSON.stringify(data)}`);
      
      results.push({
        provider: scraper.id,
        success: true,
        message: data.message || 'Completed successfully',
      });

      // Small delay between scrapers to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ${scraper.id} failed:`, error);
      results.push({
        provider: scraper.id,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const allSuccess = successCount === SCRAPERS.length;
  const summary = `Completed ${successCount}/${SCRAPERS.length} scrapers successfully`;
  
  console.log(`[${new Date().toISOString()}] ${summary}`);

  // Send email notification to admins
  const emailSubject = allSuccess 
    ? `✓ Scraper Run Complete: ${successCount}/${SCRAPERS.length} succeeded`
    : `⚠️ Scraper Run: ${SCRAPERS.length - successCount} failed`;
  
  await sendAdminNotification(
    supabase,
    emailSubject,
    generateEmailHtml(results, allSuccess)
  );

  return new Response(
    JSON.stringify({
      success: allSuccess,
      message: summary,
      results,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
});
