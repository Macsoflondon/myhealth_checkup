import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ShieldCheck, Loader2, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminMFAGuardProps {
  children: React.ReactNode;
  isVerified: boolean;
  needsMFASetup: boolean;
  needsMFAVerification: boolean;
  isLoading: boolean;
  onMFAComplete: () => void;
}

export const AdminMFAGuard = ({
  children,
  isVerified,
  needsMFASetup,
  needsMFAVerification,
  isLoading,
  onMFAComplete
}: AdminMFAGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [setupStep, setSetupStep] = useState<'initial' | 'qr' | 'verify'>('initial');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartEnrollment = async () => {
    try {
      setIsEnrolling(true);
      
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      });

      if (error) {
        toast.error('Failed to start MFA enrollment: ' + error.message);
        return;
      }

      if (data) {
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
        setSetupStep('qr');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      toast.error('Failed to start MFA enrollment');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerifyAndEnroll = async () => {
    if (!factorId || verifyCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsVerifying(true);

      // First, verify the enrollment
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
      });

      if (challengeError) {
        toast.error('Challenge failed: ' + challengeError.message);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode
      });

      if (verifyError) {
        toast.error('Verification failed: ' + verifyError.message);
        return;
      }

      toast.success('MFA enabled successfully!');
      onMFAComplete();
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Failed to verify MFA code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyExisting = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsVerifying(true);

      // Get the factors list
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError || !factorsData?.totp?.length) {
        toast.error('No MFA factors found');
        return;
      }

      const verifiedFactor = factorsData.totp.find(f => f.status === 'verified');
      if (!verifiedFactor) {
        toast.error('No verified MFA factor found');
        return;
      }

      // Create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: verifiedFactor.id
      });

      if (challengeError) {
        toast.error('Challenge failed: ' + challengeError.message);
        return;
      }

      // Verify the challenge
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: verifiedFactor.id,
        challengeId: challengeData.id,
        code: verifyCode
      });

      if (verifyError) {
        toast.error('Invalid code: ' + verifyError.message);
        return;
      }

      toast.success('MFA verified successfully!');
      onMFAComplete();
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Failed to verify MFA code');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  if (needsMFASetup) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>MFA Required for Admin Access</CardTitle>
            <CardDescription>
              Multi-factor authentication is required for all admin operations to protect sensitive data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {setupStep === 'initial' && (
              <>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Requirement</AlertTitle>
                  <AlertDescription>
                    As an admin, you must set up two-factor authentication using an authenticator app like Google Authenticator, Authy, or 1Password.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleStartEnrollment} 
                  className="w-full"
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Set Up Authenticator App
                    </>
                  )}
                </Button>
              </>
            )}

            {setupStep === 'qr' && qrCode && (
              <>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app:
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="MFA QR Code" 
                      className="w-48 h-48 border rounded-lg"
                    />
                  </div>
                  {secret && (
                    <div className="text-xs text-muted-foreground">
                      <p>Or enter this code manually:</p>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs break-all">
                        {secret}
                      </code>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verifyCode">Enter the 6-digit code from your app:</Label>
                  <Input
                    id="verifyCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <Button 
                  onClick={handleVerifyAndEnroll}
                  className="w-full"
                  disabled={isVerifying || verifyCode.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verify & Enable MFA
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsMFAVerification) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              Enter your authenticator code to access admin features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mfaCode">6-digit authenticator code:</Label>
              <Input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
            </div>
            <Button 
              onClick={handleVerifyExisting}
              className="w-full"
              disabled={isVerifying || verifyCode.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback - shouldn't normally reach here
  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page.
        </AlertDescription>
      </Alert>
      <Button onClick={() => navigate('/')} className="mt-4">
        Return Home
      </Button>
    </div>
  );
};
