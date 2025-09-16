import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Add safety check for React context
  try {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

    useEffect(() => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
  } catch (error) {
    // Fallback when React context is not available
    console.warn('useIsMobile hook called outside React context, falling back to window check')
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  }
}
