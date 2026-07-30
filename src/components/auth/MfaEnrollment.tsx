import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Smartphone, Trash2, Loader2, Copy, Check, Download, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { replaceBackupCodes } from '@/lib/mfa';

/**
 * Two-step verification (TOTP) enrolment for the consumer account.
 *
 * Flow:
 *   1. User clicks "Set up authenticator app" → we call `mfa.enroll` and show
 *      the QR code + manual secret.
 *   2. User enters a 6-digit code → we run challenge/verify. On success the
 *      factor is marked verified.
 *   3. We immediately generate 10 single-use backup codes, display them once,
 *      and require the user to tick "I've saved these" before dismissing.
 *
 * Users can also regenerate backup codes at any time and remove a factor.
 */
export function MfaEnrollment() {
  const { user, refreshMfaState } = useAuth();
  const [factors, setFactors] = useState<Array<{ id: string; status: string; friendly_name: string | null }>>([]);
  const [loading, setLoading] = useState(true);

  const [enrolling, setEnrolling] = useState(false);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Backup-code display state
  const [showBackup, setShowBackup] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [savedAck, setSavedAck] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error('Could not load two-step verification', { description: error.message });
    } else {
      const totp = (data?.all ?? []).filter((f) => f.factor_type === 'totp');
      setFactors(totp.map((f) => ({ id: f.id, status: f.status, friendly_name: f.friendly_name ?? null })));
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const cancelEnrol = async () => {
    if (pendingFactorId) {
      try { await supabase.auth.mfa.unenroll({ factorId: pendingFactorId }); } catch { /* noop */ }
    }
    setPendingFactorId(null);
    setQrCode(null);
    setSecret(null);
    setCode('');
    setVerifyError(null);
  };

  const startEnrol = async () => {
    setEnrolling(true);
    const friendly = `Authenticator (${new Date().toISOString().slice(0, 10)})`;
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: friendly });
    if (error) {
      toast.error('Could not start setup', { description: error.message });
      setEnrolling(false);
      return;
    }
    setPendingFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrolling(false);
  };

  const verify = async () => {
    if (!pendingFactorId || code.length !== 6 || !user) return;
    setSubmitting(true);
    setVerifyError(null);
    const challenge = await supabase.auth.mfa.challenge({ factorId: pendingFactorId });
    if (challenge.error || !challenge.data) {
      setVerifyError('We could not start the check. Please try again in a moment.');
      setSubmitting(false);
      return;
    }
    const verifyRes = await supabase.auth.mfa.verify({
      factorId: pendingFactorId,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (verifyRes.error) {
      setVerifyError("That code didn't match. Please try the newest code shown in your app.");
      setCode('');
      setSubmitting(false);
      return;
    }
    if (verifyRes.data?.access_token && verifyRes.data?.refresh_token) {
      await supabase.auth.setSession({
        access_token: verifyRes.data.access_token,
        refresh_token: verifyRes.data.refresh_token,
      });
    }

    // Generate backup codes and force acknowledgement.
    // The RPC requires an aal2 JWT — refresh first so the token reflects the
    // just-completed TOTP verification.
    try {
      await supabase.auth.refreshSession();
      const codes = await replaceBackupCodes();
      setBackupCodes(codes);
      setShowBackup(true);
      setSavedAck(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      toast.error('Two-step verification is on, but we could not create backup codes', {
        description: `${message}. Please regenerate them below.`,
      });
    }

    toast.success('Two-step verification is now on.');
    setPendingFactorId(null);
    setQrCode(null);
    setSecret(null);
    setCode('');
    setSubmitting(false);
    await refresh();
    await refreshMfaState();
  };

  const regenerateCodes = async () => {
    if (!user) return;
    if (!confirm('Generate a new set of backup codes? Your old codes will stop working immediately.')) return;
    setRegenerating(true);
    try {
      const codes = await replaceBackupCodes();
      setBackupCodes(codes);
      setShowBackup(true);
      setSavedAck(false);
      toast.success('New backup codes generated.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      toast.error('Could not regenerate backup codes', { description: message });
    } finally {
      setRegenerating(false);
    }
  };

  const unenroll = async (factorId: string) => {
    if (!confirm('Turn off two-step verification for this account? You will sign in with your password only.')) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      toast.error('Could not turn off two-step verification', { description: error.message });
      return;
    }
    if (user) {
      await supabase.from('mfa_backup_codes').delete().eq('user_id', user.id);
    }
    toast.success('Two-step verification turned off.');
    await refresh();
    await refreshMfaState();
  };

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const downloadCodes = () => {
    const blob = new Blob(
      [
        `myhealth checkup — backup codes\n`,
        `Account: ${user?.email ?? ''}\n`,
        `Generated: ${new Date().toISOString()}\n\n`,
        `Each code can be used ONCE if you lose access to your authenticator app.\n`,
        `Keep this file somewhere safe (password manager, printed copy).\n\n`,
        backupCodes.map((c, i) => `${String(i + 1).padStart(2, '0')}. ${c}`).join('\n'),
        '\n',
      ],
      { type: 'text/plain' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myhealth-checkup-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const verified = factors.some((f) => f.status === 'verified');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Two-step verification
        </CardTitle>
        <CardDescription>
          Add a second sign-in step using an authenticator app (Google Authenticator, Authy, 1Password…).
          After you enter your password, you'll also enter a 6-digit code from the app.
          Required for administrator accounts and recommended for everyone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <>
            {factors.length === 0 && !pendingFactorId && (
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertTitle>Not set up yet</AlertTitle>
                <AlertDescription>
                  Turning this on protects your account if someone learns your password.
                </AlertDescription>
              </Alert>
            )}

            {factors.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <div className="font-medium">{f.friendly_name ?? 'Authenticator app'}</div>
                  <div className="text-muted-foreground">
                    Status: {f.status === 'verified' ? 'Active' : 'Pending verification'}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => unenroll(f.id)} aria-label="Remove factor">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {pendingFactorId && qrCode && (
              <div className="space-y-3 rounded-lg border border-[#22c0d4]/40 bg-[#081129] p-4 text-white">
                <p className="text-sm">
                  Open your authenticator app, tap "Add account", scan this QR code, then type the 6-digit code it shows.
                </p>
                <div className="flex justify-center">
                  <img src={qrCode} alt="Two-step verification QR code" className="w-48 h-48 bg-white p-2 rounded" />
                </div>
                {secret && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-[#22c0d4]">Can't scan? Enter this code manually</summary>
                    <code className="block mt-1 p-2 bg-white/10 rounded break-all">{secret}</code>
                  </details>
                )}
                <div className="space-y-2">
                  <Label htmlFor="mfa-code" className="text-white/85">6-digit code</Label>
                  <Input
                    id="mfa-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setVerifyError(null); }}
                    className="h-12 text-center text-xl tracking-[0.5em] bg-white text-[#081129] font-semibold"
                  />
                </div>
                {verifyError && (
                  <Alert variant="destructive" className="border-[#e70d69]/60 bg-[#e70d69]/10 text-white">
                    <AlertDescription>{verifyError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button variant="ghost" onClick={cancelEnrol} className="text-white/80 hover:text-white hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button
                    onClick={verify}
                    disabled={submitting || code.length !== 6}
                    className="flex-1 h-12 bg-[#e70d69] hover:bg-[#c60a5b] text-white font-semibold"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Verify and turn on
                  </Button>
                </div>
              </div>
            )}

            {!pendingFactorId && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={startEnrol} disabled={enrolling}>
                  {enrolling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {verified ? 'Add another authenticator' : 'Set up authenticator app'}
                </Button>
                {verified && (
                  <Button variant="outline" onClick={regenerateCodes} disabled={regenerating}>
                    {regenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <KeyRound className="h-4 w-4 mr-2" />}
                    Regenerate backup codes
                  </Button>
                )}
              </div>
            )}

            {showBackup && backupCodes.length > 0 && (
              <div className="space-y-3 rounded-lg border-2 border-[#e70d69]/50 bg-[#081129] p-4 text-white">
                <div>
                  <h3 className="font-[Montserrat] text-base font-semibold">Save your backup codes</h3>
                  <p className="text-sm text-white/75 mt-1">
                    These are the only way back in if you lose your phone or delete the authenticator app.
                    Each code works once. Store them in a password manager, or print them and keep them somewhere safe.
                    We can't show them to you again.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded bg-white/5 p-3 font-mono text-sm">
                  {backupCodes.map((c, i) => (
                    <div key={c} className="tabular-nums">
                      <span className="text-white/40 mr-2">{String(i + 1).padStart(2, '0')}.</span>
                      {c}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={copyCodes} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadCodes} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={savedAck}
                    onCheckedChange={(v) => setSavedAck(v === true)}
                    className="mt-0.5 border-white/50 data-[state=checked]:bg-[#22c0d4] data-[state=checked]:border-[#22c0d4]"
                  />
                  <span>I've saved these backup codes somewhere safe.</span>
                </label>
                <Button
                  disabled={!savedAck}
                  onClick={() => { setShowBackup(false); setBackupCodes([]); }}
                  className="w-full h-11 bg-[#22c0d4] hover:bg-[#1ca8ba] text-[#081129] font-semibold disabled:opacity-40"
                >
                  Done
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MfaEnrollment;
