import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import i18nInstance from '@/i18n/config';
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

type Language = (typeof languages)[number];

/** Resolve the active language against the shared i18next singleton. */
const resolveLanguage = (code: string | undefined): Language =>
  languages.find((lang) => lang.code === code) ||
  languages.find((lang) => lang.code === code?.split('-')[0]) ||
  languages[0];

/** Subscribes to the singleton so every chunk stays in sync after a change. */
export const useActiveLanguage = (): Language => {
  const [code, setCode] = useState<string>(i18nInstance.language ?? 'en');

  useEffect(() => {
    const onChanged = (next: string) => setCode(next);
    i18nInstance.on('languageChanged', onChanged);
    setCode(i18nInstance.language ?? 'en');
    return () => {
      i18nInstance.off('languageChanged', onChanged);
    };
  }, []);

  return resolveLanguage(code);
};

export const changeAppLanguage = (languageCode: string) => {
  void i18nInstance.changeLanguage(languageCode);
  document.documentElement.lang = languageCode === 'en' ? 'en-GB' : languageCode;
  document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
};

export const LanguageList = ({ onSelect }: { onSelect?: () => void } = {}) => {
  const currentLanguage = useActiveLanguage();

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode !== currentLanguage.code) changeAppLanguage(languageCode);
    onSelect?.();
  };


  return (
    <div className="grid grid-cols-1 gap-1">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
            currentLanguage.code === language.code
              ? 'bg-[#e70d69]/10 text-[#e70d69] font-medium'
              : 'hover:bg-[#081129]/5 text-[#081129]'
          }`}
        >
          <span className="text-lg leading-none">{language.flag}</span>
          <span className="text-sm flex-1">{language.name}</span>
          {language.isBase && (
            <span className="text-[10px] text-[#081129]/50 bg-[#081129]/5 px-1.5 py-0.5 rounded">
              Base
            </span>
          )}
          {currentLanguage.code === language.code && (
            <span className="text-[#e70d69]">✓</span>
          )}
        </button>
      ))}
    </div>
  );
};

/**
 * Collapsed language row for the mobile drawer — shows only the active
 * language until tapped, then expands the full list inline.
 */
export const LanguageAccordion = ({ onSelect }: { onSelect?: () => void } = {}) => {
  const currentLanguage = useActiveLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        <span className="text-sm font-semibold text-[#081129] font-[Montserrat] flex-1 truncate">
          {currentLanguage.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#081129]/60 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="border-t border-[#081129]/10 bg-[#f7f7f8] p-2">
          <LanguageList
            onSelect={() => {
              setExpanded(false);
              onSelect?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export const LanguageSwitcher = ({ variant = "chip", onDark = false }: { variant?: "chip" | "glass"; onDark?: boolean } = {}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = useActiveLanguage();


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {variant === "glass" ? (
          <button
            type="button"
            aria-label={t('language.selectLanguage', 'Select language')}
            className={`h-9 w-9 rounded-full transition-colors flex items-center justify-center flex-shrink-0 ${onDark ? "hover:bg-white/15" : "hover:bg-[#081129]/10"}`}
          >
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 bg-white/70 rounded-[3px] shadow-xs text-[16px] leading-none">
              {currentLanguage.flag}
            </span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="!h-9 !w-9 !min-h-0 !p-0 text-secondary hover:text-secondary-foreground hover:bg-secondary border-2 border-secondary rounded-lg transition-colors flex-shrink-0"
            aria-label={t('language.selectLanguage', 'Select language')}
          >
            <span className="text-sm leading-none">{currentLanguage.flag}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background z-[100] shadow-xl border-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Select Language
          </p>
        </div>
        <DropdownMenuSeparator />
        <LanguageList onSelect={() => setIsOpen(false)} />
        <DropdownMenuSeparator />
        <div className="px-3 py-2 text-[10px] text-muted-foreground">
          Base language: British English (GB)
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
