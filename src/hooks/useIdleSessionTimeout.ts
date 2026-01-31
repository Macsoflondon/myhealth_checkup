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

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
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
      return;
    }

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
