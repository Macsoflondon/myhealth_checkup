import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface MFAVerificationResult {
  isAdmin: boolean;
  hasMFA: boolean;
  mfaVerified: boolean;
  requiresMFA: boolean;
  userId: string | null;
  message: string;
}

export interface UseAdminMFAResult {
  isLoading: boolean;
  isVerified: boolean;
  needsMFASetup: boolean;
  needsMFAVerification: boolean;
  error: string | null;
  mfaStatus: MFAVerificationResult | null;
  checkMFAStatus: () => Promise<void>;
}

export const useAdminMFA = (): UseAdminMFAResult => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaStatus, setMfaStatus] = useState<MFAVerificationResult | null>(null);

  const checkMFAStatus = async () => {
    if (!user) {
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        setError('No active session');
        setIsLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('verify-admin-mfa', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (fnError) {
        console.error('MFA verification error:', fnError);
        setError(fnError.message);
        setIsLoading(false);
        return;
      }

      setMfaStatus(data as MFAVerificationResult);
    } catch (err) {
      console.error('MFA check failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify MFA status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMFAStatus();
  }, [user]);

  const isVerified = mfaStatus?.isAdmin && mfaStatus?.hasMFA && mfaStatus?.mfaVerified;
  const needsMFASetup = mfaStatus?.isAdmin && !mfaStatus?.hasMFA;
  const needsMFAVerification = mfaStatus?.isAdmin && mfaStatus?.hasMFA && !mfaStatus?.mfaVerified;

  return {
    isLoading,
    isVerified: !!isVerified,
    needsMFASetup: !!needsMFASetup,
    needsMFAVerification: !!needsMFAVerification,
    error,
    mfaStatus,
    checkMFAStatus
  };
};
