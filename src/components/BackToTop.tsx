import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTop, getScrollPosition } from '@/lib/utils';
import { cn } from '@/lib/utils';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const toggleVisibility = () => {
      // Debounce the scroll event
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (getScrollPosition() > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }, 10);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClick = () => {
    scrollToTop();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "p-3 rounded-full shadow-lg",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 hover:shadow-xl",
        "transition-all duration-300 ease-in-out",
        "animate-fade-in",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "md:bottom-8 md:right-8"
      )}
      aria-label="Return to top of page"
      title="Return to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;