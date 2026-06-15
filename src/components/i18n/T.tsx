import { ReactNode } from 'react';
import { useAiTranslate } from '@/hooks/useAiTranslate';

interface TProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * <T>Some English copy</T> — renders the string translated into the user's
 * currently selected language via Lovable AI Gateway, cached in Supabase.
 * Falls back to the source string while loading / on error.
 */
export function T({ children, as: Tag = 'span', className }: TProps): ReactNode {
  const translated = useAiTranslate(children);
  return <Tag className={className}>{translated}</Tag>;
}
