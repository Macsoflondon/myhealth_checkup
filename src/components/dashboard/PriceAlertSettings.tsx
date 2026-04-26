import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingDown, Trash2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface PriceAlert {
  id: string;
  test_id: string;
  provider: string;
  threshold_percentage: number;
  enabled: boolean;
  last_alerted_at: string | null;
  test_name?: string;
  current_price?: number;
}

interface PriceAlertSettingsProps {
  userId: string;
}

export const PriceAlertSettings = ({ userId }: PriceAlertSettingsProps) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, [userId]);

  const fetchAlerts = async () => {
    try {
      const { data: alertsData, error: alertsError } = await supabase
        .from('price_alert_preferences')
        .select('*')
        .eq('user_id', userId);

      if (alertsError) throw alertsError;

      // Enrich with test details
      const enrichedAlerts = await Promise.all(
        (alertsData || []).map(async (alert) => {
          const { data: testData } = await supabase
            .from('provider_tests')
            .select('test_name, price')
            .eq('id', alert.test_id)
            .eq('provider_id', alert.provider)
            .single();

          return {
            ...alert,
            test_name: testData?.test_name || 'Unknown Test',
            current_price: testData?.price || 0,
          };
        })
      );

      setAlerts(enrichedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load price alerts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (alertId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('price_alert_preferences')
        .update({ enabled })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(a => a.id === alertId ? { ...a, enabled } : a));
      
      toast({
        title: enabled ? 'Alert Enabled' : 'Alert Disabled',
        description: enabled 
          ? 'You will receive notifications when the price drops'
          : 'Price notifications paused for this test',
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert',
        variant: 'destructive',
      });
    }
  };

  const updateThreshold = async (alertId: string, threshold: number) => {
    try {
      const { error } = await supabase
        .from('price_alert_preferences')
        .update({ threshold_percentage: threshold })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, threshold_percentage: threshold } : a
      ));
    } catch (error) {
      console.error('Error updating threshold:', error);
      toast({
        title: 'Error',
        description: 'Failed to update threshold',
        variant: 'destructive',
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('price_alert_preferences')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.filter(a => a.id !== alertId));
      
      toast({
        title: 'Alert Deleted',
        description: 'Price alert removed successfully',
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Price Drop Alerts
            </CardTitle>
            <CardDescription>
              Get notified when your favorite tests drop in price
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Mail className="h-3 w-3" />
            Email Notifications
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No price alerts set up yet</p>
            <p className="text-sm text-muted-foreground">
              Add tests to your favorites and enable alerts to get notified of price drops
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-4 p-4 border rounded-lg bg-background"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{alert.test_name}</h4>
                      {alert.enabled ? (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Paused</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current Price: £{alert.current_price?.toFixed(2)}
                    </p>
                    {alert.last_alerted_at && (
                      <p className="text-xs text-muted-foreground">
                        Last alert: {formatDistanceToNow(new Date(alert.last_alerted_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Alert Threshold: {alert.threshold_percentage}% or more
                  </Label>
                  <Slider
                    value={[alert.threshold_percentage]}
                    onValueChange={([value]) => updateThreshold(alert.id, value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              You'll receive email notifications when prices drop by your threshold or more. 
              Alerts are sent once per 24 hours to avoid spam.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
