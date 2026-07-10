import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ApiResponse } from "./base";

type Row = Database["public"]["Tables"]["security_alert_recipients"]["Row"];
type Insert = Database["public"]["Tables"]["security_alert_recipients"]["Insert"];
type Update = Database["public"]["Tables"]["security_alert_recipients"]["Update"];

export type AlertRecipient = Row;
export type AlertRecipientInput = {
  email: string;
  label?: string | null;
  alert_types: string[];
  enabled: boolean;
};

export const ALERT_TYPE_OPTIONS = [
  { value: "critical", group: "Severity" },
  { value: "high", group: "Severity" },
  { value: "medium", group: "Severity" },
  { value: "low", group: "Severity" },
  { value: "soc_incident_opened", group: "Source" },
  { value: "cron_failure", group: "Source" },
  { value: "scraper_alert", group: "Source" },
  { value: "csp_violation", group: "Source" },
  { value: "all", group: "Source" },
] as const;

async function list(): Promise<ApiResponse<AlertRecipient[]>> {
  const { data, error } = await supabase
    .from("security_alert_recipients")
    .select("*")
    .order("enabled", { ascending: false })
    .order("email", { ascending: true });
  return { data: data ?? [], error };
}

async function create(input: AlertRecipientInput): Promise<ApiResponse<AlertRecipient>> {
  const payload: Insert = {
    email: input.email.trim().toLowerCase(),
    label: input.label?.trim() || null,
    alert_types: input.alert_types,
    enabled: input.enabled,
  };
  const { data, error } = await supabase
    .from("security_alert_recipients")
    .insert(payload)
    .select()
    .single();
  await logChange("create", null, payload as unknown as Record<string, unknown>);
  return { data, error };
}

async function update(id: string, patch: AlertRecipientInput): Promise<ApiResponse<AlertRecipient>> {
  const payload: Update = {
    email: patch.email.trim().toLowerCase(),
    label: patch.label?.trim() || null,
    alert_types: patch.alert_types,
    enabled: patch.enabled,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("security_alert_recipients")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  await logChange("update", id, payload as unknown as Record<string, unknown>);
  return { data, error };
}

async function remove(id: string, email: string): Promise<ApiResponse<null>> {
  const { error } = await supabase.from("security_alert_recipients").delete().eq("id", id);
  await logChange("delete", id, { email });
  return { data: null, error };
}

async function toggle(id: string, enabled: boolean): Promise<ApiResponse<AlertRecipient>> {
  const { data, error } = await supabase
    .from("security_alert_recipients")
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  await logChange("toggle", id, { enabled });
  return { data, error };
}

async function logChange(action: string, resourceId: string | null, value: Record<string, unknown>): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  await supabase.from("admin_activity_log").insert([{
    admin_user_id: user.user?.id ?? null,
    action: `alert_recipient_${action}`,
    resource_type: "security_alert_recipients",
    resource_id: resourceId,
    resource_name: (value.email as string) ?? null,
    new_value: value as never,
    success: true,
  }]);
}


export const alertRecipientsApi = { list, create, update, remove, toggle };
