import { useEffect } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { MfaStepUp } from "@/components/auth/MfaStepUp";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, mfaStepUpRequired, refreshMfaState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Session guard: user is signed in but hasn't completed the second step yet.
  if (mfaStepUpRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#081129] px-4 py-12">
        <div className="w-full max-w-md">
          <MfaStepUp
            onVerified={refreshMfaState}
            title="One more step to sign in"
            description="Enter the 6-digit code from your authenticator app to finish signing in to your account."
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
