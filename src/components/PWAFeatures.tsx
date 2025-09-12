import { useEffect } from "react";

export function PWAFeatures() {
  useEffect(() => {
    // Enhanced service worker registration with update handling
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content available, show update notification
                    if (window.confirm('New version available! Click OK to update.')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Enhanced install prompt with better UX
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Create install banner if it doesn't exist
      let installBanner = document.getElementById('pwa-install-banner');
      if (!installBanner) {
        installBanner = document.createElement('div');
        installBanner.id = 'pwa-install-banner';
        installBanner.innerHTML = `
          <div style="
            position: fixed; 
            bottom: 20px; 
            left: 20px; 
            right: 20px; 
            background: #081129; 
            color: white; 
            padding: 16px; 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 400px;
            margin: 0 auto;
          ">
            <div>
              <div style="font-weight: 600; margin-bottom: 4px;">Install myhealthcheckup</div>
              <div style="font-size: 14px; opacity: 0.8;">Get the full app experience</div>
            </div>
            <div>
              <button id="install-app-btn" style="
                background: #22c0d4; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 8px; 
                font-weight: 600;
                cursor: pointer;
                margin-right: 8px;
              ">Install</button>
              <button id="dismiss-install-btn" style="
                background: transparent; 
                color: white; 
                border: 1px solid rgba(255,255,255,0.3); 
                padding: 8px 16px; 
                border-radius: 8px;
                cursor: pointer;
              ">Later</button>
            </div>
          </div>
        `;
        document.body.appendChild(installBanner);
        
        // Handle install button click
        document.getElementById('install-app-btn')?.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
              console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installBanner?.remove();
          }
        });
        
        // Handle dismiss button click
        document.getElementById('dismiss-install-btn')?.addEventListener('click', () => {
          installBanner?.remove();
          // Don't show again for this session
          sessionStorage.setItem('pwa-install-dismissed', 'true');
        });
      }
    };
    
    // Only show install prompt if not dismissed this session
    if (!sessionStorage.getItem('pwa-install-dismissed')) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    // Handle app installed event
    const handleAppInstalled = (evt: Event) => {
      console.log('App was installed');
      // Remove install banner if it exists
      document.getElementById('pwa-install-banner')?.remove();
      // Track installation
      if ('gtag' in window) {
        (window as any).gtag('event', 'app_installed', {
          event_category: 'PWA',
          event_label: 'User installed the app'
        });
      }
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

    // Add network status indicator
    const addNetworkStatusIndicator = () => {
      const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        let statusIndicator = document.getElementById('network-status');
        
        if (!isOnline) {
          if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.id = 'network-status';
            statusIndicator.innerHTML = `
              <div style="
                position: fixed; 
                top: 0; 
                left: 0; 
                right: 0; 
                background: #f59e0b; 
                color: white; 
                text-align: center; 
                padding: 8px;
                z-index: 2000;
                font-size: 14px;
              ">
                You're offline. Some features may not work.
              </div>
            `;
            document.body.appendChild(statusIndicator);
          }
        } else if (statusIndicator) {
          statusIndicator.remove();
        }
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      updateOnlineStatus(); // Check initial status
    };

    addNetworkStatusIndicator();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null; // This is a utility component with no UI
}