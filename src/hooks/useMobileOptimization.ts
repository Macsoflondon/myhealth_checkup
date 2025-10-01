import { useEffect, useState } from "react";

export function useMobileOptimization() {
  // Direct check instead of using hook to avoid initialization issues
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Enhanced mobile performance optimizations
      document.body.classList.add('mobile-device');
      
      // Add comprehensive mobile CSS optimizations
      const style = document.createElement('style');
      style.textContent = `
        .mobile-device * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        .mobile-device input, .mobile-device textarea, .mobile-device [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
        }
        
        .mobile-device *:hover {
          transition: none !important;
        }
        
        /* Optimize scrolling performance */
        .mobile-device {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
        
        /* GPU acceleration for smooth animations */
        .mobile-device .animate-fade-in,
        .mobile-device .animate-scale-in,
        .mobile-device .transition-transform {
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Reduce motion for better performance and accessibility */
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
          image-rendering: crisp-edges;
          content-visibility: auto;
          contain: layout style paint;
        }
        
        /* Mobile-specific font rendering */
        .mobile-device {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeSpeed;
        }
        
        /* Optimize for low-end devices */
        @media (max-width: 480px) {
          .mobile-device .shadow-2xl { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .mobile-device .backdrop-blur { backdrop-filter: none; background: rgba(0, 0, 0, 0.8); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.body.classList.remove('mobile-device');
        if (style.parentNode) {
          document.head.removeChild(style);
        }
      };
    }
  }, [isMobile]);
  
  // Enhanced touch-friendly optimizations
  useEffect(() => {
    if (isMobile) {
      const touchOptimization = document.createElement('style');
      touchOptimization.textContent = `
        @media (max-width: 768px) {
          button, a, input, select, textarea, [role="button"] {
            min-height: 44px;
            min-width: 44px;
            padding: 8px 12px;
          }
          
          .btn-sm, .button-small {
            min-height: 40px;
            padding: 6px 10px;
          }
          
          /* Optimize input fields for mobile */
          input[type="text"], input[type="email"], input[type="password"], 
          input[type="search"], textarea, select {
            font-size: 16px; /* Prevent zoom on iOS */
            border-radius: 8px;
            padding: 12px 16px;
          }
          
          /* Improve button visibility */
          button:not(:disabled) {
            cursor: pointer;
            transform: translateZ(0); /* Force GPU acceleration */
          }
          
          button:active {
            transform: scale(0.98) translateZ(0);
          }
          
          /* Optimize grid layouts for mobile */
          .grid {
            grid-gap: 1rem;
          }
          
          /* Reduce padding on mobile for better space utilization */
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
          .py-16 { padding-top: 3rem; padding-bottom: 3rem; }
        }
        
        /* Tablet optimizations */
        @media (min-width: 769px) and (max-width: 1024px) {
          button, a, input, select, textarea, [role="button"] {
            min-height: 40px;
            min-width: 40px;
          }
        }
      `;
      document.head.appendChild(touchOptimization);
      
      // Add passive event listeners for better scroll performance
      const addPassiveListeners = () => {
        const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
        passiveEvents.forEach(event => {
          document.addEventListener(event, () => {}, { passive: true });
        });
      };
      
      addPassiveListeners();
      
      return () => {
        if (touchOptimization.parentNode) {
          document.head.removeChild(touchOptimization);
        }
      };
    }
  }, [isMobile]);

  // Network-aware optimizations
  useEffect(() => {
    if (isMobile && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection && connection.effectiveType) {
        const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
        
        if (isSlowConnection) {
          document.body.classList.add('slow-connection');
          
          const slowConnectionStyle = document.createElement('style');
          slowConnectionStyle.textContent = `
            .slow-connection img {
              loading: lazy;
            }
            .slow-connection video {
              preload: none;
            }
            .slow-connection .animate-fade-in,
            .slow-connection .animate-scale-in {
              animation: none;
            }
          `;
          document.head.appendChild(slowConnectionStyle);
          
          return () => {
            document.body.classList.remove('slow-connection');
            if (slowConnectionStyle.parentNode) {
              document.head.removeChild(slowConnectionStyle);
            }
          };
        }
      }
    }
  }, [isMobile]);
}