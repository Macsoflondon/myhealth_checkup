import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Narrow local typing for the beta supabase.auth.oauth namespace.
type OAuthNs = {
  getAuthorizationDetails: (id: string) => Promise<{
    data: {
      client?: { name?: string; client_uri?: string };
      redirect_url?: string;
      redirect_to?: string;
      scopes?: string[];
    } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  denyAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<{
    client?: { name?: string; client_uri?: string };
    scopes?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const oauth = (supabase.auth as unknown as { oauth: OAuthNs }).oauth;
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const oauth = (supabase.auth as unknown as { oauth: OAuthNs }).oauth;
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#081129] text-white flex items-center justify-center p-6">
        <div className="max-w-md bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Could not load this authorization request</h1>
          <p className="text-white/80 text-sm">{error}</p>
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

  return (
    <main className="min-h-screen bg-[#081129] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">
          Connect {clientName} to your myhealth checkup account
        </h1>
        <p className="text-white/80 text-sm">
          {clientName} is requesting access to act on your behalf. It will be able to search
          the test catalogue and read or update your saved tests as you.
        </p>
        <p className="text-white/60 text-xs">
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
