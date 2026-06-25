import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Smartphone, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * UK Cyber Essentials / NCSC: TOTP MFA enrolment for any signed-in user.
 * Admins already require AAL2 server-side; this component lets standard users
 * opt in to authenticator-app MFA.
 */
export function MfaEnrollment() {
  const [factors, setFactors] = useState<Array<{ id: string; status: string; friendly_name: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error('Could not load MFA factors', { description: error.message });
    } else {
      const totp = (data?.all ?? []).filter((f) => f.factor_type === 'totp');
      setFactors(totp.map((f) => ({ id: f.id, status: f.status, friendly_name: f.friendly_name })));
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const startEnrol = async () => {
    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Authenticator (${new Date().toISOString().slice(0, 10)})`,
    });
    if (error) {
      toast.error('Could not start MFA enrolment', { description: error.message });
      setEnrolling(false);
      return;
    }
    setPendingFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrolling(false);
  };

  const verify = async () => {
    if (!pendingFactorId || code.length < 6) return;
    setSubmitting(true);
    const challenge = await supabase.auth.mfa.challenge({ factorId: pendingFactorId });
    if (challenge.error || !challenge.data) {
      toast.error('Challenge failed', { description: challenge.error?.message });
      setSubmitting(false);
      return;
    }
    const verifyRes = await supabase.auth.mfa.verify({
      factorId: pendingFactorId,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (verifyRes.error) {
      toast.error('Invalid code', { description: verifyRes.error.message });
      setSubmitting(false);
      return;
    }
    toast.success('MFA enabled');
    setPendingFactorId(null);
    setQrCode(null);
    setSecret(null);
    setCode('');
    setSubmitting(false);
    refresh();
  };

  const unenroll = async (factorId: string) => {
    if (!confirm('Remove this MFA factor? You will sign in with password only.')) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      toast.error('Could not remove factor', { description: error.message });
      return;
    }
    toast.success('MFA factor removed');
    refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Two-factor authentication
        </CardTitle>
        <CardDescription>
          Add an authenticator app (Google Authenticator, 1Password, Authy) as a second sign-in step.
          Required for administrator accounts; recommended for everyone.
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
                <AlertTitle>No MFA factors yet</AlertTitle>
                <AlertDescription>
                  Enable an authenticator app to protect your account against password theft.
                </AlertDescription>
              </Alert>
            )}

            {factors.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <div className="font-medium">{f.friendly_name ?? 'Authenticator app'}</div>
                  <div className="text-muted-foreground">Status: {f.status}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => unenroll(f.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {pendingFactorId && qrCode && (
              <div className="space-y-3 rounded border p-4">
                <p className="text-sm">Scan this QR code with your authenticator app, then enter the 6-digit code.</p>
                <img src={qrCode} alt="MFA QR code" className="w-48 h-48 bg-white p-2 border" />
                {secret && (
                  <p className="text-xs break-all text-muted-foreground">
                    Or enter this secret manually: <code>{secret}</code>
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="mfa-code">6-digit code</Label>
                  <Input
                    id="mfa-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verify} disabled={submitting || code.length < 6}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Verify & enable
                  </Button>
                  <Button variant="ghost" onClick={() => { setPendingFactorId(null); setQrCode(null); setSecret(null); setCode(''); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {!pendingFactorId && (
              <Button onClick={startEnrol} disabled={enrolling}>
                {enrolling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {factors.length > 0 ? 'Add another authenticator' : 'Set up authenticator app'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MfaEnrollment;
