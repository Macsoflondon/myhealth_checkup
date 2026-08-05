import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { ShieldAlert, Loader2, KeyRound } from "lucide-react";

type RecoveryResponse = {
  success?: boolean;
  error?: string;
  token?: string;
  expiresInMinutes?: number;
  message?: string;
};

const readRecoveryError = async (error: unknown): Promise<string> => {
  const response = (error as { context?: unknown })?.context;

  if (response instanceof Response) {
    try {
      const body = (await response.clone().json()) as { error?: string };
      if (typeof body?.error === "string") return body.error;
    } catch {
      if (response.status === 401) return "Recovery token is invalid, expired or already used.";
      if (response.status === 403) return "You are not authorised to perform this action.";
    }
  }

  return (error as { message?: string })?.message || "Recovery failed.";
};

const AdminRecovery = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      toast.error("Password must be at least 12 characters.");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<RecoveryResponse>("admin-recovery", {
        body: { action: "redeem", token, email, newPassword },
      });
      if (error) {
        toast.error(await readRecoveryError(error));
        return;
      }
      if (data?.success) {
        toast.success("Account recovered. MFA cleared. You can now sign in.");
        setDone(true);
      } else {
        toast.error(data?.error || "Recovery failed.");
      }
    } catch (err) {
      toast.error((err as { message?: string })?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--navy))] px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white text-center mb-1">Admin recovery</h1>
        <p className="text-white/78 text-sm text-center mb-6">
          Requires a single-use recovery token issued by another administrator.
        </p>

        <Alert className="mb-4 border-amber-500/40 bg-amber-950/40">
          <AlertDescription className="text-amber-200 text-xs">
            Recovery tokens expire after 15 minutes and can only be used once, for the
            administrator account they were issued to. This resets that account's password and
            clears its multi-factor devices. No account privileges are granted here, and every
            attempt is logged.
          </AlertDescription>
        </Alert>

        {done ? (
          <div className="space-y-4 text-center">
            <p className="text-white/90 text-sm">
              Account recovered. Sign in with your new password, then re-enrol multi-factor
              authentication straight away.
            </p>
            <Button onClick={() => navigate("/admin/login")} className="w-full">
              Go to admin login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-token" className="text-white/90 text-sm">
                Recovery token
              </Label>
              <Input
                id="recovery-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the token you were issued"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-email" className="text-white/90 text-sm">
                Admin email
              </Label>
              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-new-password" className="text-white/90 text-sm">
                New password (min 12 characters)
              </Label>
              <Input
                id="recovery-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-confirm" className="text-white/90 text-sm">
                Confirm new password
              </Label>
              <Input
                id="recovery-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !token || !email || !newPassword}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recovering…
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Reset password &amp; clear MFA
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="text-white/78 hover:text-white/90 text-xs transition-colors"
          >
            ← Back to admin login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRecovery;
