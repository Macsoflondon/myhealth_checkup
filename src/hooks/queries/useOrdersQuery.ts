/**
 * React Query hooks for Orders API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { ordersApi, type Order } from "@/api";
import { toast } from "@/components/ui/sonner";
import { logger } from "@/lib/logger";

export const ordersQueryKeys = {
  all: ['orders'] as const,
  user: (userId: string) => ['orders', userId] as const,
  byId: (orderId: string) => ['orders', 'detail', orderId] as const,
};

export function useOrdersQuery() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ordersQueryKeys.user(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await ordersApi.getUserOrders(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      testId: string;
      provider: string;
      name?: string;
      price?: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { data, error } = await ordersApi.createOrder({
        user_id: user.id,
        test_id: params.testId,
        provider: params.provider,
        name: params.name,
        price: params.price,
        status: 'pending',
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.user(user?.id || '') });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      logger.error('Error creating order:', error);
      toast.error('Failed to create order');
    },
  });
}

export function useUpdateOrderStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; status: string }) => {
      const { error } = await ordersApi.updateOrderStatus(params.orderId, params.status);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.user(user?.id || '') });
      toast.success("Order status updated");
    },
    onError: (error) => {
      logger.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    },
  });
}
