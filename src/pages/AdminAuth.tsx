import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Loader2, AlertCircle, Lock } from "lucide-react";
import { validateEmail } from "@/lib/passwordValidation";
import { useAccountLockout } from "@/hooks/useAccountLockout";
import { logger } from "@/lib/logger";

const AdminAuth = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    isLocked,
    remainingTimeFormatted,
    attemptsRemaining,
    recordFailedAttempt,
    recordSuccessfulLogin,
    canAttemptLogin,
  } = useAccountLockout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingRole, setVerifyingRole] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // If already logged in, verify admin role and redirect
  useEffect(() => {
    if (!authLoading && user) {
      verifyAndRedirect(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const verifyAndRedirect = async (userId: string) => {
    setVerifyingRole(true);
    try {
      const { data: hasRole, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      if (error) {
        logger.error('Admin role check failed:', error);
        toast.error("Failed to verify admin access.");
        await supabase.auth.signOut();
        setVerifyingRole(false);
        return;
      }

      if (!hasRole) {
        logger.warn('Non-admin attempted admin login:', { userId });
        toast.error("Access denied. This portal is for administrators only.");
        await supabase.auth.signOut();
        setVerifyingRole(false);
        return;
      }

      toast.success("Admin access verified!");
      navigate("/dashboard");
    } catch (err) {
      logger.error('Admin verification error:', err);
      toast.error("Verification failed.");
      await supabase.auth.signOut();
      setVerifyingRole(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAttemptLogin()) {
      toast.error(`Account temporarily locked. Try again in ${remainingTimeFormatted}.`);
      return;
    }

    // Validate
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) { setEmailError("Email is required"); valid = false; }
    else if (!validateEmail(email)) { setEmailError("Please enter a valid email address"); valid = false; }
    if (!password) { setPasswordError("Password is required"); valid = false; }
    else if (password.length < 6) { setPasswordError("Password must be at least 6 characters"); valid = false; }

    if (!valid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const { isNowLocked, attemptsRemaining: remaining } = recordFailedAttempt();
        if (isNowLocked) {
          toast.error("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          toast.error(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
        }
        setLoading(false);
        return;
      }

      recordSuccessfulLogin();

      // Verify admin role server-side
      if (data.user) {
        await verifyAndRedirect(data.user.id);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || verifyingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--navy))]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))] mx-auto" />
          <p className="mt-4 text-white/70 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--navy))] px-4">
      <div className="max-w-sm w-full">
        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))]/15 flex items-center justify-center">
            <Shield className="h-8 w-8 text-[hsl(var(--primary))]" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white text-center mb-1">
          Admin Portal
        </h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Restricted access. Authorised personnel only.
        </p>

        {/* Lockout warning */}
        {isLocked && (
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Account locked. Try again in {remainingTimeFormatted}.
            </AlertDescription>
          </Alert>
        )}

        {!isLocked && attemptsRemaining <= 2 && attemptsRemaining > 0 && (
          <Alert className="mb-4 border-amber-500 bg-amber-950/50">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-300 text-sm">
              {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-white/70 text-sm">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="admin@example.com"
              disabled={loading || isLocked}
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/30 ${emailError ? 'border-destructive' : ''}`}
            />
            {emailError && (
              <p className="text-destructive text-xs">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-white/70 text-sm">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="••••••••"
              disabled={loading || isLocked}
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/30 ${passwordError ? 'border-destructive' : ''}`}
            />
            {passwordError && (
              <p className="text-destructive text-xs">{passwordError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || isLocked}
            className="w-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/90 text-white font-medium"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Authenticating...</>
            ) : (
              <><Shield className="mr-2 h-4 w-4" />Sign In</>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            ← Back to user sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
