
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, ShoppingBag, FileText, User, Package, Clock, PoundSterling, Bell } from "lucide-react";
import { logger } from "@/lib/logger";
import { favoritesApi, ordersApi, type Favorite, type Order } from "@/api";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { PriceAlertSettings } from "@/components/dashboard/PriceAlertSettings";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "favorites");
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
      const { data, error } = await favoritesApi.getUserFavorites(user.id);
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
      const { data, error } = await ordersApi.getUserOrders(user.id);
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
      const favorite = favorites.find(f => f.id === id);
      if (!favorite || !user) return;

      const { error } = await favoritesApi.removeFavorite(
        user.id,
        favorite.test_id,
        favorite.category
      );
      
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
      <main className="flex-grow bg-gray-50 py-4 sm:py-6 md:py-10 px-3 sm:px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> 
                <span className="hidden sm:inline">Saved Tests</span>
                <span className="sm:hidden">Saved</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> 
                <span className="hidden sm:inline">Order History</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> 
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Saved Tests & Services</h2>
              
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardHeader className="pb-2 p-4 sm:p-6">
                        <CardTitle className="flex justify-between items-start gap-2">
                          <span className="text-base sm:text-lg">{favorite.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFavorite(favorite.id)}
                            className="shrink-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {favorite.provider}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {favorite.price && (
                              <div className="flex items-center gap-1">
                                <PoundSterling className="h-3 w-3" />
                                <span>{favorite.price}</span>
                              </div>
                            )}
                            <div className="px-2 py-1 bg-muted rounded text-xs">
                              {favorite.category}
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/compare?category=${favorite.category}`)}
                            className="text-xs sm:text-sm"
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">My Orders & Results</h2>
              
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
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-base sm:text-lg mb-2">{order.name}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              Order #{order.id.slice(0, 8)} · {order.provider}
                            </CardDescription>
                          </div>
                          <div className="flex sm:flex-col items-start gap-2 sm:text-right">
                            <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-primary text-primary-foreground'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(order.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            {order.price && (
                              <div className="flex items-center gap-1">
                                <PoundSterling className="h-3 w-3" />
                                <span>{order.price}</span>
                              </div>
                            )}
                          </div>
                          {order.result_url && (
                            <Button 
                              className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                              onClick={() => window.open(order.result_url || '#')}
                            >
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
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

            <TabsContent value="alerts">
              {user && <PriceAlertSettings userId={user.id} />}
            </TabsContent>

            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
