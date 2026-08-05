import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck, KeyRound, LifeBuoy } from "lucide-react";
import { getAalStatus, verifyTotp, redeemBackupCode } from "@/lib/mfa";

interface MfaStepUpProps {
  /** Called once step-up succeeds and the session is at aal2 (or MFA has been reset via a backup code). */
  onVerified: () => void | Promise<void>;
  /** Optional cancel handler — shown as a text button next to Verify. */
  onCancel?: () => void;
  /** Optional heading override. */
  title?: string;
  /** Optional supporting copy override. */
  description?: string;
  /** Compact = inline within an existing card; false renders its own navy card. */
  variant?: "card" | "inline";
}

/**
 * Step-up prompt for anyone who has TOTP enrolled but whose current session
 * is still AAL1. Handles both the normal 6-digit authenticator code path and
 * the single-use backup code recovery path. Uses brand tokens (navy, pink,
 * turquoise) and reads back in plain, calm English.
 */
export function MfaStepUp({
  onVerified,
  onCancel,
  title = "Enter your verification code",
  description = "For your security, please enter the 6-digit code from your authenticator app to continue.",
  variant = "card",
}: MfaStepUpProps) {
  const [mode, setMode] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingFactor, setLoadingFactor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const status = await getAalStatus();
      if (cancelled) return;
      setFactorId(status.verifiedFactorId);
      setLoadingFactor(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    setError(null);
    setSubmitting(true);
    const err = await verifyTotp(factorId, code);
    setSubmitting(false);
    if (err) {
      setError(err);
      setCode("");
      setTimeout(() => inputRef.current?.focus(), 30);
      return;
    }
    await onVerified();
  };

  const handleBackupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await redeemBackupCode(backupCode);
    setSubmitting(false);
    if (res.ok === false) {
      setError(res.message);
      return;
    }
    await onVerified();
  };

  const body = (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-[Montserrat] text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/90">{description}</p>
      </div>

      {loadingFactor ? (
        <div className="flex items-center gap-2 text-sm text-white/90">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing secure check…
        </div>
      ) : !factorId && mode === "totp" ? (
        <Alert className="border-[#22c0d4]/40 bg-[#22c0d4]/10 text-white">
          <AlertDescription>
            No authenticator app is currently linked to this account. If you set one up recently and can't sign in, use a backup code instead.
          </AlertDescription>
        </Alert>
      ) : mode === "totp" ? (
        <form onSubmit={handleTotpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mfa-totp" className="text-white/85">
              6-digit code
            </Label>
            <Input
              id="mfa-totp"
              ref={inputRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
              className="h-14 text-center text-2xl tracking-[0.6em] bg-white text-[#081129] font-semibold"
            />
            <p className="text-xs text-white/78">
              Open your authenticator app (Google Authenticator, Authy, 1Password…) and enter the newest 6-digit code shown for myhealth checkup.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="border-[#e70d69]/60 bg-[#e70d69]/10 text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-white/90 hover:text-white"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting || code.length !== 6 || !factorId}
              className="flex-1 h-12 bg-[#e70d69] hover:bg-[#c60a5b] text-white font-semibold text-base"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Verify and continue</>
              )}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => { setMode("backup"); setError(null); }}
            className="flex items-center gap-2 text-sm text-[#22c0d4] hover:underline"
          >
            <LifeBuoy className="h-4 w-4" /> Lost access to your authenticator? Use a backup code
          </button>
        </form>
      ) : (
        <form onSubmit={handleBackupSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mfa-backup" className="text-white/85">Backup code</Label>
            <Input
              id="mfa-backup"
              placeholder="e.g. ABCDE-FGHJK"
              value={backupCode}
              onChange={(e) => { setBackupCode(e.target.value.toUpperCase()); setError(null); }}
              className="h-12 text-center tracking-widest bg-white text-[#081129] font-mono font-semibold"
              autoComplete="one-time-code"
            />
            <p className="text-xs text-white/78">
              Enter one of the single-use backup codes you saved when you set up two-step verification. Each code works only once — you'll be asked to re-enrol your authenticator afterwards.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="border-[#e70d69]/60 bg-[#e70d69]/10 text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setMode("totp"); setError(null); }}
              className="text-white/90 hover:text-white"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={submitting || backupCode.trim().length < 8}
              className="flex-1 h-12 bg-[#22c0d4] hover:bg-[#1ca8ba] text-[#081129] font-semibold text-base"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</>
              ) : (
                <><KeyRound className="mr-2 h-4 w-4" /> Use backup code</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  if (variant === "inline") return body;

  return (
    <div className="rounded-2xl bg-[#081129] border border-white/10 p-6 sm:p-8 shadow-xl">
      {body}
    </div>
  );
}

export default MfaStepUp;
