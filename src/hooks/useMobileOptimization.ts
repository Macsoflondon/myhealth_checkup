import { useEffect } from "react";
import { useIsMobile } from "./use-mobile";

export function useMobileOptimization() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // Optimize for mobile performance
      
      // Disable hover effects on mobile for better performance
      document.body.classList.add('mobile-device');
      
      // Add CSS for mobile optimizations
      const style = document.createElement('style');
      style.textContent = `
        .mobile-device * {
          -webkit-tap-highlight-color: transparent;
        }
        
        .mobile-device *:hover {
          transition: none !important;
        }
        
        /* Optimize scrolling */
        .mobile-device {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Reduce motion for better performance */
        @media (prefers-reduced-motion: reduce) {
          .mobile-device * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Optimize images for mobile */
        .mobile-device img {
          image-rendering: optimizeSpeed;
          image-rendering: -webkit-optimize-contrast;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.body.classList.remove('mobile-device');
        document.head.removeChild(style);
      };
    }
  }, [isMobile]);
  
  // Touch-friendly optimizations
  useEffect(() => {
    if (isMobile) {
      // Increase touch target sizes
      const touchOptimization = document.createElement('style');
      touchOptimization.textContent = `
        @media (max-width: 768px) {
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          
          .btn-sm, .button-small {
            min-height: 36px;
            padding: 8px 12px;
          }
        }
      `;
      document.head.appendChild(touchOptimization);
      
      return () => {
        document.head.removeChild(touchOptimization);
      };
    }
  }, [isMobile]);
}