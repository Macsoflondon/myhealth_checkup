import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { savedProvidersApi, type SavedProvider } from "@/api/supabase/savedProviders.api";
import { toast } from "sonner";

export function useSavedProviders() {
  const { user } = useAuth();
  const [savedProviders, setSavedProviders] = useState<SavedProvider[]>([]);
  const [savedProviderIds, setSavedProviderIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchSavedProviders = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await savedProvidersApi.getUserSavedProviders(user.id);
      if (error) throw error;
      
      setSavedProviders(data || []);
      setSavedProviderIds(new Set((data || []).map(p => p.provider_id)));
    } catch (error) {
      console.error("Error fetching saved providers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedProviders();
  }, [fetchSavedProviders]);

  const toggleSaveProvider = async (providerId: string, providerName: string) => {
    if (!user) {
      toast.error("Please sign in to save providers");
      return;
    }

    const isSaved = savedProviderIds.has(providerId);

    try {
      if (isSaved) {
        const { error } = await savedProvidersApi.removeSavedProvider(user.id, providerId);
        if (error) throw error;
        
        setSavedProviders(prev => prev.filter(p => p.provider_id !== providerId));
        setSavedProviderIds(prev => {
          const next = new Set(prev);
          next.delete(providerId);
          return next;
        });
        toast.success(`Removed ${providerName} from saved providers`);
      } else {
        const { data, error } = await savedProvidersApi.saveProvider(user.id, providerId, providerName);
        if (error) throw error;
        
        if (data) {
          setSavedProviders(prev => [data, ...prev]);
          setSavedProviderIds(prev => new Set(prev).add(providerId));
        }
        toast.success(`Saved ${providerName} to your dashboard`);
      }
    } catch (error) {
      console.error("Error toggling saved provider:", error);
      toast.error("Failed to update saved providers");
    }
  };

  const isProviderSaved = (providerId: string) => savedProviderIds.has(providerId);

  return {
    savedProviders,
    savedProviderIds,
    isLoading,
    toggleSaveProvider,
    isProviderSaved,
    refetch: fetchSavedProviders
  };
}
