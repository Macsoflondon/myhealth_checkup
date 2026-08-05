import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type OAuthClient = { name?: string; client_uri?: string; logo_uri?: string };

type AuthorizationDetails = {
  authorization_id: string;
  client: OAuthClient;
  redirect_uri?: string;
  scope?: string;
};

type OAuthRedirect = { redirect_url: string };

type OAuthNs = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | OAuthRedirect | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
    options?: { skipBrowserRedirect?: boolean },
  ) => Promise<{ data: OAuthRedirect | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
    options?: { skipBrowserRedirect?: boolean },
  ) => Promise<{ data: OAuthRedirect | null; error: { message: string } | null }>;
};

type FailureKind = "missing_id" | "unsupported_sdk" | "expired" | "unexpected";

type Failure = { kind: FailureKind; message: string };

const EXPIRED_HINTS = [
  "expired",
  "not found",
  "no rows",
  "invalid authorization",
  "already",
  "consumed",
];

const isExpiredLike = (message: string) =>
  EXPIRED_HINTS.some((hint) => message.toLowerCase().includes(hint));

const getOAuthNamespace = (): OAuthNs | null => {
  const ns = (supabase.auth as unknown as { oauth?: Partial<OAuthNs> }).oauth;
  if (
    ns &&
    typeof ns.getAuthorizationDetails === "function" &&
    typeof ns.approveAuthorization === "function" &&
    typeof ns.denyAuthorization === "function"
  ) {
    return ns as OAuthNs;
  }
  return null;
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setFailure(null);
      setDetails(null);

      if (!authorizationId) {
        setFailure({ kind: "missing_id", message: "This link is missing an authorization_id." });
        return;
      }

      const oauth = getOAuthNamespace();
      if (!oauth) {
        setFailure({
          kind: "unsupported_sdk",
          message:
            "This browser loaded an outdated version of the app that cannot complete OAuth consent. Please hard-refresh the page.",
        });
        return;
      }

      try {
        // Ensure the session is hydrated (handles a cold load / restored session).
        let { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          sessionData = { session: refreshed.session };
        }
        if (!active) return;

        if (!sessionData.session) {
          const next = window.location.pathname + window.location.search;
          window.location.replace("/auth?next=" + encodeURIComponent(next));
          return;
        }

        const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
        if (!active) return;

        if (error) {
          setFailure({
            kind: isExpiredLike(error.message) ? "expired" : "unexpected",
            message: error.message,
          });
          return;
        }

        if (!data) {
          setFailure({ kind: "expired", message: "This authorization request no longer exists." });
          return;
        }

        if (!("authorization_id" in data)) {
          // Already consented — go straight back to the client.
          window.location.href = data.redirect_url;
          return;
        }

        setDetails(data);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unexpected error loading this request.";
        setFailure({
          kind: isExpiredLike(message) ? "expired" : "unexpected",
          message,
        });
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [authorizationId, attempt]);

  const decide = useCallback(
    async (approve: boolean) => {
      setBusy(true);
      const oauth = getOAuthNamespace();
      if (!oauth) {
        setBusy(false);
        setFailure({
          kind: "unsupported_sdk",
          message: "The OAuth client library is unavailable. Please hard-refresh the page.",
        });
        return;
      }
      try {
        const { data, error } = approve
          ? await oauth.approveAuthorization(authorizationId, { skipBrowserRedirect: true })
          : await oauth.denyAuthorization(authorizationId, { skipBrowserRedirect: true });

        if (error) {
          setBusy(false);
          setFailure({
            kind: isExpiredLike(error.message) ? "expired" : "unexpected",
            message: error.message,
          });
          return;
        }
        if (!data?.redirect_url) {
          setBusy(false);
          setFailure({
            kind: "unexpected",
            message: "No redirect was returned by the authorization server.",
          });
          return;
        }
        window.location.href = data.redirect_url;
      } catch (err) {
        setBusy(false);
        setFailure({
          kind: "unexpected",
          message: err instanceof Error ? err.message : "Unexpected error completing this request.",
        });
      }
    },
    [authorizationId],
  );

  if (failure) {
    const heading =
      failure.kind === "expired"
        ? "This connection request has timed out"
        : failure.kind === "missing_id"
          ? "This link is incomplete"
          : failure.kind === "unsupported_sdk"
            ? "This page needs to be refreshed"
            : "Could not load this authorization request";

    const body =
      failure.kind === "expired"
        ? "Connection requests are only valid for ten minutes, and each one can be used once. This one has either expired or already been used. Please start the connection again from the app you were connecting."
        : failure.kind === "missing_id"
          ? "The authorisation reference is missing from this URL. Please start the connection again from the app you were connecting."
          : failure.message;

    return (
      <main className="min-h-screen bg-[#081129] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <h1 className="text-xl font-semibold">{heading}</h1>
          <p className="text-white/90 text-sm">{body}</p>
          {failure.kind !== "missing_id" && failure.kind !== "expired" && (
            <p className="text-white/78 text-xs break-words">Details: {failure.message}</p>
          )}
          <div className="flex gap-3 pt-2">
            {authorizationId && failure.kind !== "expired" && (
              <Button
                onClick={() => setAttempt((n) => n + 1)}
                className="bg-[#22c0d4] hover:bg-[#1ba9bc] text-[#081129]"
              >
                Try again
              </Button>
            )}
            <Button
              onClick={() => window.location.assign("/")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Start again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen bg-[#081129] text-white flex items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "An application";
  const scopes = (details.scope ?? "").split(" ").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#081129] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">
          Connect {clientName} to your myhealth checkup account
        </h1>
        <p className="text-white/90 text-sm">
          {clientName} is requesting access to act on your behalf. It will be able to search the
          test catalogue and read or update your saved tests as you.
        </p>
        {scopes.length > 0 && (
          <ul className="text-white/90 text-xs list-disc pl-5 space-y-1">
            {scopes.map((scope) => (
              <li key={scope}>{scope}</li>
            ))}
          </ul>
        )}
        <p className="text-white/78 text-xs">
          You can revoke access at any time from your account settings.
        </p>
        <div className="flex gap-3 pt-2">
          <Button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 bg-[#22c0d4] hover:bg-[#1ba9bc] text-[#081129]"
          >
            Approve
          </Button>
          <Button
            disabled={busy}
            onClick={() => decide(false)}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Deny
          </Button>
        </div>
      </div>
    </main>
  );
}
