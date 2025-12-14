import { useEffect, useState } from "react";

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('mobile-device');
      
      const style = document.createElement('style');
      style.id = 'mobile-optimizations';
      style.textContent = `
        .mobile-device * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        .mobile-device input, .mobile-device textarea, .mobile-device [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
        }
        
        .mobile-device {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
        
        /* Speed optimizations - reduce animations on mobile */
        .mobile-device .animate-fade-in { animation-duration: 150ms; }
        .mobile-device .transition-all { transition-duration: 150ms; }
        
        /* Optimized touch targets */
        .mobile-device button, .mobile-device a, .mobile-device [role="button"] {
          min-height: 44px;
          touch-action: manipulation;
        }
        
        /* Prevent layout shifts */
        .mobile-device img { 
          content-visibility: auto;
          contain-intrinsic-size: 100px 100px;
        }
        
        /* Mobile font rendering */
        .mobile-device {
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        
        /* Reduce motion for low-end devices */
        @media (prefers-reduced-motion: reduce) {
          .mobile-device * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Low-end device optimizations */
        @media (max-width: 480px) {
          .mobile-device .backdrop-blur { backdrop-filter: blur(8px); }
          .mobile-device .shadow-lg { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.body.classList.remove('mobile-device');
        const existingStyle = document.getElementById('mobile-optimizations');
        if (existingStyle) document.head.removeChild(existingStyle);
      };
    }
  }, [isMobile]);
  
  // Passive event listeners for scroll performance
  useEffect(() => {
    if (isMobile) {
      const noop = () => {};
      const options = { passive: true };
      document.addEventListener('touchstart', noop, options);
      document.addEventListener('touchmove', noop, options);
      document.addEventListener('wheel', noop, options);
      
      return () => {
        document.removeEventListener('touchstart', noop);
        document.removeEventListener('touchmove', noop);
        document.removeEventListener('wheel', noop);
      };
    }
  }, [isMobile]);

  return { isMobile };
}