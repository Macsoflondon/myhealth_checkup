
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";

export function useOrders(user: User | null) {
  const navigate = useNavigate();
  
  const placeOrder = async (testId: string, provider: string) => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          test_id: testId,
          provider,
          status: "pending"
        });
        
      if (error) throw error;
      
      toast.success("Order placed successfully!");
      navigate("/dashboard?tab=orders");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };
  
  return { placeOrder };
}
