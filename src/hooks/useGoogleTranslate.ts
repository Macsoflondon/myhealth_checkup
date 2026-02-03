import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// Map our language codes to Google Translate codes
const GOOGLE_TRANSLATE_LANGUAGES: Record<string, string> = {
  'en': 'en',    // GB English (base language)
  'fr': 'fr',    // French
  'es': 'es',    // Spanish
  'de': 'de',    // German
  'it': 'it',    // Italian
  'pt': 'pt',    // Portuguese
  'nl': 'nl',    // Dutch
  'pl': 'pl',    // Polish
  'ar': 'ar',    // Arabic
  'zh': 'zh-CN', // Chinese (Simplified)
  'ja': 'ja',    // Japanese
};

export const useGoogleTranslate = () => {
  // Initialize Google Translate script
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('google-translate-script')) return;

    // Create container for Google Translate widget (hidden)
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.cssText = 'display: none !important; visibility: hidden; position: absolute; left: -9999px;';
    document.body.appendChild(container);

    // Define init function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en', // Base language is GB English
            autoDisplay: false,
            includedLanguages: Object.values(GOOGLE_TRANSLATE_LANGUAGES).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
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

    // Add CSS to hide Google Translate banner
    const style = document.createElement('style');
    style.id = 'google-translate-styles';
    style.textContent = `
      .goog-te-banner-frame, .goog-te-balloon-frame { display: none !important; }
      .goog-te-menu-frame { display: none !important; }
      body { top: 0 !important; }
      .skiptranslate { display: none !important; }
      .goog-te-gadget { display: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      const scriptEl = document.getElementById('google-translate-script');
      const containerEl = document.getElementById('google_translate_element');
      const styleEl = document.getElementById('google-translate-styles');
      if (scriptEl) scriptEl.remove();
      if (containerEl) containerEl.remove();
      if (styleEl) styleEl.remove();
    };
  }, []);

  // Function to trigger translation
  const translateTo = useCallback((languageCode: string) => {
    const googleLangCode = GOOGLE_TRANSLATE_LANGUAGES[languageCode] || languageCode;
    
    // Set cookies for Google Translate
    const domain = window.location.hostname;
    
    if (languageCode === 'en') {
      // Reset to English (GB) by clearing the cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
      
      // Force reload to restore original GB English content
      window.location.reload();
      return;
    }
    
    // Set the translation cookies
    const translateCookie = `/en/${googleLangCode}`;
    document.cookie = `googtrans=${translateCookie}; path=/`;
    document.cookie = `googtrans=${translateCookie}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${translateCookie}; path=/; domain=.${domain}`;
    
    // Try to use the Google Translate API directly
    const translateFrame = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
    
    if (translateFrame?.contentDocument) {
      // Find and click the appropriate language in the menu
      const menuItems = translateFrame.contentDocument.querySelectorAll('.goog-te-menu2-item');
      menuItems.forEach((item: Element) => {
        const itemValue = item.getAttribute('value');
        if (itemValue === googleLangCode) {
          (item as HTMLElement).click();
          return;
        }
      });
    }
    
    // Reload page to apply translation via cookie
    window.location.reload();
  }, []);

  return { translateTo };
};
