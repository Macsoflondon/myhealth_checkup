import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getScrollY = () => {
      return Math.max(
        window.scrollY || 0,
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );
    };

    const toggleVisibility = () => {
      setIsVisible(getScrollY() > 300);
    };

    // Listen on multiple targets for maximum compatibility
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    document.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Fallback: poll scroll position for environments where events don't fire
    const interval = setInterval(toggleVisibility, 500);
    
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      document.removeEventListener('scroll', toggleVisibility);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 z-[60] h-12 w-12 rounded-full bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 animate-fade-in hover:scale-110 p-0"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default BackToTop;
