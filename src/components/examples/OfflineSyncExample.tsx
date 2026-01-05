/**
 * Example component demonstrating offline sync with optimistic updates
 * This shows how to use the offline sync system for blood test favorites
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { OfflineSyncIndicator } from "@/components/common/OfflineSyncIndicator";
import { OptimisticUpdateIndicator } from "@/components/common/OptimisticUpdateIndicator";
import { supabase } from "@/integrations/supabase/client";

interface Favorite {
  id: string;
  user_id: string;
  test_id: string;
  name: string;
  provider: string;
  category: string;
  price?: number;
}

export function OfflineSyncExample() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { syncState, isOnline, hasPendingChanges } = useOfflineSync();

  const {
    insert,
    update,
    remove,
    optimisticUpdates,
    hasOptimisticUpdates,
  } = useOptimisticUpdate<Favorite>({
    table: 'favorites',
    enableOfflineSupport: true,
    onSuccess: () => {
      loadFavorites();
    },
  });

  // Load favorites from database
  const loadFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setFavorites(data as Favorite[]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Add a favorite with optimistic update
  const handleAddFavorite = async () => {
    await insert({
      user_id: 'demo-user-id', // Replace with actual user ID
      test_id: `test_${Date.now()}`,
      name: 'Example Blood Test',
      provider: 'medichecks',
      category: 'General Health',
      price: 99.99,
    });
  };

  // Update a favorite with optimistic update
  const handleUpdateFavorite = async (id: string) => {
    await update(id, {
      price: Math.floor(Math.random() * 200) + 50,
    });
  };

  // Remove a favorite with optimistic update
  const handleRemoveFavorite = async (id: string) => {
    await remove(id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Offline Sync Demo</CardTitle>
          <CardDescription>
            Add, update, or remove favorites. Works offline and syncs automatically when back online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sync Status Indicators */}
          <div className="space-y-3">
            <OfflineSyncIndicator showDetails />
            {hasOptimisticUpdates && (
              <OptimisticUpdateIndicator updates={optimisticUpdates} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleAddFavorite} size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Add Favorite
            </Button>
            
            {favorites.length > 0 && (
              <>
                <Button
                  onClick={() => handleUpdateFavorite(favorites[0].id)}
                  variant="outline"
                  size="sm"
                >
                  Update First
                </Button>
                <Button
                  onClick={() => handleRemoveFavorite(favorites[0].id)}
                  variant="destructive"
                  size="sm"
                >
                  Remove First
                </Button>
              </>
            )}
          </div>

          {/* Status Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium">Connection Status</div>
              <div className="text-muted-foreground">
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium">Pending Changes</div>
              <div className="text-muted-foreground">
                {hasPendingChanges ? `${syncState.pendingOperations} queued` : 'None'}
              </div>
            </div>
          </div>

          {/* Favorites List */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Favorites ({favorites.length})</h3>
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorites yet. Add one to get started.</p>
            ) : (
              <div className="space-y-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium text-sm">{fav.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {fav.provider} • {fav.category} • £{fav.price}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFavorite(fav.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 text-sm space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">How to test:</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
              <li>Open DevTools → Network tab → Throttle to "Offline"</li>
              <li>Add/update/remove favorites while offline</li>
              <li>Notice the "Offline" indicator and queued changes</li>
              <li>Go back online to see automatic sync</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
