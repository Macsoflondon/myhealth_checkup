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

const SUPABASE_FUNCTIONS_URL = 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM';


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

      const callVerify = (token: string) =>
        withTimeout(
          fetch(`${SUPABASE_FUNCTIONS_URL}/verify-admin-mfa`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
            },
          }),
          CHECK_TIMEOUT_MS,
        );

      // Use fetch rather than supabase.functions.invoke: a 403 here is an
      // expected "step-up required" response, not a failure. invoke() throws on
      // non-2xx, which surfaced as a captured RUNTIME_ERROR and a blank screen.
      let response = await callVerify(accessToken);

      // 401 means the JWT is stale (typically an expired session whose refresh
      // token was already rotated/revoked). Try one refresh, then treat it as a
      // signed-out state instead of an error/blank screen.
      if (response.status === 401) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        const newToken = refreshed.session?.access_token;
        if (newToken) {
          response = await callVerify(newToken);
        }
        if (response.status === 401) {
          mfaCache.delete(user.id);
          setMfaStatus(null);
          setError('Your session has expired. Please sign in again.');
          setIsLoading(false);
          await supabase.auth.signOut();
          return;
        }
      }

      const status: unknown = await response.json().catch(() => null);



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
        console.warn('MFA verification fell back to client check; status', response.status);

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
