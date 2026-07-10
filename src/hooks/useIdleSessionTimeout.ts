import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

/**
 * UK Cyber Essentials Compliance: Idle Session Timeout
 * 
 * Automatically logs out users after a period of inactivity.
 * Default: 30 minutes (configurable)
 * 
 * This addresses the Cyber Essentials requirement for:
 * "User access control - accounts should be locked after a period of inactivity"
 */

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes idle
const ABSOLUTE_MAX_MS = 12 * 60 * 60 * 1000; // 12-hour hard cap (CE+ session control)
const ABSOLUTE_START_KEY = 'mhc.session.startedAt';
const WARNING_BEFORE_MS = 2 * 60 * 1000; // 2 minutes warning

interface UseIdleSessionTimeoutOptions {
  timeoutMs?: number;
  warningMs?: number;
  onWarning?: () => void;
  onTimeout?: () => void;
}

export function useIdleSessionTimeout(options: UseIdleSessionTimeoutOptions = {}) {
  const { user, signOut } = useAuth();
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    warningMs = WARNING_BEFORE_MS,
    onWarning,
    onTimeout,
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(async () => {
    clearTimers();
    
    if (onTimeout) {
      onTimeout();
    }
    
    toast.warning('Session expired due to inactivity', {
      description: 'You have been logged out for security.',
      duration: 5000,
    });
    
    await signOut();
  }, [clearTimers, onTimeout, signOut]);

  const handleWarning = useCallback(() => {
    if (onWarning) {
      onWarning();
    }
    
    toast.info('Session expiring soon', {
      description: 'Your session will expire in 2 minutes due to inactivity. Move your mouse or press a key to stay logged in.',
      duration: 10000,
    });
  }, [onWarning]);

  const resetTimers = useCallback(() => {
    if (!user) return;

    lastActivityRef.current = Date.now();
    clearTimers();

    // Set warning timer (fires warningMs before timeout)
    warningRef.current = setTimeout(handleWarning, timeoutMs - warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(handleTimeout, timeoutMs);
  }, [user, timeoutMs, warningMs, clearTimers, handleWarning, handleTimeout]);

  const handleActivity = useCallback(() => {
    // Debounce: only reset if more than 1 second since last activity
    const now = Date.now();
    if (now - lastActivityRef.current > 1000) {
      resetTimers();
    }
  }, [resetTimers]);

  useEffect(() => {
    if (!user) {
      clearTimers();
      try { localStorage.removeItem(ABSOLUTE_START_KEY); } catch { /* ignore */ }
      return;
    }

    // Absolute session cap: anchor on first observation of this user, force
    // re-auth after ABSOLUTE_MAX_MS regardless of activity.
    let absoluteStart: number;
    try {
      const stored = Number(localStorage.getItem(ABSOLUTE_START_KEY) ?? '');
      absoluteStart = Number.isFinite(stored) && stored > 0 ? stored : Date.now();
      if (!stored) localStorage.setItem(ABSOLUTE_START_KEY, String(absoluteStart));
    } catch {
      absoluteStart = Date.now();
    }
    const remainingAbsolute = absoluteStart + ABSOLUTE_MAX_MS - Date.now();
    if (remainingAbsolute <= 0) {
      handleTimeout();
      return;
    }
    const absoluteTimer = setTimeout(() => {
      try { localStorage.removeItem(ABSOLUTE_START_KEY); } catch { /* ignore */ }
      toast.warning('Session reached its maximum length', {
        description: 'Please sign in again to continue.',
        duration: 5000,
      });
      handleTimeout();
    }, remainingAbsolute);

    // Activity events to monitor
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Set initial timers
    resetTimers();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Handle visibility change (user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if session should have expired while tab was hidden
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= timeoutMs) {
          handleTimeout();
        } else {
          // Reset timers with remaining time
          resetTimers();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimers();
      clearTimeout(absoluteTimer);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, resetTimers, handleActivity, handleTimeout, clearTimers, timeoutMs]);

  return {
    resetTimers,
    lastActivity: lastActivityRef.current,
  };
}
