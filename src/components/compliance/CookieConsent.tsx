
import React, { useState, useEffect } from 'react';
import { X, Shield, Eye, BarChart3, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { broadcastConsent, type CookiePreferences } from '@/lib/consent';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const saved = JSON.parse(consent) as CookiePreferences;
        setPreferences(saved);
        // Broadcast on hydration so listeners (analytics, ads) sync state.
        broadcastConsent(saved);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const persistAndBroadcast = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    broadcastConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    persistAndBroadcast({ necessary: true, analytics: true, marketing: true, functional: true });
  };

  const handleRejectAll = () => {
    persistAndBroadcast({ necessary: true, analytics: false, marketing: false, functional: false });
  };

  const handleSavePreferences = () => {
    persistAndBroadcast(preferences);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-brand-turquoise" />
                  <h3 className="font-semibold text-brand-navy">Your Privacy Matters</h3>
                </div>
                <p className="text-sm text-brand-navy">
                  We use cookies to enhance your experience, provide personalised content, and analyse our traffic.
                  By clicking "Accept All", you consent to our use of cookies. 
                  <a href="/privacy-policy" className="text-health-600 underline ml-1">
                    Read our Privacy Policy
                  </a>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="bg-brand-turquoise text-white hover:bg-brand-pink border-brand-turquoise hover:border-brand-pink transition-all duration-200"
                >
                  Manage Preferences
                </Button>
                <Button
                  size="sm"
                  onClick={handleRejectAll}
                  className="bg-brand-turquoise text-white hover:bg-brand-pink border-brand-turquoise hover:border-brand-pink transition-all duration-200"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-brand-turquoise text-white hover:bg-brand-pink border-brand-turquoise hover:border-brand-pink transition-all duration-200"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-brand-navy">Cookie Preferences</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-brand-navy">Necessary Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.necessary}
                      disabled={true}
                    />
                  </div>
                  <p className="text-sm text-brand-navy">
                    Essential for the website to function properly. These cannot be disabled.
                  </p>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-brand-navy">Analytics Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => updatePreference('analytics', checked)}
                    />
                  </div>
                  <p className="text-sm text-brand-navy">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                <Separator />

                {/* Marketing Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium text-brand-navy">Marketing Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => updatePreference('marketing', checked)}
                    />
                  </div>
                  <p className="text-sm text-brand-navy">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>

                <Separator />

                {/* Functional Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-orange-600" />
                      <h3 className="font-medium text-brand-navy">Functional Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={(checked) => updatePreference('functional', checked)}
                    />
                  </div>
                  <p className="text-sm text-brand-navy">
                    Enable enhanced functionality and personalisation, such as remembering your preferences.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button
                  onClick={handleRejectAll}
                  className="flex-1 bg-brand-turquoise text-white hover:bg-brand-pink border-brand-turquoise hover:border-brand-pink transition-all duration-200"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-brand-turquoise text-white hover:bg-brand-pink border-brand-turquoise hover:border-brand-pink transition-all duration-200"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
