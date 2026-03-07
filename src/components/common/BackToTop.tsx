import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const getScrollY = useCallback(() => {
    // Check all possible scroll containers
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(getScrollY() > 300);
    };

    // Listen on multiple targets
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    document.addEventListener('scroll', toggleVisibility, { passive: true });
    document.documentElement.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Fallback polling for iframe/embedded contexts
    const interval = setInterval(toggleVisibility, 400);
    
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      document.removeEventListener('scroll', toggleVisibility);
      document.documentElement.removeEventListener('scroll', toggleVisibility);
      clearInterval(interval);
    };
  }, [getScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-28 right-6 z-[60] h-12 w-12 rounded-full bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg p-0 transition-all duration-300 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
};

export default BackToTop;
