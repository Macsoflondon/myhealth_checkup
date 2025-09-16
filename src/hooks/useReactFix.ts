import React from 'react';

// Hook to ensure React context is available and prevent dispatcher errors
export const useReactFix = () => {
  // Ensure React internals are available
  if (typeof window !== 'undefined') {
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (ReactInternals && ReactInternals.ReactCurrentDispatcher) {
      // Force the dispatcher to be available
      if (!ReactInternals.ReactCurrentDispatcher.current) {
        console.warn('React dispatcher not available, attempting to fix...');
        // Store reference to window React if available
        if ((window as any).__REACT_INTERNALS__) {
          ReactInternals.ReactCurrentDispatcher = (window as any).__REACT_INTERNALS__.ReactCurrentDispatcher;
        }
      }
    }
  }
  
  return React.useState(true)[1]; // Return a setter to ensure hooks work
};