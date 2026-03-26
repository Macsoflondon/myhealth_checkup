import { useState, useEffect, useRef } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

/**
 * Extended mobile hook that also applies mobile-specific CSS optimisations
 * (touch targets, reduced animations, scroll performance).
 * Use on the root layout/index page only — not in every component.
 */
export function useMobileOptimization() {
  const isMobile = useIsMobile()
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('mobile-device')

      const style = document.createElement('style')
      style.id = 'mobile-optimizations'
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
        .mobile-device .animate-fade-in { animation-duration: 150ms; }
        .mobile-device .transition-all { transition-duration: 150ms; }
        .mobile-device button, .mobile-device a, .mobile-device [role="button"] {
          min-height: 44px;
          touch-action: manipulation;
        }
        .mobile-device img {
          content-visibility: auto;
          contain-intrinsic-size: 100px 100px;
        }
        .mobile-device {
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        @media (prefers-reduced-motion: reduce) {
          .mobile-device * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (max-width: 480px) {
          .mobile-device .backdrop-blur { backdrop-filter: blur(8px); }
          .mobile-device .shadow-lg { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        }
      `
      document.head.appendChild(style)
      styleRef.current = style

      // Passive touch listeners for scroll performance
      const noop = () => {}
      const options = { passive: true } as AddEventListenerOptions
      document.addEventListener('touchstart', noop, options)
      document.addEventListener('touchmove', noop, options)
      document.addEventListener('wheel', noop, options)

      return () => {
        document.body.classList.remove('mobile-device')
        if (styleRef.current?.parentNode) {
          document.head.removeChild(styleRef.current)
        }
        document.removeEventListener('touchstart', noop)
        document.removeEventListener('touchmove', noop)
        document.removeEventListener('wheel', noop)
      }
    }
  }, [isMobile])

  return { isMobile }
}
