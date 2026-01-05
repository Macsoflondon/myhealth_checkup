import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";

export interface NotificationHistory {
  id: string;
  user_id: string;
  notification_type: 'email' | 'sms';
  notification_category: string;
  status: 'sent' | 'failed' | 'pending';
  recipient: string;
  subject?: string;
  error_message?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export const notificationHistoryApi = {
  /**
   * Get all notification history for the current user
   */
  async getHistory(): Promise<ApiResponse<NotificationHistory[]>> {
    const { data, error, count } = await supabase
      .from('notification_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    return { data: data as NotificationHistory[] | null, error, count };
  },

  /**
   * Get notification history with pagination
   */
  async getHistoryPaginated(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<NotificationHistory[]>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('notification_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    return { data: data as NotificationHistory[] | null, error, count };
  },

  /**
   * Get notification history filtered by type
   */
  async getHistoryByType(
    type: 'email' | 'sms'
  ): Promise<ApiResponse<NotificationHistory[]>> {
    const { data, error, count } = await supabase
      .from('notification_history')
      .select('*', { count: 'exact' })
      .eq('notification_type', type)
      .order('created_at', { ascending: false });

    return { data: data as NotificationHistory[] | null, error, count };
  },

  /**
   * Get notification history filtered by status
   */
  async getHistoryByStatus(
    status: 'sent' | 'failed' | 'pending'
  ): Promise<ApiResponse<NotificationHistory[]>> {
    const { data, error, count } = await supabase
      .from('notification_history')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false });

    return { data: data as NotificationHistory[] | null, error, count };
  },

  /**
   * Create a notification history entry
   */
  async createEntry(
    entry: Omit<NotificationHistory, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<NotificationHistory>> {
    const { data, error } = await supabase
      .from('notification_history')
      .insert(entry)
      .select()
      .single();

    return { data: data as NotificationHistory | null, error };
  },
};
