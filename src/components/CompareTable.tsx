
import React, { useEffect, useState } from "react";
import { Check, X, Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compareData } from "@/data/compareData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface CompareTableProps {
  category: string;
  providers: string[];
}

interface PriceUpdate {
  test_id: string;
  provider: string;
  price: number;
  available: boolean;
}

const CompareTable = ({ category, providers }: CompareTableProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAllProviders = providers.includes("all");
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isRealtime, setIsRealtime] = useState(true);
  
  // Filter data based on category and selected providers
  const filteredData = compareData.filter((item) => {
    if (item.category !== category) return false;
    return isAllProviders || providers.includes(item.provider.toLowerCase());
  });

  // Apply real-time price updates if available
  const dataWithUpdates = filteredData.map(item => {
    const update = priceUpdates.find(
      u => u.test_id === item.id && u.provider === item.provider
    );
    
    if (update) {
      return {
        ...item,
        price: update.price,
        isAvailable: update.available
      };
    }
    return item;
  });

  // Get unique features across all items for the selected category
  const allFeatures = dataWithUpdates.reduce((acc, item) => {
    Object.keys(item.features).forEach((feature) => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  // Sort features so important ones appear first
  const sortedFeatures = [
    "turnaround",
    "collection",
    "doctorReview",
    "price",
    ...allFeatures.filter(f => !["turnaround", "collection", "doctorReview", "price"].includes(f))
  ];

  useEffect(() => {
    // Fetch user favorites
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("test_id")
          .eq("category", category);
          
        if (error) throw error;
        setFavorites(data.map(f => f.test_id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    
    fetchFavorites();
  }, [user, category]);
  
  useEffect(() => {
    // Set up realtime subscription for price updates
    if (!isRealtime) return;
    
    // Fetch initial price updates
    const fetchPriceUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from("provider_price_updates")
          .select("*");
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPriceUpdates(data);
        }
      } catch (error) {
        console.error("Error fetching price updates:", error);
      }
    };
    
    fetchPriceUpdates();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('price-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'provider_price_updates'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setPriceUpdates(prev => {
              // Remove any existing update for this test/provider
              const filtered = prev.filter(
                p => !(p.test_id === payload.new.test_id && p.provider === payload.new.provider)
              );
              // Add the new update
              return [...filtered, payload.new];
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRealtime]);

  const toggleFavorite = async (testId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      navigate("/auth");
      return;
    }
    
    const isFavorite = favorites.includes(testId);
    const item = filteredData.find(item => item.id === testId);
    
    if (!item) return;
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("test_id", testId)
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== testId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            test_id: testId,
            category: item.category,
            provider: item.provider
          });
          
        if (error) throw error;
        
        setFavorites(prev => [...prev, testId]);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const placeOrder = async (testId: string, provider: string) => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full overflow-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          {filteredData.length} results found
        </h2>
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsRealtime(!isRealtime)}
        >
          <RefreshCw className={cn("h-4 w-4", isRealtime && "animate-spin")} />
          {isRealtime ? "Live Updates On" : "Live Updates Off"}
        </Button>
      </div>
      
      <Table>
        <TableCaption>
          Compare health services across leading providers
        </TableCaption>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[180px] min-w-[180px]">Test / Service</TableHead>
            {dataWithUpdates.map((item) => (
              <TableHead 
                key={item.id}
                className="min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <img 
                    src={item.providerLogo} 
                    alt={item.provider} 
                    className="h-10 w-auto object-contain mb-2"
                  />
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-health-600 font-bold">£{item.price.toFixed(2)}</span>
                  {/* Availability indicator */}
                  {item.isAvailable === false && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeatures.map((feature) => (
            <TableRow key={feature}>
              <TableCell className="font-medium bg-gray-50 sticky left-0">
                {feature === "turnaround" ? "Turnaround Time" : 
                 feature === "doctorReview" ? "Doctor Review" : 
                 feature === "price" ? "Price" : 
                 feature === "collection" ? "Sample Collection" : 
                 feature}
              </TableCell>
              {dataWithUpdates.map((item) => {
                const value = item.features[feature];
                return (
                  <TableCell key={`${item.id}-${feature}`} className="text-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : feature === "price" ? (
                      <span className="font-bold">£{item.price.toFixed(2)}</span>
                    ) : (
                      value || "-"
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {/* Favorite row */}
          <TableRow>
            <TableCell className="bg-gray-50 sticky left-0">Save</TableCell>
            {dataWithUpdates.map((item) => (
              <TableCell key={`${item.id}-favorite`} className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleFavorite(item.id)}
                  className={cn(
                    "hover:bg-pink-50",
                    favorites.includes(item.id) ? "text-pink-500" : "text-gray-400"
                  )}
                >
                  <Heart className="h-5 w-5" fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                </Button>
              </TableCell>
            ))}
          </TableRow>
          {/* Order row */}
          <TableRow>
            <TableCell className="bg-gray-50 sticky left-0">Order</TableCell>
            {dataWithUpdates.map((item) => (
              <TableCell key={`${item.id}-order`} className="text-center">
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={item.isAvailable === false}
                  onClick={() => placeOrder(item.id, item.provider)}
                >
                  Order Now
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CompareTable;
