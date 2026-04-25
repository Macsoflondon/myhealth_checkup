import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestNotificationRequest {
  type: 'email' | 'sms';
  notificationType: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Get user profile for contact info
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("first_name, last_name, email, phone")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw new Error("Could not fetch user profile");
    }

    const { type, notificationType }: TestNotificationRequest = await req.json();

    if (type === 'email') {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY not configured");
      }

      const resend = new Resend(resendApiKey);
      const email = profile.email || user.email;

      if (!email) {
        throw new Error("No email address found");
      }

      const emailContent = getEmailContent(notificationType, profile.first_name || 'there');

      // Create notification history entry
      const { error: logError } = await supabase
        .from('notification_history')
        .insert({
          user_id: user.id,
          notification_type: 'email',
          notification_category: notificationType,
          status: 'pending',
          recipient: email,
          subject: emailContent.subject,
        });

      if (logError) {
        console.error("Error logging notification:", logError);
      }

      try {
        const emailResponse = await resend.emails.send({
          from: "myhealth checkup <notifications@updates.myhealthcheckup.co.uk>",
          to: [email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log("Test email sent successfully:", emailResponse);

        // Update notification status to sent
        await supabase
          .from('notification_history')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('recipient', email)
          .eq('status', 'pending')
          .eq('notification_category', notificationType)
          .order('created_at', { ascending: false })
          .limit(1);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Test ${notificationType} email sent to ${email}`,
            emailId: emailResponse.id
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } catch (emailError: any) {
        console.error("Email send error:", emailError);
        
        // Update notification status to failed
        await supabase
          .from('notification_history')
          .update({
            status: 'failed',
            error_message: emailError.message || 'Email send failed',
          })
          .eq('user_id', user.id)
          .eq('recipient', email)
          .eq('status', 'pending')
          .eq('notification_category', notificationType)
          .order('created_at', { ascending: false })
          .limit(1);
        
        throw emailError;
      }
    } else if (type === 'sms') {
      // SMS functionality would require a service like Twilio
      // For now, log the attempt and return a placeholder response
      if (!profile.phone) {
        throw new Error("No phone number configured");
      }

      // Log SMS attempt
      await supabase
        .from('notification_history')
        .insert({
          user_id: user.id,
          notification_type: 'sms',
          notification_category: notificationType,
          status: 'pending',
          recipient: profile.phone,
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `SMS functionality requires Twilio integration. Phone: ${profile.phone}`,
          note: "SMS sending not yet configured"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else {
      throw new Error("Invalid notification type");
    }
  } catch (error: any) {
    console.error("Error in send-test-notification:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error instanceof Error ? error.message : String(error)) 
      }),
      {
        status: (error instanceof Error ? error.message : String(error)).includes("RESEND_API_KEY") ? 503 : 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
});

function getEmailContent(notificationType: string, firstName: string): { subject: string; html: string } {
  switch (notificationType) {
    case 'results':
      return {
        subject: "🧪 Test Notification: Your Results Are Ready",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #FA6980 0%, #3A5F85 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Test Results Available</h1>
            </div>
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                <strong>This is a test notification.</strong> Your real test results would appear here with a link to view them in your dashboard.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #FA6980; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View Test Results</a>
              </div>
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                This is a test email from myhealth checkup notification system.
              </p>
            </div>
          </div>
        `
      };
    case 'appointments':
      return {
        subject: "📅 Test Notification: Appointment Reminder",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3A5F85 0%, #FA6980 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Appointment Reminder</h1>
            </div>
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                <strong>This is a test notification.</strong> You would receive reminders about upcoming appointments here.
              </p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Test Type:</strong> Blood Test</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;"><strong>Date:</strong> Tomorrow at 10:00 AM</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;"><strong>Location:</strong> London Medical Laboratory</p>
              </div>
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                This is a test email from myhealth checkup notification system.
              </p>
            </div>
          </div>
        `
      };
    case 'promotions':
      return {
        subject: "🎉 Test Notification: Special Offer",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #FA6980 0%, #3A5F85 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Special Offer Just for You</h1>
            </div>
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                <strong>This is a test notification.</strong> You would receive promotional offers and health insights here.
              </p>
              <div style="background: #fff3f5; border-left: 4px solid #FA6980; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; color: #FA6980; font-weight: 600;">20% OFF Full Health Screening</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Limited time offer - Book your comprehensive health check today</p>
              </div>
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                This is a test email from myhealth checkup notification system.
              </p>
            </div>
          </div>
        `
      };
    default:
      return {
        subject: "Test Notification from myhealth checkup",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1b34; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Test Notification</h1>
            </div>
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                This is a test notification from myhealth checkup. Your notification settings are working correctly!
              </p>
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                This is a test email from myhealth checkup notification system.
              </p>
            </div>
          </div>
        `
      };
  }
}
