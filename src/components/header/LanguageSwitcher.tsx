import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) ||
    languages.find((lang) => lang.code === i18n.language?.split('-')[0]) ||
    languages[0];

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === i18n.language) {
      setIsOpen(false);
      return;
    }
    i18n.changeLanguage(languageCode);
    document.documentElement.lang = languageCode === 'en' ? 'en-GB' : languageCode;
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="!h-9 !w-9 !min-h-0 !p-0 text-secondary hover:text-secondary-foreground hover:bg-secondary border-2 border-secondary rounded-lg transition-colors flex-shrink-0"
          aria-label={t('language.selectLanguage', 'Select language')}
        >
          <span className="text-sm leading-none">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background z-[100] shadow-xl border-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Select Language
          </p>
        </div>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer py-2.5 ${
              currentLanguage.code === language.code
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm flex-1">{language.name}</span>
            {language.isBase && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Base
              </span>
            )}
            {currentLanguage.code === language.code && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-3 py-2 text-[10px] text-muted-foreground">
          Base language: British English (GB)
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
