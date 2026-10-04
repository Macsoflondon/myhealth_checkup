import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  FROM_ADDRESS,
  RETEST_ENDPOINT,
  listUnsubscribeHeaders,
  reminderEmail,
  type EmailMessage,
  type SubscribeDeps,
} from "./retest-reminder-core";

// retest_reminders is service-role only and not yet in the generated types.
const db = (): SupabaseClient => supabaseAdmin as unknown as SupabaseClient;

export async function sendViaResend(msg: EmailMessage): Promise<void> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) throw new Error("RESEND_API_KEY not configured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      reply_to: "support@myhealthcheckup.co.uk",
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      headers: msg.headers,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

export function subscribeDeps(): SubscribeDeps {
  return {
    now: () => new Date(),
    async countRecent(ip, since) {
      const { count } = await db()
        .from("api_rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("client_key", ip)
        .eq("endpoint", RETEST_ENDPOINT)
        .gte("window_start", since);
      return count ?? 0;
    },
    async recordHit(ip) {
      await db().from("api_rate_limits").insert({
        client_key: ip,
        endpoint: RETEST_ENDPOINT,
        window_start: new Date().toISOString(),
        request_count: 1,
      });
    },
    async insertIfAbsent(row) {
      const { data, error } = await db()
        .from("retest_reminders")
        .upsert(row, { onConflict: "email,interest_slug,interval_months", ignoreDuplicates: true })
        .select("unsubscribe_token");
      if (error) throw new Error("insert failed");
      const rows = (data ?? []) as Array<{ unsubscribe_token: string }>;
      return rows.length > 0 ? rows[0].unsubscribe_token : null;
    },
    sendEmail: sendViaResend,
  };
}

interface DueRow {
  id: string;
  email: string;
  interest_type: string;
  interest_slug: string;
  interest_label: string;
  unsubscribe_token: string;
}

export async function sendDueReminders(): Promise<{ due: number; sent: number; failed: number }> {
  const { data, error } = await db()
    .from("retest_reminders")
    .select("id, email, interest_type, interest_slug, interest_label, unsubscribe_token")
    .eq("status", "pending")
    .lte("remind_at", new Date().toISOString())
    .order("remind_at", { ascending: true })
    .limit(200);
  if (error) throw new Error("select failed");
  const rows = (data ?? []) as DueRow[];
  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await sendViaResend({
        to: row.email,
        subject: "Your reminder from myhealth checkup",
        headers: listUnsubscribeHeaders(row.unsubscribe_token),
        html: reminderEmail(row.interest_type, row.interest_slug, row.interest_label, row.unsubscribe_token),
      });
      const { error: updErr } = await db()
        .from("retest_reminders")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", row.id)
        .eq("status", "pending");
      if (updErr) console.error(`retest-reminder-send: status update failed for ${row.id}`);
      sent++;
    } catch {
      failed++;
      console.error(`retest-reminder-send: send failed for reminder ${row.id}`);
    }
  }
  return { due: rows.length, sent, failed };
}

export async function unsubscribeByToken(token: string): Promise<void> {
  const { error } = await db()
    .from("retest_reminders")
    .update({ status: "unsubscribed" })
    .eq("unsubscribe_token", token);
  if (error) console.error("retest-reminder-unsubscribe: update failed");
}
