import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { verifyCurrentPassword } from "@/lib/verify-current-password";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/passwordValidation";
import { MfaStepUp } from "@/components/auth/MfaStepUp";

const isAalError = (message: string | undefined) => {
  if (!message) return false;
  const m = message.toLowerCase();
  return m.includes("aal2") || m.includes("insufficient_aal") || m.includes("assurance");
};

const ChangePasswordCard = () => {
  const { user, refreshMfaState } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [error, setError] = useState("");
  const [stepUpOpen, setStepUpOpen] = useState(false);

  const strength = validatePassword(newPassword);

  const attemptUpdate = async () => {
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      if (isAalError(updateError.message)) {
        setStepUpOpen(true);
        return { retryNeeded: true };
      }
      setError(updateError.message || "Failed to update password.");
      return { retryNeeded: false, failed: true };
    }
    toast.success("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    return { retryNeeded: false };
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("You must be signed in to change your password.");
      return;
    }
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (!strength.isValid) {
      setError("Your new password does not meet security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Your new password must be different from your current password.");
      return;
    }

    setIsSaving(true);
    try {
      // Verify on a throwaway client — signing in on the shared client would
      // replace an aal2 session with a fresh aal1 one and trip the global
      // MFA step-up guard, unmounting this form mid-flow.
      const verified = await verifyCurrentPassword(user.email, currentPassword);
      if (!verified) {
        setError("Current password is incorrect.");
        return;
      }
      await attemptUpdate();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onStepUpVerified = async () => {
    setStepUpOpen(false);
    await refreshMfaState();
    setIsSaving(true);
    try {
      const res = await attemptUpdate();
      if (res.retryNeeded) {
        setError("We still couldn't confirm your identity. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        toast.error(resetError.message || "Failed to send reset email.");
        return;
      }
      toast.success("Password reset email sent. Please check your inbox.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your account password. You will remain signed in on this device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stepUpOpen ? (
          <MfaStepUp
            onVerified={onStepUpVerified}
            onCancel={() => setStepUpOpen(false)}
            title="Confirm it's you before changing your password"
            description="Two-step verification is switched on for this account. Enter the 6-digit code from your authenticator app to continue."
          />
        ) : (
          <>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New password <span className="text-xs text-muted-foreground">(minimum 8 characters)</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  autoComplete="new-password"
                  disabled={isSaving}
                  minLength={8}
                  required
                />
                {newPassword && <PasswordStrengthIndicator strength={strength} password={newPassword} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  autoComplete="new-password"
                  disabled={isSaving}
                  minLength={8}
                  required
                />
                {confirmPassword && newPassword === confirmPassword && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="pt-2">
                <Button type="submit" disabled={isSaving} data-testid="update-password-btn">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold mb-1">Forgotten your current password?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                We can email a secure link to {user?.email ?? "your account email"} so you can set a new password without entering your current one.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendResetEmail}
                disabled={isSendingReset || !user?.email}
                data-testid="send-reset-email-btn"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSendingReset ? "Sending..." : "Send password reset email"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
