import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface PriceAlert {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  threshold_percentage: number;
  last_alerted_at: string | null;
}

interface PriceChange {
  test_id: string;
  provider: string;
  old_price: number;
  new_price: number;
  change_percentage: number;
  changed_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting price alert checker');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all enabled price alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alert_preferences')
      .select('*')
      .eq('enabled', true);

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    console.log(`Found ${alerts?.length || 0} active price alerts`);

    // Get recent price changes (last 6 hours)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data: priceChanges, error: changesError } = await supabase
      .from('price_history')
      .select('*')
      .gte('changed_at', sixHoursAgo)
      .lt('change_percentage', 0) // Only price drops
      .order('changed_at', { ascending: false });

    if (changesError) {
      throw new Error(`Failed to fetch price changes: ${changesError.message}`);
    }

    console.log(`Found ${priceChanges?.length || 0} recent price drops`);

    const alertsSent = [];

    // Check each alert against price changes
    for (const alert of alerts || []) {
      // Skip if alerted in the last 24 hours
      if (alert.last_alerted_at) {
        const lastAlerted = new Date(alert.last_alerted_at);
        const hoursSinceLastAlert = (Date.now() - lastAlerted.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastAlert < 24) {
          console.log(`Skipping alert ${alert.id} - alerted ${hoursSinceLastAlert.toFixed(1)} hours ago`);
          continue;
        }
      }

      // Find matching price drop
      const matchingDrop = priceChanges?.find(
        change => 
          change.test_id === alert.test_id && 
          change.provider === alert.provider &&
          Math.abs(change.change_percentage) >= alert.threshold_percentage
      );

      if (matchingDrop) {
        console.log(`Found matching price drop for alert ${alert.id}`);

        // Get user email
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          alert.user_id
        );

        if (userError || !userData.user?.email) {
          console.error(`Failed to get user email for ${alert.user_id}:`, userError);
          continue;
        }

        // Get test details
        const { data: testData } = await supabase
          .from('provider_tests')
          .select('test_name')
          .eq('id', alert.test_id)
          .single();

        const testName = testData?.test_name || 'Health Test';

        // Send email notification
        try {
          await resend.emails.send({
            from: 'myhealth checkup <alerts@myhealthcheckup.co.uk>',
            to: [userData.user.email],
            subject: `🎉 Price Drop Alert: ${testName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #FA6980;">Great News! Price Drop Detected</h1>
                <p>The price for <strong>${testName}</strong> from <strong>${alert.provider}</strong> has dropped!</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #3A5F85; margin-top: 0;">Price Details</h2>
                  <p style="font-size: 18px; margin: 10px 0;">
                    <span style="text-decoration: line-through; color: #999;">£${matchingDrop.old_price.toFixed(2)}</span>
                    <span style="color: #FA6980; font-weight: bold; margin-left: 10px;">£${matchingDrop.new_price.toFixed(2)}</span>
                  </p>
                  <p style="color: #4CAF50; font-size: 20px; font-weight: bold;">
                    ${Math.abs(matchingDrop.change_percentage).toFixed(0)}% OFF
                  </p>
                  <p style="color: #666;">
                    You save £${(matchingDrop.old_price - matchingDrop.new_price).toFixed(2)}
                  </p>
                </div>
                
                <p>This matches your alert threshold of ${alert.threshold_percentage}% or more.</p>
                
                <a href="https://myhealthcheckup.co.uk/compare" 
                   style="display: inline-block; background-color: #FA6980; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                  View Test Details
                </a>
                
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  You received this email because you set up a price alert for this test. 
                  You can manage your alert preferences in your dashboard.
                </p>
              </div>
            `,
          });

          // Update last_alerted_at
          await supabase
            .from('price_alert_preferences')
            .update({ last_alerted_at: new Date().toISOString() })
            .eq('id', alert.id);

          alertsSent.push({
            alert_id: alert.id,
            test_name: testName,
            provider: alert.provider,
            price_drop: matchingDrop.change_percentage,
            user_email: userData.user.email,
          });

          console.log(`Alert sent successfully for ${testName} to ${userData.user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email for alert ${alert.id}:`, emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Checked ${alerts?.length || 0} alerts, sent ${alertsSent.length} notifications`,
        alerts_sent: alertsSent,
        total_price_drops: priceChanges?.length || 0,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in price alert checker:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error instanceof Error ? error.message : String(error)) 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
