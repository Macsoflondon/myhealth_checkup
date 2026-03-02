import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { Loader2 } from 'lucide-react';

// All languages with GB English as the base
const languages = [
  { code: 'en', name: 'English (UK)', flag: '🇬🇧', isBase: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const { translateTo } = useGoogleTranslate();

  // Check for existing Google Translate cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
    if (googtrans) {
      const langMatch = googtrans.match(/\/en\/([a-z-]+)/i);
      if (langMatch) {
        const langCode = langMatch[1].split('-')[0]; // Handle zh-CN -> zh
        const validLang = languages.find(l => l.code === langCode);
        if (validLang) {
          setSelectedLang(langCode);
        }
      }
    }
  }, []);

  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === selectedLang) {
      setIsOpen(false);
      return;
    }
    
    setIsTranslating(true);
    setSelectedLang(languageCode);
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Trigger Google Translate for dynamic page translation
    // Small delay to show loading state
    setTimeout(() => {
      translateTo(languageCode);
    }, 100);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 sm:h-12 sm:w-12 p-1.5 sm:p-2 text-[#22c0d4] hover:text-[#e70d69] hover:bg-[#e70d69]/10 border-2 border-[#22c0d4]/60 hover:border-[#e70d69] rounded-lg transition-colors flex-shrink-0"
          aria-label={t('language.selectLanguage')}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="text-2xl">{currentLanguage.flag}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 z-[100] shadow-xl border-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Language</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Powered by Google Translate</p>
        </div>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer py-2.5 ${
              selectedLang === language.code 
                ? 'bg-[#22c0d4]/10 text-[#22c0d4] font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm flex-1">{language.name}</span>
            {language.isBase && (
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Base</span>
            )}
            {selectedLang === language.code && (
              <span className="text-[#22c0d4]">✓</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-3 py-2 text-[10px] text-gray-400">
          Base language: British English (GB)
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
