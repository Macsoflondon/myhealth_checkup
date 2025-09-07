import { useEffect } from "react";

export function PWAFeatures() {
  useEffect(() => {
    // Register service worker for caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add to home screen prompt
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button if user hasn't installed yet
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            }
            deferredPrompt = null;
          });
        });
      }
    });

    // Handle app installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed');
    });
  }, []);

  return null; // This is a utility component with no UI
}