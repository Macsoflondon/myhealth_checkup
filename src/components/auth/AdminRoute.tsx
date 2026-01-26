import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

/**
 * AdminRoute - Server-side verified admin access control
 * 
 * This component provides defense-in-depth by verifying admin status
 * server-side using the has_role() database function before rendering
 * any admin content.
 * 
 * Unlike client-side role checks, this:
 * 1. Verifies the role via RPC call to the database
 * 2. Shows a loading state that doesn't reveal admin page structure
 * 3. Redirects unauthorized users before any admin UI is exposed
 */
export const AdminRoute = ({ children, requiredRole = 'admin' }: AdminRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Server-side verification using the has_role database function
        const { data: hasRole, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: requiredRole
        });

        if (error) {
          logger.error('Error verifying admin role:', error);
          navigate("/");
          return;
        }

        if (!hasRole) {
          logger.warn('Unauthorized admin access attempt:', { userId: user.id, requiredRole });
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        logger.error('Admin verification failed:', error);
        navigate("/");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdminAccess();
  }, [user, authLoading, navigate, requiredRole]);

  // Show loading state that doesn't reveal admin page structure
  if (authLoading || isVerifying) {
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
    return null;
  }

  return <>{children}</>;
};
