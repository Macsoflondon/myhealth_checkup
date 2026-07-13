import { useState, useCallback, useEffect } from 'react';

/**
 * UX-only Account Lockout Hint
 *
 * SECURITY NOTE: This hook is a *user-experience* safeguard, not a security
 * boundary. State is held in localStorage and can be reset by clearing storage
 * or opening a private tab. Real brute-force protection is enforced by
 * Supabase Auth's server-side rate limiting (configured in the Supabase
 * dashboard → Auth → Rate Limiting) and CAPTCHA, both of which apply to
 * every request regardless of client state. Do not rely on this hook for
 * security; use it only to surface a friendly "too many attempts" message.
 *
 * Default: 5 failed attempts = 15 minute UX lockout
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'login_attempts';

interface LoginAttemptData {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

function getStoredData(): LoginAttemptData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { attempts: 0, lastAttempt: 0, lockedUntil: null };
}

function setStoredData(data: LoginAttemptData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function clearStoredData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function useAccountLockout() {
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Check lock status on mount and periodically
  const checkLockStatus = useCallback(() => {
    const data = getStoredData();
    const now = Date.now();

    // Reset attempts if more than 1 hour since last attempt
    if (data.lastAttempt && now - data.lastAttempt > 60 * 60 * 1000) {
      clearStoredData();
      setIsLocked(false);
      setRemainingTime(0);
      setAttempts(0);
      return;
    }

    // Check if currently locked
    if (data.lockedUntil && now < data.lockedUntil) {
      setIsLocked(true);
      setRemainingTime(Math.ceil((data.lockedUntil - now) / 1000));
      setAttempts(data.attempts);
    } else if (data.lockedUntil && now >= data.lockedUntil) {
      // Lockout expired, reset but keep attempt count
      const newData = { ...data, lockedUntil: null };
      setStoredData(newData);
      setIsLocked(false);
      setRemainingTime(0);
      setAttempts(data.attempts);
    } else {
      setIsLocked(false);
      setRemainingTime(0);
      setAttempts(data.attempts);
    }
  }, []);

  // Record a failed login attempt
  const recordFailedAttempt = useCallback(() => {
    const data = getStoredData();
    const now = Date.now();
    
    const newAttempts = data.attempts + 1;
    const newData: LoginAttemptData = {
      attempts: newAttempts,
      lastAttempt: now,
      lockedUntil: null,
    };

    // Lock the account if max attempts exceeded
    if (newAttempts >= MAX_ATTEMPTS) {
      newData.lockedUntil = now + LOCKOUT_DURATION_MS;
    }

    setStoredData(newData);
    checkLockStatus();

    return {
      isNowLocked: newAttempts >= MAX_ATTEMPTS,
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - newAttempts),
    };
  }, [checkLockStatus]);

  // Record a successful login (reset attempts)
  const recordSuccessfulLogin = useCallback(() => {
    clearStoredData();
    setIsLocked(false);
    setRemainingTime(0);
    setAttempts(0);
  }, []);

  // Manually clear the lockout state (UX only)
  const clearLockout = useCallback(() => {
    clearStoredData();
    setIsLocked(false);
    setRemainingTime(0);
    setAttempts(0);
  }, []);

  // Check if login is allowed
  const canAttemptLogin = useCallback((): boolean => {
    const data = getStoredData();
    const now = Date.now();

    if (data.lockedUntil && now < data.lockedUntil) {
      return false;
    }

    return true;
  }, []);

  // Format remaining time for display
  const formatRemainingTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
    }
    return `${secs} second${secs !== 1 ? 's' : ''}`;
  }, []);

  // Initial check and interval for countdown
  useEffect(() => {
    checkLockStatus();
    
    const interval = setInterval(() => {
      checkLockStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkLockStatus]);

  return {
    isLocked,
    remainingTime,
    remainingTimeFormatted: formatRemainingTime(remainingTime),
    attempts,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attempts),
    recordFailedAttempt,
    recordSuccessfulLogin,
    canAttemptLogin,
    clearLockout,
    maxAttempts: MAX_ATTEMPTS,
  };
}
