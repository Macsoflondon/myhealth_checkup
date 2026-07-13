import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity, FileText, TrendingUp, Upload, Sparkles, ArrowRight,
  Heart, User, Package, Clock, PoundSterling, GripVertical,
  Building2, ExternalLink, Loader2, Trash2, Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResultUploader } from "./TestResultUploader";
import { TestResultsTimeline } from "./TestResultsTimeline";
import { HealthScoreCard } from "./HealthScoreCard";
import { StoredBiomarkerAnalysis } from "./StoredBiomarkerAnalysis";
import ProfileSettings from "./ProfileSettings";
import PageHeading from "@/components/ui/page-heading";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { useDraggable } from "@/hooks";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/components/providers/ProviderLogo";

export const HealthDataHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    favorites, orders, savedProviders, isLoading,
    removeFavorite, removeSavedProvider, reorderFavorites, reorderOrders,
  } = useDashboardData();

  const favoriteDrag = useDraggable({
    items: favorites,
    onReorder: reorderFavorites,
    getId: (fav) => fav.id,
  });

  const orderDrag = useDraggable({
    items: orders,
    onReorder: reorderOrders,
    getId: (order) => order.id,
  });

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("results");
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <PageHeading title="Health" accent="Dashboard" centered={false} />
        <p className="text-muted-foreground mt-2">
          Your test results, saved tests, providers, orders and profile in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-pink/10 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-brand-pink" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy">--</p>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-turquoise/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-turquoise" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy" key={refreshKey}>0</p>
              <p className="text-sm text-muted-foreground">Test Results</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy">--</p>
              <p className="text-sm text-muted-foreground">Biomarkers Tracked</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap gap-1 justify-start">
          <TabsTrigger value="overview" className="flex items-center gap-2"><Activity className="h-4 w-4" />Overview</TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2"><FileText className="h-4 w-4" />Test Results</TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2"><Upload className="h-4 w-4" />Upload</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2"><Heart className="h-4 w-4" />Saved Tests</TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2"><Building2 className="h-4 w-4" />Saved Providers</TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2"><Package className="h-4 w-4" />Orders</TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 border-2 border-brand-pink/30 bg-gradient-to-br from-brand-pink/5 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-brand-pink" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-brand-navy mb-2">AI Blood Test Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant AI-powered explanations of your biomarker readings. Understand what your results mean,
                  track trends over time, and receive personalised health recommendations.
                </p>
                <Button asChild className="bg-brand-pink hover:bg-brand-pink/90">
                  <Link to="/blood-test-analysis">
                    Analyse Your Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-brand-turquoise/30 bg-gradient-to-br from-brand-turquoise/5 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-turquoise/10 rounded-2xl flex items-center justify-center">
                  <Search className="w-8 h-8 text-brand-turquoise" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-brand-navy mb-2">Hidden Gap Detector</h3>
                <p className="text-muted-foreground mb-4">
                  Discover which preventive health screenings you may be missing. Our AI analyses your profile against NHS guidelines to identify unchecked areas before problems become symptoms.
                </p>
                <Button asChild className="bg-brand-turquoise hover:bg-brand-turquoise/90">
                  <Link to="/hidden-gap-detector">
                    Detect My Health Gaps
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <HealthScoreCard />
          <StoredBiomarkerAnalysis />

          <Card className="p-6 border-2">
            <h3 className="text-xl font-semibold mb-4 text-brand-navy">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Upload Your Test Results</h4>
                  <p className="text-sm text-muted-foreground">Start by uploading previous blood test results or health reports. We accept PDFs and images.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-turquoise rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Track Your Biomarkers</h4>
                  <p className="text-sm text-muted-foreground">View trends for key health markers like cholesterol, vitamin D, and thyroid function over time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Get AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">Use our AI analysis tool to understand your results and receive personalised recommendations.</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" key={refreshKey}>
          <TestResultsTimeline />
        </TabsContent>

        <TabsContent value="upload">
          <TestResultUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="favorites">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Saved Tests & Services</h2>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You haven't saved any favorites yet.</p>
                <Button className="mt-4" onClick={() => navigate("/compare")}>Browse Tests</Button>
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
                  className={cn("draggable-element", favoriteDrag.draggedOverIndex === index && "drag-over")}
                >
                  <CardHeader className="pb-2 p-4 sm:p-6">
                    <CardTitle className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <GripVertical className="drag-handle h-4 w-4 shrink-0" />
                        <span className="text-base sm:text-lg">{favorite.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFavorite(favorite)} className="shrink-0 hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{favorite.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {favorite.price && (
                          <div className="flex items-center gap-1">
                            <PoundSterling className="h-3 w-3" /><span>{favorite.price}</span>
                          </div>
                        )}
                        <div className="px-2 py-1 bg-muted rounded text-xs">{favorite.category}</div>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/compare?category=${favorite.category}`)} className="text-xs sm:text-sm">
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
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : savedProviders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You haven't saved any providers yet.</p>
                <Button className="mt-4" onClick={() => navigate("/trusted-providers")}>Browse Providers</Button>
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
                      <Button variant="ghost" size="sm" onClick={() => removeSavedProvider(provider.provider_id)} className="shrink-0 hover:bg-destructive/10">
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
                      <Button size="sm" asChild className="text-xs sm:text-sm">
                        <Link to={`/provider/${provider.provider_id.toLowerCase()}`}>View Profile</Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/compare?provider=${provider.provider_id.toLowerCase()}`)} className="text-xs sm:text-sm">
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
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You haven't placed any orders yet.</p>
                <Button className="mt-4" onClick={() => navigate("/compare")}>Browse Tests</Button>
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
                  className={cn("draggable-element", orderDrag.draggedOverIndex === index && "drag-over")}
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
                            <PoundSterling className="h-3 w-3" /><span>{order.price}</span>
                          </div>
                        )}
                      </div>
                      {order.result_url && (
                        <Button className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                          onClick={() => window.open(order.result_url || '#', '_blank', 'noopener,noreferrer')}>
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
  );
};
