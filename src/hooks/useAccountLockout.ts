import { useState, useCallback, useEffect } from 'react';

/**
 * UK Cyber Essentials Compliance: Account Lockout Protection
 * 
 * Tracks failed login attempts and implements temporary lockout
 * to prevent brute-force attacks.
 * 
 * Default: 5 failed attempts = 15 minute lockout
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
    maxAttempts: MAX_ATTEMPTS,
  };
}
