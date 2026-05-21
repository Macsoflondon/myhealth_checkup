import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'rise' | 'scale' | 'fade' | 'slide-left' | 'slide-right';

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  /**
   * Animation style:
   * - 'rise'        (default) — fade + translateY(8px → 0)
   * - 'scale'       — fade + scale(0.96 → 1) for emphasis (CTAs, hero cards)
   * - 'fade'        — opacity only (use for sections that already animate internally, e.g. carousels)
   * - 'slide-left'  — fade + translateX(-24px → 0)
   * - 'slide-right' — fade + translateX(24px → 0)
   */
  variant?: Variant;
}

const HIDDEN_BY_VARIANT: Record<Variant, string> = {
  rise: 'opacity-0 translate-y-8',
  scale: 'opacity-0 scale-[0.96]',
  fade: 'opacity-0',
  'slide-left': 'opacity-0 -translate-x-6',
  'slide-right': 'opacity-0 translate-x-6',
};

const VISIBLE_BY_VARIANT: Record<Variant, string> = {
  rise: 'opacity-100 translate-y-0',
  scale: 'opacity-100 scale-100',
  fade: 'opacity-100',
  'slide-left': 'opacity-100 translate-x-0',
  'slide-right': 'opacity-100 translate-x-0',
};

const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  variant = 'rise',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Late-mount safety net (lazy-loaded sections, mobile): if the element
    // is already at or above the viewport when we attach, IntersectionObserver
    // may not fire an initial callback — reveal immediately.
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px' }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        isVisible ? VISIBLE_BY_VARIANT[variant] : HIDDEN_BY_VARIANT[variant],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollFadeIn;
