import { useState, useEffect } from 'react';

interface ScrollState {
  scrollDirection: 'up' | 'down' | 'idle';
  scrollY: number;
  isAtTop: boolean;
}

export const useScrollDirection = (threshold: number = 6): ScrollState => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollDirection: 'idle',
    scrollY: 0,
    isAtTop: true,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const difference = Math.abs(currentScrollY - lastScrollY);
      
      // Only update if scroll difference exceeds threshold
      if (difference < threshold) {
        ticking = false;
        return;
      }

      const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const isAtTop = currentScrollY <= 50;

      setScrollState({
        scrollDirection: isAtTop ? 'idle' : newDirection,
        scrollY: currentScrollY,
        isAtTop,
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrollState;
};
