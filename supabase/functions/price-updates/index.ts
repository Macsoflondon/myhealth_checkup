
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getRandomPrice } from "./getRandomPrice.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// This edge function simulates real-time price updates for test providers
serve(async (req) => {
  try {
    // Get the test data from our database
    const { data: compareData, error: fetchError } = await supabase
      .from("provider_price_updates")
      .select("*");
      
    if (fetchError) {
      throw fetchError;
    }
    
    // If no data exists yet, seed with initial data from our app
    if (!compareData || compareData.length === 0) {
      // This would normally come from an external API in a real app
      const seedData = [
        {
          provider: "Tuli",
          test_id: "blood-test-1",
          price: 49.00,
          available: true
        },
        {
          provider: "Medicheck",
          test_id: "blood-test-2",
          price: 59.00,
          available: true
        },
        {
          provider: "Randox",
          test_id: "blood-test-3",
          price: 45.00,
          available: true
        },
        {
          provider: "Tuli",
          test_id: "weight-loss-1",
          price: 149.00,
          available: true
        },
        {
          provider: "Goodbody",
          test_id: "weight-loss-2",
          price: 179.00,
          available: true
        }
      ];
      
      const { error: insertError } = await supabase
        .from("provider_price_updates")
        .insert(seedData);
        
      if (insertError) {
        throw insertError;
      }
    } else {
      // Update a random selection of prices to simulate real-time changes
      const itemsToUpdate = compareData
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(1, Math.floor(compareData.length * 0.2)));
        
      for (const item of itemsToUpdate) {
        const newPrice = getRandomPrice(item.price);
        const newAvailability = Math.random() > 0.05 ? true : false; // 5% chance of being unavailable
        
        await supabase
          .from("provider_price_updates")
          .update({
            price: newPrice,
            available: newAvailability,
            updated_at: new Date()
          })
          .eq("id", item.id);
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
