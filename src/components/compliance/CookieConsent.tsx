
import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

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
      const saved = JSON.parse(consent);
      setPreferences(saved);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(minimal);
    localStorage.setItem('cookieConsent', JSON.stringify(minimal));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
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
                  <Shield className="h-5 w-5 text-health-600" />
                  <h3 className="font-semibold">Your Privacy Matters</h3>
                </div>
                <p className="text-sm text-gray-600">
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
                  className="flex items-center gap-2 bg-[#22c0d4] text-white hover:bg-[#fc0173] transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  Manage Preferences
                </Button>
                <Button
                  size="sm"
                  onClick={handleRejectAll}
                  className="bg-[#22c0d4] text-white hover:bg-[#fc0173] transition-all duration-200"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-[#22c0d4] text-white hover:bg-[#fc0173] transition-all duration-200"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Cookie Preferences</h2>
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
                      <h3 className="font-medium">Necessary Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.necessary}
                      disabled={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Essential for the website to function properly. These cannot be disabled.
                  </p>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Analytics Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => updatePreference('analytics', checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                <Separator />

                {/* Marketing Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium">Marketing Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => updatePreference('marketing', checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>

                <Separator />

                {/* Functional Cookies */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <h3 className="font-medium">Functional Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={(checked) => updatePreference('functional', checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Enable enhanced functionality and personalisation, such as remembering your preferences.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button
                  onClick={handleRejectAll}
                  className="flex-1 bg-[#22c0d4] text-white hover:bg-[#fc0173] transition-all duration-200"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#22c0d4] text-white hover:bg-[#fc0173] transition-all duration-200"
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
