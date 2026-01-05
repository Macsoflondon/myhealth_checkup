import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  status: string;
  name?: string;
  price?: number;
  order_date: string;
  result_date?: string;
  result_url?: string;
}

class OrdersApi {

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("order_date", { ascending: false });

      return { data: data as Order[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new order
   */
  async createOrder(
    order: Omit<Order, "id" | "order_date">
  ): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert(order as any)
        .select()
        .single();

      return { data: data as Order, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      return { data: data as Order, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Add result to order
   */
  async addOrderResult(
    orderId: string,
    resultUrl: string,
    resultDate: string
  ): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          result_url: resultUrl,
          result_date: resultDate,
          status: "completed",
        })
        .eq("id", orderId)
        .select()
        .single();

      return { data: data as Order, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get pending orders for a user
   */
  async getPendingOrders(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending");

      return { data: data as Order[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const ordersApi = new OrdersApi();
