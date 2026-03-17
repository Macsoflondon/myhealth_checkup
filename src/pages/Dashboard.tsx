import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/ui/page-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, User, Package, Clock, PoundSterling, GripVertical, Building2, ExternalLink, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { useDraggable } from "@/hooks";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/components/ProviderLogo";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "favorites");

  // Use the new centralised data hook
  const {
    favorites,
    orders,
    savedProviders,
    isLoading,
    removeFavorite,
    removeSavedProvider,
    reorderFavorites,
    reorderOrders,
  } = useDashboardData();

  // Draggable functionality for favorites
  const favoriteDrag = useDraggable({
    items: favorites,
    onReorder: reorderFavorites,
    getId: (fav) => fav.id,
  });

  // Draggable functionality for orders
  const orderDrag = useDraggable({
    items: orders,
    onReorder: reorderOrders,
    getId: (order) => order.id,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout mainClassName="flex-grow bg-muted/30 py-4 sm:py-6 md:py-10 px-3 sm:px-4">
      <div className="container mx-auto max-w-5xl">
        <PageHeading 
          title="My" 
          accent="Dashboard" 
          centered={false}
          className="text-2xl sm:text-3xl mb-4 sm:mb-6"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" /> 
              <span className="hidden sm:inline">Saved Tests</span>
              <span className="sm:hidden">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> 
              <span className="hidden sm:inline">Saved Providers</span>
              <span className="sm:hidden">Providers</span>
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
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                {favorites.map((favorite, index) => (
                  <Card 
                    key={favorite.id}
                    draggable
                    data-index={index}
                    onDragStart={(e) => favoriteDrag.onDragStart(e, { id: favorite.id, index })}
                    onDragEnd={favoriteDrag.onDragEnd}
                    onDragOver={favoriteDrag.onDragOver}
                    onDrop={(e) => favoriteDrag.onDrop(e, index)}
                    className={cn(
                      "draggable-element",
                      favoriteDrag.draggedOverIndex === index && "drag-over"
                    )}
                  >
                    <CardHeader className="pb-2 p-4 sm:p-6">
                      <CardTitle className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <GripVertical className="drag-handle h-4 w-4 shrink-0" />
                          <span className="text-base sm:text-lg">{favorite.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFavorite(favorite)}
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

          <TabsContent value="providers">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Saved Providers</h2>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : savedProviders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>You haven't saved any providers yet.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/trusted-providers")}
                  >
                    Browse Providers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {savedProviders.map((provider) => (
                  <Card key={provider.id} className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-2 p-4 sm:p-6">
                      <CardTitle className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5">
                            <ProviderLogo provider={provider.provider_name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-base sm:text-lg">{provider.provider_name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSavedProvider(provider.provider_id)}
                          className="shrink-0 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Saved {new Date(provider.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <Button 
                          size="sm"
                          asChild
                          className="text-xs sm:text-sm"
                        >
                          <Link to={`/provider/${provider.provider_id.toLowerCase()}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/compare?provider=${provider.provider_id.toLowerCase()}`)}
                          className="text-xs sm:text-sm"
                        >
                          Browse Tests
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
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                {orders.map((order, index) => (
                  <Card 
                    key={order.id}
                    draggable
                    data-index={index}
                    onDragStart={(e) => orderDrag.onDragStart(e, { id: order.id, index })}
                    onDragEnd={orderDrag.onDragEnd}
                    onDragOver={orderDrag.onDragOver}
                    onDrop={(e) => orderDrag.onDrop(e, index)}
                    className={cn(
                      "draggable-element",
                      orderDrag.draggedOverIndex === index && "drag-over"
                    )}
                  >
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <GripVertical className="drag-handle h-4 w-4 shrink-0" />
                            <CardTitle className="text-base sm:text-lg">{order.name}</CardTitle>
                          </div>
                          <CardDescription className="text-xs sm:text-sm">
                            Order #{order.id.slice(0, 8)} · {order.provider}
                          </CardDescription>
                        </div>
                        <div className="flex sm:flex-col items-start gap-2 sm:text-right">
                          <span className={cn(
                            "inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                            order.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                            order.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                            order.status === 'cancelled' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                            !['completed', 'pending', 'cancelled'].includes(order.status) && 'bg-primary text-primary-foreground'
                          )}>
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
                            onClick={() => window.open(order.result_url || '#', '_blank', 'noopener,noreferrer')}
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
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

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
