import Header from "@/components/layout/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { ShieldAlert, Loader2, KeyRound } from "lucide-react";

const AdminRecovery = () => {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
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
      const { data, error } = await supabase.functions.invoke("admin-recovery", {
        body: { secret, email, newPassword },
      });
      if (error) {
        toast.error(error.message || "Recovery failed.");
        return;
      }
      if ((data as any)?.success) {
        toast.success("Admin recovered. MFA cleared. You can now sign in.");
        setDone(true);
      } else {
        toast.error((data as any)?.error || "Recovery failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--navy))] px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white text-center mb-1">
          Admin Recovery
        </h1>
        <p className="text-white/50 text-sm text-center mb-6">
          Emergency access. Requires the recovery secret.
        </p>

        <Alert className="mb-4 border-amber-500/40 bg-amber-950/40">
          <AlertDescription className="text-amber-200 text-xs">
            This will reset the password and clear all MFA factors for the
            specified admin account. All actions are logged.
          </AlertDescription>
        </Alert>

        {done ? (
          <div className="space-y-4 text-center">
            <p className="text-white/80 text-sm">
              Account recovered. Sign in with your new password, then re-enrol MFA.
            </p>
            <Button onClick={() => navigate("/admin/login")} className="w-full">
              Go to admin login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-secret" className="text-white/70 text-sm">
                Recovery secret
              </Label>
              <Input
                id="recovery-secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Paste recovery secret"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-email" className="text-white/70 text-sm">
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
              <Label htmlFor="recovery-new-password" className="text-white/70 text-sm">
                New password (min 12 chars)
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
              <Label htmlFor="recovery-confirm" className="text-white/70 text-sm">
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
              disabled={loading || !secret || !email || !newPassword}
              className="w-full"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Recovering…</>
              ) : (
                <><KeyRound className="mr-2 h-4 w-4" />Reset password & clear MFA</>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            ← Back to admin login
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminRecovery;
