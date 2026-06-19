import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global DOM auto-translator.
 *
 * When the active language is not English, this walks the rendered DOM and
 * translates:
 *   - visible text nodes
 *   - alt, aria-label, title, placeholder attributes
 *
 * Translations are routed through the existing `translate` edge function
 * (Lovable AI Gateway + Supabase cache), batched, and applied in place. The
 * original English is stashed on each node so switching back to English
 * restores it instantly with no network call.
 *
 * Re-runs on: language change, route change, and DOM mutations (debounced).
 */

const BATCH_SIZE = 40;        // edge function caps at 50
const MAX_LEN = 2000;
const DEBOUNCE_MS = 350;

// Persistent cache: `${lang}::${text}` -> translated
const cache = new Map<string, string>();
// Strings currently being fetched, so we don't enqueue duplicates
const inflight = new Set<string>();

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'KBD', 'SAMP',
  'SVG', 'PATH', 'CANVAS', 'IFRAME', 'INPUT', 'TEXTAREA',
]);

const ATTR_KEYS = ['alt', 'aria-label', 'title', 'placeholder'] as const;

function shouldSkipNode(el: Element | null): boolean {
  let cur: Element | null = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    if (cur.getAttribute?.('data-no-translate') === 'true') return true;
    if (cur.getAttribute?.('translate') === 'no') return true;
    cur = cur.parentElement;
  }
  return false;
}

function isTranslatable(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2 || trimmed.length > MAX_LEN) return false;
  // Skip numbers, pure symbols, URLs, currency-only
  if (/^[\d\s.,£$€%+\-/:()×x]+$/.test(trimmed)) return false;
  if (/^https?:\/\//.test(trimmed)) return false;
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  return true;
}

interface Pending {
  text: string;
  apply: (translated: string) => void;
}

function collectPending(root: Node, lang: string): Pending[] {
  const pending: Pending[] = [];

  // 1. Text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const parent = n.parentElement;
      if (!parent || shouldSkipNode(parent)) return NodeFilter.FILTER_REJECT;
      const text = n.nodeValue ?? '';
      if (!isTranslatable(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    // Use the original English (stashed once) as the cache key, so flipping
    // languages always translates from the canonical source.
    const original =
      (textNode as any).__i18nOriginal ?? (textNode.nodeValue ?? '');
    (textNode as any).__i18nOriginal = original;

    const leading = textNode.nodeValue?.match(/^\s*/)?.[0] ?? '';
    const trailing = textNode.nodeValue?.match(/\s*$/)?.[0] ?? '';
    const core = original.trim();
    if (!core) continue;

    const cached = cache.get(`${lang}::${core}`);
    if (cached) {
      textNode.nodeValue = leading + cached + trailing;
      continue;
    }
    pending.push({
      text: core,
      apply: (translated) => {
        textNode.nodeValue = leading + translated + trailing;
      },
    });
  }

  // 2. Attributes on every element
  const elements =
    root instanceof Element
      ? [root, ...Array.from(root.querySelectorAll('*'))]
      : Array.from((root as Document | DocumentFragment).querySelectorAll('*'));

  for (const el of elements) {
    if (shouldSkipNode(el)) continue;
    for (const attr of ATTR_KEYS) {
      const raw = el.getAttribute(attr);
      if (!raw) continue;
      const stashKey = `__i18n_${attr}`;
      const original = (el as any)[stashKey] ?? raw;
      (el as any)[stashKey] = original;

      const core = original.trim();
      if (!isTranslatable(core)) continue;

      const cached = cache.get(`${lang}::${core}`);
      if (cached) {
        el.setAttribute(attr, cached);
        continue;
      }
      pending.push({
        text: core,
        apply: (translated) => el.setAttribute(attr, translated),
      });
    }
  }

  return pending;
}

function restoreEnglish(root: Node) {
  // Text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const t = node as Text;
    const original = (t as any).__i18nOriginal;
    if (typeof original === 'string') t.nodeValue = original;
  }
  // Attributes
  const elements =
    root instanceof Element
      ? [root, ...Array.from(root.querySelectorAll('*'))]
      : Array.from((root as Document | DocumentFragment).querySelectorAll('*'));
  for (const el of elements) {
    for (const attr of ATTR_KEYS) {
      const original = (el as any)[`__i18n_${attr}`];
      if (typeof original === 'string') el.setAttribute(attr, original);
    }
  }
}

async function translateBatch(texts: string[], lang: string): Promise<Record<string, string>> {
  if (texts.length === 0) return {};
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { texts, language: lang },
    });
    if (error || !data?.translations) return {};
    return data.translations as Record<string, string>;
  } catch {
    return {};
  }
}

export function AutoTranslatePage() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = (i18n.language || 'en').split('-')[0];
  const timerRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // English: restore originals and stop observing
    if (lang === 'en') {
      observerRef.current?.disconnect();
      observerRef.current = null;
      restoreEnglish(document.body);
      return;
    }

    const run = async () => {
      const pending = collectPending(document.body, lang);
      if (pending.length === 0) return;

      // Deduplicate by source text — many strings repeat
      const uniqueTexts = Array.from(
        new Set(pending.map((p) => p.text).filter((t) => !inflight.has(`${lang}::${t}`))),
      );
      uniqueTexts.forEach((t) => inflight.add(`${lang}::${t}`));

      // Chunk
      const chunks: string[][] = [];
      for (let i = 0; i < uniqueTexts.length; i += BATCH_SIZE) {
        chunks.push(uniqueTexts.slice(i, i + BATCH_SIZE));
      }
      const results = await Promise.all(chunks.map((c) => translateBatch(c, lang)));
      const merged: Record<string, string> = Object.assign({}, ...results);

      Object.entries(merged).forEach(([src, tr]) => {
        cache.set(`${lang}::${src}`, tr);
        inflight.delete(`${lang}::${src}`);
      });
      // Clear inflight for anything that failed too, so a later mutation can retry
      uniqueTexts.forEach((t) => inflight.delete(`${lang}::${t}`));

      pending.forEach((p) => {
        const tr = cache.get(`${lang}::${p.text}`);
        if (tr) p.apply(tr);
      });
    };

    const debouncedRun = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(run, DEBOUNCE_MS);
    };

    // Initial pass
    run();

    // Watch for DOM changes (route content swaps, lazy-loaded sections, modals)
    observerRef.current?.disconnect();
    const observer = new MutationObserver((mutations) => {
      // Ignore mutations that are only our own attribute writes
      const meaningful = mutations.some(
        (m) => m.type === 'childList' || (m.type === 'characterData'),
      );
      if (meaningful) debouncedRun();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    observerRef.current = observer;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      observer.disconnect();
    };
  }, [lang, location.pathname]);

  return null;
}

export default AutoTranslatePage;
