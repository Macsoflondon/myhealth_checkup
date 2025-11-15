import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddPriceAlertButtonProps {
  testId: string;
  testName: string;
  provider: string;
  userId: string;
  currentPrice: number;
}

export const AddPriceAlertButton = ({ 
  testId, 
  testName,
  provider, 
  userId,
  currentPrice
}: AddPriceAlertButtonProps) => {
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(10);
  const [enabled, setEnabled] = useState(true);
  const [hasAlert, setHasAlert] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAlert();
  }, [testId, provider, userId]);

  const checkExistingAlert = async () => {
    try {
      const { data, error } = await supabase
        .from('price_alert_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('test_id', testId)
        .eq('provider', provider)
        .single();

      if (data) {
        setHasAlert(true);
        setAlertId(data.id);
        setThreshold(data.threshold_percentage);
        setEnabled(data.enabled);
      }
    } catch (error) {
      // No alert exists, which is fine
      setHasAlert(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (hasAlert && alertId) {
        // Update existing alert
        const { error } = await supabase
          .from('price_alert_preferences')
          .update({
            threshold_percentage: threshold,
            enabled,
          })
          .eq('id', alertId);

        if (error) throw error;

        toast({
          title: 'Alert Updated',
          description: `You'll be notified when ${testName} drops by ${threshold}% or more`,
        });
      } else {
        // Create new alert
        const { error } = await supabase
          .from('price_alert_preferences')
          .insert({
            user_id: userId,
            test_id: testId,
            provider,
            threshold_percentage: threshold,
            enabled,
          });

        if (error) throw error;

        setHasAlert(true);
        toast({
          title: 'Alert Created',
          description: `You'll be notified when ${testName} drops by ${threshold}% or more`,
        });
      }

      setOpen(false);
      checkExistingAlert();
    } catch (error) {
      console.error('Error saving alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to save price alert',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!alertId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alert_preferences')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setHasAlert(false);
      setAlertId(null);
      toast({
        title: 'Alert Removed',
        description: 'Price alert deleted successfully',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasAlert && enabled ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          {hasAlert && enabled ? (
            <>
              <Bell className="h-4 w-4" />
              Alert Active
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4" />
              Set Alert
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Price Drop Alert</DialogTitle>
          <DialogDescription>
            Get notified when {testName} from {provider} drops in price
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Current Price</Label>
            <div className="text-2xl font-bold text-primary">
              £{currentPrice.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="alert-enabled">Enable Notifications</Label>
            <Switch
              id="alert-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          <div className="space-y-3">
            <Label>Alert Threshold: {threshold}% or more</Label>
            <Slider
              value={[threshold]}
              onValueChange={([value]) => setThreshold(value)}
              min={5}
              max={50}
              step={5}
              disabled={!enabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
            {enabled && (
              <p className="text-sm text-muted-foreground">
                You'll be notified when the price drops to{' '}
                <span className="font-semibold text-green-600">
                  £{(currentPrice * (1 - threshold / 100)).toFixed(2)}
                </span>
                {' '}or lower
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          {hasAlert && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Alert
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : hasAlert ? 'Update Alert' : 'Create Alert'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
