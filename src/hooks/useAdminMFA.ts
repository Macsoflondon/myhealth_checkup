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

const isMFAVerificationResult = (value: unknown): value is MFAVerificationResult => {
  return !!value && typeof value === 'object' &&
    'isAdmin' in value && 'hasMFA' in value && 'mfaVerified' in value;
};

const readFunctionErrorBody = async (error: unknown): Promise<unknown | null> => {
  const response = (error as { context?: unknown })?.context;

  if (!(response instanceof Response)) return null;

  try {
    return await response.clone().json();
  } catch {
    return null;
  }
};

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

      // The edge function returns 403 with a valid MFAVerificationResult body
      // when an admin needs to set up or step-up MFA. Supabase surfaces non-2xx
      // as fnError and may leave `data` empty, so parse the FunctionHttpError
      // response body before treating it as a hard failure.
      const errorBody = fnError ? await readFunctionErrorBody(fnError) : null;
      const status = isMFAVerificationResult(data) ? data : errorBody;

      if (isMFAVerificationResult(status)) {
        let reconciledStatus = status;

        // Immediately after a successful TOTP challenge, the browser session can
        // already be AAL2 even if the Edge Function response still reports the
        // pre-step-up state. Only reconcile after the server has confirmed the
        // user is an admin with an enrolled MFA factor.
        if (status.isAdmin && status.hasMFA && !status.mfaVerified) {
          const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (aalData?.currentLevel === 'aal2') {
            reconciledStatus = {
              ...status,
              mfaVerified: true,
              message: 'Admin verified with MFA',
            };
          }
        }

        setMfaStatus(reconciledStatus);
      } else if (fnError) {
        console.error('MFA verification error:', fnError);
        setError(fnError.message);
      } else {
        setError('Unexpected response from MFA verification');
      }
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
