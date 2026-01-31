import { useIdleSessionTimeout } from '@/hooks/useIdleSessionTimeout';

/**
 * UK Cyber Essentials Compliance: Session Security Provider
 * 
 * Wraps the application to enforce idle session timeout.
 * Must be rendered within AuthProvider context.
 */
export function SessionSecurityProvider({ children }: { children: React.ReactNode }) {
  // Initialize idle session timeout (30 minutes)
  useIdleSessionTimeout();

  return <>{children}</>;
}
