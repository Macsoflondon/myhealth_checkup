import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMFA } from "@/hooks/useAdminMFA";
import { Loader2 } from "lucide-react";
import { AdminMFAGuard } from "@/components/admin/AdminMFAGuard";
import { logger } from "@/lib/logger";
import { AdminAccessNotice } from "@/components/auth/AdminAccessNotice";

/**
 * Cached role verification, keyed by `userId:role`. Without this every admin
 * route mount re-queried `user_roles`; a slow/never-settling query left the
 * guard stuck on "Verifying access...", which reads as the entire admin app
 * freezing after a heavy page (e.g. the encryption audit) has run.
 */
const ROLE_CACHE_TTL_MS = 5 * 60 * 1000;
const ROLE_QUERY_TIMEOUT_MS = 10_000;
const roleCache = new Map<string, { authorized: boolean; at: number }>();

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

/**
 * AdminRoute - Server-side verified admin access control with MFA enforcement
 *
 * Defence-in-depth:
 * 1. Server-side `has_role()` RPC verifies the role.
 * 2. For admins, MFA enrolment + verification (AAL2) is required before any
 *    admin content renders. This is mandatory under Cyber Essentials Plus v3.3.
 * 3. Loading and error states never reveal admin UI structure.
 */
export const AdminRoute = ({ children, requiredRole = 'admin' }: AdminRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const cacheKey = user ? `${user.id}:${requiredRole}` : null;
  const cached = cacheKey ? roleCache.get(cacheKey) : undefined;
  const cacheFresh = !!cached && Date.now() - cached.at < ROLE_CACHE_TTL_MS && cached.authorized;
  const [isVerifying, setIsVerifying] = useState(!cacheFresh);
  const [isAuthorized, setIsAuthorized] = useState(cacheFresh);
  const [denialReason, setDenialReason] = useState<'signed-out' | 'no-role' | 'error' | null>(null);

  // MFA gate (only meaningful for admins; moderators are not currently MFA-gated).
  const enforceMFA = requiredRole === 'admin';
  const mfa = useAdminMFA();

  useEffect(() => {
    let cancelled = false;

    const verifyAdminAccess = async () => {
      if (authLoading) return;

      if (!user) {
        setDenialReason('signed-out');
        setIsVerifying(false);
        return;
      }

      const key = `${user.id}:${requiredRole}`;
      const entry = roleCache.get(key);
      if (entry && Date.now() - entry.at < ROLE_CACHE_TTL_MS && entry.authorized) {
        roleCache.set(key, { authorized: true, at: Date.now() });
        setIsAuthorized(true);
        setIsVerifying(false);
        return;
      }

      // Never let a wedged network call hold the admin UI hostage.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Role verification timed out')), ROLE_QUERY_TIMEOUT_MS),
      );

      try {
        const { data: roleRow, error } = await Promise.race([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', requiredRole)
            .maybeSingle(),
          timeout,
        ]);

        if (cancelled) return;

        if (error) {
          logger.error('Error verifying admin role:', error);
          setDenialReason('error');
          return;
        }

        if (!roleRow) {
          logger.warn('Unauthorized admin access attempt:', { userId: user.id, requiredRole });
          setDenialReason('no-role');
          return;
        }

        roleCache.set(key, { authorized: true, at: Date.now() });
        setIsAuthorized(true);
      } catch (error) {
        if (cancelled) return;
        logger.error('Admin verification failed:', error);
        setDenialReason('error');
      } finally {
        if (!cancelled) setIsVerifying(false);
      }
    };

    verifyAdminAccess();
    return () => { cancelled = true; };
  }, [user, authLoading, requiredRole]);

  if (authLoading || isVerifying || (enforceMFA && mfa.isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <AdminAccessNotice reason={denialReason ?? 'no-role'} />;
  }


  if (enforceMFA) {
    return (
      <AdminMFAGuard
        isVerified={mfa.isVerified}
        needsMFASetup={mfa.needsMFASetup}
        needsMFAVerification={mfa.needsMFAVerification}
        isLoading={mfa.isLoading}
        onMFAComplete={mfa.checkMFAStatus}
      >
        {children}
      </AdminMFAGuard>
    );
  }

  return <>{children}</>;
};
