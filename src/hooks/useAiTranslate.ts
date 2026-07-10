import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const memCache = new Map<string, string>(); // `${lang}::${text}` -> translated

/**
 * AI-powered on-demand translation. Falls back to the source text on error.
 * Skips network when language === 'en' or text is empty.
 */
export function useAiTranslate(text: string | undefined): string {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const [value, setValue] = useState<string>(text ?? '');
  const reqId = useRef(0);

  useEffect(() => {
    if (!text) { setValue(''); return; }
    if (lang === 'en') { setValue(text); return; }
    const key = `${lang}::${text}`;
    const cached = memCache.get(key);
    if (cached) { setValue(cached); return; }

    const myId = ++reqId.current;
    setValue(text); // optimistic: render English while loading
    supabase.functions
      .invoke('translate', { body: { texts: [text], language: lang } })
      .then(({ data, error }) => {
        if (error || !data?.translations) return;
        const t = data.translations[text];
        if (t) {
          memCache.set(key, t);
          if (reqId.current === myId) setValue(t);
        }
      })
      .catch(() => {/* keep fallback */});
  }, [text, lang]);

  return value;
}

/** Batch variant — translates a list of strings, returns a map. */
export function useAiTranslateBatch(texts: string[]): Record<string, string> {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const [map, setMap] = useState<Record<string, string>>({});

  const stableKey = texts.join('|');
  const run = useCallback(async () => {
    if (lang === 'en' || texts.length === 0) {
      setMap(Object.fromEntries(texts.map(t => [t, t])));
      return;
    }
    const result: Record<string, string> = {};
    const need: string[] = [];
    texts.forEach(t => {
      const hit = memCache.get(`${lang}::${t}`);
      if (hit) result[t] = hit; else need.push(t);
    });
    if (need.length === 0) { setMap(result); return; }
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { texts: need, language: lang },
    });
    if (!error && data?.translations) {
      Object.entries(data.translations as Record<string, string>).forEach(([src, tr]) => {
        memCache.set(`${lang}::${src}`, tr);
        result[src] = tr;
      });
    }
    // Fill any gaps with source
    texts.forEach(t => { if (!result[t]) result[t] = t; });
    setMap(result);
  }, [stableKey, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { run(); }, [run]);
  return map;
}
