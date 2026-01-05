import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logApiError } from "@/services/errorLogger";
import { getUserFriendlyMessage } from "@/services/apiErrorHandler";

export function useOrders(user: User | null) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const placeOrder = async (
    testId: string, 
    provider: string, 
    testName?: string, 
    price?: number
  ) => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return false;
    }
    
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          test_id: testId,
          provider: provider,
          name: testName,
          price: price,
          status: 'pending',
        });
      
      if (error) throw error;
      
      toast.success("Order placed successfully!");
      navigate("/dashboard?tab=orders");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logApiError(error, 'orders/place', { testId, provider });
      
      const userMessage = getUserFriendlyMessage(error);
      toast.error("Failed to place order", {
        description: userMessage,
        action: {
          label: "Retry",
          onClick: () => placeOrder(testId, provider, testName, price),
        },
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { placeOrder, isSubmitting };
}