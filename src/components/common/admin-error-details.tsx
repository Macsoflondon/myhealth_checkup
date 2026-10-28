import { useEffect, useState, type ReactNode } from "react";
import {
  subscribeToDiagnosticsAuthChanges,
  verifyErrorDiagnosticsAccess,
} from "@/services/error-diagnostics-access";

export const AdminErrorDetails = ({ children }: { children: ReactNode }) => {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const request = { version: 0, disposed: false };
    const check = () => {
      const version = ++request.version;
      setAllowed(false);
      // Do not call Supabase auth methods inside its auth-state callback.
      queueMicrotask(() => {
        if (request.disposed) return;
        void verifyErrorDiagnosticsAccess().then((verified) => {
          if (!request.disposed && request.version === version) setAllowed(verified);
        });
      });
    };
    const unsubscribe = subscribeToDiagnosticsAuthChanges(check);
    check();
    return () => {
      request.disposed = true;
      unsubscribe();
    };
  }, []);

  return allowed ? children : null;
};