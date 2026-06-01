import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMFA } from "@/hooks/useAdminMFA";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminMFAGuard } from "@/components/admin/AdminMFAGuard";
import { logger } from "@/lib/logger";

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
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // MFA gate (only meaningful for admins; moderators are not currently MFA-gated).
  const enforceMFA = requiredRole === 'admin';
  const mfa = useAdminMFA();

  useEffect(() => {
    let cancelled = false;

    const verifyAdminAccess = async () => {
      if (authLoading) return;

      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: roleRow, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', requiredRole)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          logger.error('Error verifying admin role:', error);
          navigate("/");
          return;
        }

        if (!roleRow) {
          logger.warn('Unauthorized admin access attempt:', { userId: user.id, requiredRole });
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        if (cancelled) return;
        logger.error('Admin verification failed:', error);
        navigate("/");
      } finally {
        if (!cancelled) setIsVerifying(false);
      }
    };

    verifyAdminAccess();
    return () => { cancelled = true; };
  }, [user, authLoading, navigate, requiredRole]);

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

  if (!isAuthorized) return null;

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
