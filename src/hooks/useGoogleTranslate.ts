import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GOOGLE_TRANSLATE_LANGUAGES: Record<string, string> = {
  'en': 'en',
  'fr': 'fr',
  'es': 'es',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'nl': 'nl',
  'pl': 'pl',
  'ar': 'ar',
  'zh': 'zh-CN',
  'ja': 'ja',
};

export const useGoogleTranslate = () => {
  // Initialize Google Translate script
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('google-translate-script')) return;

    // Create container for Google Translate widget (hidden)
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Define init function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            includedLanguages: Object.values(GOOGLE_TRANSLATE_LANGUAGES).join(','),
          },
          'google_translate_element'
        );
      }
    };

    // Load Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptEl = document.getElementById('google-translate-script');
      const containerEl = document.getElementById('google_translate_element');
      if (scriptEl) scriptEl.remove();
      if (containerEl) containerEl.remove();
    };
  }, []);

  // Function to trigger translation
  const translateTo = useCallback((languageCode: string) => {
    const googleLangCode = GOOGLE_TRANSLATE_LANGUAGES[languageCode] || languageCode;
    
    // Find and trigger the Google Translate dropdown
    const translateFrame = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
    
    if (translateFrame?.contentDocument) {
      const menuItems = translateFrame.contentDocument.querySelectorAll('.goog-te-menu2-item');
      menuItems.forEach((item: Element) => {
        const text = item.textContent?.toLowerCase() || '';
        if (text.includes(googleLangCode) || item.getAttribute('value') === googleLangCode) {
          (item as HTMLElement).click();
        }
      });
    }

    // Alternative method: set cookie directly
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${googleLangCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${googleLangCode}; path=/`;
    
    // Reload to apply translation
    if (languageCode !== 'en') {
      window.location.reload();
    } else {
      // Reset to English by clearing the cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      window.location.reload();
    }
  }, []);

  return { translateTo };
};
