// Shared audit-logging helper for protected edge functions.
// Writes to public.protected_call_log via the service role (bypasses RLS).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

export type ProtectedCallStatus = 'allowed' | 'denied' | 'error';

export interface LogProtectedCallArgs {
  functionName: string;
  status: ProtectedCallStatus;
  req?: Request;
  callerId?: string | null;
  details?: Record<string, unknown>;
}

let _client: ReturnType<typeof createClient> | null = null;
function client() {
  if (_client) return _client;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}

export async function logProtectedCall(args: LogProtectedCallArgs): Promise<void> {
  try {
    const c = client();
    if (!c) return;
    const ip =
      args.req?.headers.get('cf-connecting-ip') ??
      args.req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null;
    const ua = args.req?.headers.get('user-agent') ?? null;
    await c.from('protected_call_log').insert({
      caller_id: args.callerId ?? null,
      function_name: args.functionName,
      status: args.status,
      ip_address: ip,
      user_agent: ua,
      details: args.details ?? null,
    });
  } catch (e) {
    // Never let audit failures break the function
    console.error('logProtectedCall failed:', e instanceof Error ? e.message : String(e));
  }
}
