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

const languages = [
  { code: 'en', name: 'English (UK)', flag: '🇬🇧' },
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
  const { translateTo } = useGoogleTranslate();

  // Check for existing Google Translate cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
    if (googtrans) {
      const langMatch = googtrans.match(/\/en\/([a-z-]+)/i);
      if (langMatch) {
        const langCode = langMatch[1].split('-')[0]; // Handle zh-CN -> zh
        setSelectedLang(langCode);
      }
    }
  }, []);

  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLang(languageCode);
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Trigger Google Translate for dynamic translation
    translateTo(languageCode);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-[#e70d69] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-2 border-[#e70d69]/60 hover:border-[#22c0d4] rounded-lg transition-colors flex-shrink-0"
          aria-label={t('language.selectLanguage')}
        >
          <span className="text-2xl">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-gray-800 z-[100] shadow-xl border-2">
        <div className="px-2 py-1.5">
          <p className="text-xs text-gray-500 font-medium">Select Language</p>
          <p className="text-[10px] text-gray-400">Powered by Google Translate</p>
        </div>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              selectedLang === language.code ? 'bg-[#22c0d4]/10 text-[#22c0d4]' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
            {selectedLang === language.code && (
              <span className="ml-auto text-[#22c0d4]">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
