
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, ShoppingBag, FileText } from "lucide-react";
import { logger } from "@/lib/logger";

type Favorite = {
  id: string;
  test_id: string;
  category: string;
  provider: string;
  created_at: string;
  name?: string;
  price?: number;
};

type Order = {
  id: string;
  test_id: string;
  provider: string;
  status: string;
  order_date: string;
  result_url: string | null;
  result_date: string | null;
  name?: string;
  price?: number;
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("favorites");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchOrders();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      logger.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      logger.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoadingData(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      toast.success("Removed from favorites");
      } catch (error) {
        logger.error('Error removing favorite:', error);
        toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="sticky top-0 z-10 bg-background mb-6 shadow-sm">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Favorites
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> My Orders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              <h2 className="text-2xl font-semibold mb-4">Saved Tests & Services</h2>
              
              {loadingData ? (
                <div className="flex justify-center p-8">
                  <p>Loading your favorites...</p>
                </div>
              ) : favorites.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p>You haven't saved any favorites yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/compare")}
                    >
                      Browse Tests
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-start">
                          <span>{favorite.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          {favorite.provider} | {favorite.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                      <div className="flex justify-end items-center">
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/compare?category=${favorite.category}`)}
                        >
                          View Details
                        </Button>
                      </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <h2 className="text-2xl font-semibold mb-4">My Orders & Results</h2>
              
              {loadingData ? (
                <div className="flex justify-center p-8">
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p>You haven't placed any orders yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/compare")}
                    >
                      Browse Tests
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{order.name}</CardTitle>
                            <CardDescription>
                              Order #{order.id.slice(0, 8)} | {order.provider}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-[#081129] text-white'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                      <div className="flex justify-end items-center">
                        {order.result_url && (
                          <Button 
                            className="flex items-center gap-2"
                            onClick={() => window.open(order.result_url || '#')}
                          >
                            <FileText className="h-4 w-4" />
                            View Results
                          </Button>
                        )}
                      </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
