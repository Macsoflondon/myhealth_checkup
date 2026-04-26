import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/passwordValidation";
import { AlertCircle, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  const passwordStrength = validatePassword(password);

  // Check if user arrived via password reset link
  useEffect(() => {
    const checkRecoveryMode = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check URL hash for recovery token (Supabase uses hash-based routing for auth)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery' || session?.user) {
        setIsRecoveryMode(true);
      } else {
        // No valid recovery session, redirect to auth
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate("/auth");
      }
    };

    checkRecoveryMode();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (!passwordStrength.isValid) {
      setPasswordError("Password does not meet security requirements");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('same as the old password')) {
          toast.error("New password must be different from your current password");
        } else {
          toast.error(error.message || "Failed to reset password");
        }
        return;
      }

      toast.success("Password reset successfully! You can now sign in with your new password.");
      
      // Sign out and redirect to auth page
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isRecoveryMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg drop-shadow-md p-8 text-center">
            <p className="text-[#081129]">Verifying reset link...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg drop-shadow-md p-8">
          <h2 className="text-2xl text-center mb-6 text-[#22c0d4] font-medium">
            Set New Password
          </h2>
          
          <p className="text-sm text-[#081129] text-center mb-6">
            Please enter your new password below.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password <span className="text-xs text-muted-foreground">(minimum 8 characters)</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Create a strong password"
                required
                disabled={loading}
                className={passwordError ? "border-destructive" : ""}
                minLength={8}
              />
              {password && <PasswordStrengthIndicator strength={passwordStrength} password={password} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Confirm your new password"
                required
                disabled={loading}
                className={passwordError && password !== confirmPassword ? "border-destructive" : ""}
                minLength={8}
              />
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {passwordError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{passwordError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#22c0d4] text-[#e70d69] text-base rounded drop-shadow-md font-medium"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="hover:underline text-center text-base text-[#081129] font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
