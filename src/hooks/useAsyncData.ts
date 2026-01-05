import { useState, useCallback, useRef, useEffect } from "react";
import { isNetworkError, getUserFriendlyMessage } from "@/services/apiErrorHandler";
import errorToast from "@/lib/errorToast";

interface UseAsyncDataOptions<T> {
  initialData?: T;
  retryCount?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

interface UseAsyncDataReturn<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  execute: () => Promise<T | undefined>;
  retry: () => Promise<T | undefined>;
  reset: () => void;
}

export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
  const {
    initialData,
    retryCount = 3,
    retryDelay = 1000,
    showErrorToast = true,
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const attemptRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const executeWithRetry = useCallback(
    async (attempt = 0): Promise<T | undefined> => {
      if (!mountedRef.current) return undefined;

      setIsLoading(true);
      setError(null);
      attemptRef.current = attempt;

      try {
        const result = await asyncFn();
        
        if (!mountedRef.current) return undefined;
        
        setData(result);
        setIsLoading(false);
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (!mountedRef.current) return undefined;

        const error = err instanceof Error ? err : new Error(String(err));

        // Retry logic with exponential backoff
        if (attempt < retryCount && isNetworkError(error)) {
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeWithRetry(attempt + 1);
        }

        setError(error);
        setIsLoading(false);
        onError?.(error);

        if (showErrorToast) {
          const message = getUserFriendlyMessage(error);
          errorToast.generic(message);
        }

        return undefined;
      }
    },
    [asyncFn, retryCount, retryDelay, showErrorToast, onError, onSuccess]
  );

  const execute = useCallback(() => {
    return executeWithRetry(0);
  }, [executeWithRetry]);

  const retry = useCallback(() => {
    return executeWithRetry(0);
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    execute,
    retry,
    reset,
  };
}

export default useAsyncData;
