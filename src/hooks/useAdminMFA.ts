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

/**
 * Cached MFA verification result, keyed by user id.
 *
 * Every /admin/* route mount previously re-ran the `verify-admin-mfa` edge
 * function. If that call was slow (or never settled) the guard stayed in its
 * loading state, which made the whole admin app look frozen: sidebar links
 * changed the URL but only ever rendered the spinner. Caching the last known
 * good result keeps navigation instant and resilient.
 */
const MFA_CACHE_TTL_MS = 5 * 60 * 1000;
const CHECK_TIMEOUT_MS = 15_000;
const mfaCache = new Map<string, { status: MFAVerificationResult; at: number }>();

const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('MFA verification timed out')), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const useAdminMFA = (): UseAdminMFAResult => {
  const { user } = useAuth();
  const cached = user ? mfaCache.get(user.id) : undefined;
  const cacheFresh = !!cached && Date.now() - cached.at < MFA_CACHE_TTL_MS;
  const [isLoading, setIsLoading] = useState(!cacheFresh);
  const [error, setError] = useState<string | null>(null);
  const [mfaStatus, setMfaStatus] = useState<MFAVerificationResult | null>(
    cacheFresh ? cached!.status : null,
  );

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

      const { data, error: fnError } = await withTimeout(
        supabase.functions.invoke('verify-admin-mfa', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        CHECK_TIMEOUT_MS,
      );

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

        mfaCache.set(user.id, { status: reconciledStatus, at: Date.now() });
        setMfaStatus(reconciledStatus);
      } else {
        // The edge function was unreachable or returned an unparsable body.
        // Fall back to a client-side check so the admin app never dead-ends on
        // a blank screen: role comes from `user_roles`, MFA state from the
        // Supabase auth client itself.
        if (fnError) console.warn('MFA verification fell back to client check:', fnError.message);

        const [{ data: roleRow }, { data: factorsData }, { data: aalData }] = await Promise.all([
          supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle(),
          supabase.auth.mfa.listFactors(),
          supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        ]);

        const hasMFA = (factorsData?.totp ?? []).some((f) => f.status === 'verified');
        const fallback: MFAVerificationResult = {
          isAdmin: !!roleRow,
          hasMFA,
          mfaVerified: hasMFA && aalData?.currentLevel === 'aal2',
          requiresMFA: !!roleRow,
          userId: user.id,
          message: 'Resolved from client session',
        };

        mfaCache.set(user.id, { status: fallback, at: Date.now() });
        setMfaStatus(fallback);
      }

    } catch (err) {
      console.error('MFA check failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify MFA status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const entry = mfaCache.get(user.id);
    if (entry && Date.now() - entry.at < MFA_CACHE_TTL_MS) {
      setMfaStatus(entry.status);
      setIsLoading(false);
      return;
    }
    void checkMFAStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
