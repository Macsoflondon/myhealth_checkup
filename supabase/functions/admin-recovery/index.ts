import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TOKEN_TTL_MINUTES = 15;
const MIN_PASSWORD_LENGTH = 12;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

/** SHA-256 hex digest — recovery tokens are only ever stored hashed. */
const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const generateToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const clientIp = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

const serviceClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

/** Resolve an auth user by email using paged admin listing. */
const findUserByEmail = async (
  admin: ReturnType<typeof serviceClient>,
  email: string,
): Promise<{ id: string; email: string } | null> => {
  const target = email.trim().toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match?.email) return { id: match.id, email: match.email };
    if (data.users.length < 200) break;
  }
  return null;
};

const isAdmin = async (
  admin: ReturnType<typeof serviceClient>,
  userId: string,
): Promise<boolean> => {
  const { data, error } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
};

/**
 * ISSUE — an already-signed-in admin (AAL2) mints a short-lived, single-use
 * recovery token for another existing admin account. Returned exactly once so
 * it can be handed over out of band.
 */
const handleIssue = async (req: Request, body: Record<string, unknown>) => {
  const authHeader = req.headers.get('Authorization') ?? '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return json({ error: 'Authentication required' }, 401);

  const admin = serviceClient();

  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  const caller = userData?.user;
  if (userErr || !caller) return json({ error: 'Authentication required' }, 401);

  // Require an admin caller who has completed a second factor.
  const aal = (caller.app_metadata as Record<string, unknown> | null)?.aal
    ?? (caller as unknown as { aal?: string }).aal;
  if (!(await isAdmin(admin, caller.id))) {
    console.warn('admin-recovery: non-admin issue attempt', { userId: caller.id, ip: clientIp(req) });
    return json({ error: 'Admin role required' }, 403);
  }
  if (aal && aal !== 'aal2') {
    return json({ error: 'Multi-factor authentication required to issue recovery tokens' }, 403);
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'A valid target email is required' }, 400);
  }

  const target = await findUserByEmail(admin, email);
  if (!target) return json({ error: 'No account found for that email' }, 404);

  // Recovery restores access for existing admins; it never escalates privilege.
  if (!(await isAdmin(admin, target.id))) {
    return json({ error: 'Target account does not hold the admin role' }, 403);
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000).toISOString();

  // Invalidate any outstanding tokens for this account before minting a new one.
  await admin
    .from('admin_recovery_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('target_user_id', target.id)
    .is('used_at', null);

  const { error: insertErr } = await admin.from('admin_recovery_tokens').insert({
    token_hash: await sha256Hex(token),
    target_user_id: target.id,
    target_email: target.email,
    issued_by: caller.id,
    expires_at: expiresAt,
  });
  if (insertErr) throw insertErr;

  console.log('admin-recovery: token issued', {
    issuedBy: caller.id,
    targetUserId: target.id,
    expiresAt,
    ip: clientIp(req),
  });

  return json({ success: true, token, expiresAt, expiresInMinutes: TOKEN_TTL_MINUTES });
};

/**
 * REDEEM — consumes a single-use token to reset the password and clear MFA for
 * the exact account the token was minted for. No role changes occur here.
 */
const handleRedeem = async (req: Request, body: Record<string, unknown>) => {
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  if (!token || !email || !newPassword) return json({ error: 'Invalid payload' }, 400);
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, 400);
  }

  const admin = serviceClient();
  const nowIso = new Date().toISOString();

  const { data: record, error: lookupErr } = await admin
    .from('admin_recovery_tokens')
    .select('id, target_user_id, target_email, expires_at, used_at')
    .eq('token_hash', await sha256Hex(token))
    .maybeSingle();
  if (lookupErr) throw lookupErr;

  const invalid =
    !record ||
    record.used_at !== null ||
    new Date(record.expires_at).getTime() <= Date.now() ||
    record.target_email.toLowerCase() !== email.toLowerCase();

  if (invalid) {
    console.warn('admin-recovery: invalid redeem attempt', { email, ip: clientIp(req) });
    return json({ error: 'Recovery token is invalid, expired or already used' }, 401);
  }

  // Burn the token first so a concurrent replay cannot reuse it.
  const { data: burned, error: burnErr } = await admin
    .from('admin_recovery_tokens')
    .update({ used_at: nowIso, redeemed_ip: clientIp(req) })
    .eq('id', record.id)
    .is('used_at', null)
    .select('id')
    .maybeSingle();
  if (burnErr) throw burnErr;
  if (!burned) return json({ error: 'Recovery token is invalid, expired or already used' }, 401);

  // Defence in depth: the account must still be an admin at redemption time.
  if (!(await isAdmin(admin, record.target_user_id))) {
    return json({ error: 'Target account does not hold the admin role' }, 403);
  }

  const { error: updErr } = await admin.auth.admin.updateUserById(record.target_user_id, {
    password: newPassword,
    email_confirm: true,
  });
  if (updErr) throw updErr;

  const { data: factorsData } = await admin.auth.admin.mfa.listFactors({
    userId: record.target_user_id,
  });
  const factors = factorsData?.factors ?? [];
  for (const factor of factors) {
    await admin.auth.admin.mfa.deleteFactor({ userId: record.target_user_id, id: factor.id });
  }

  console.log('admin-recovery: token redeemed', {
    tokenId: record.id,
    targetUserId: record.target_user_id,
    factorsCleared: factors.length,
    ip: clientIp(req),
  });

  return json({
    success: true,
    message: 'Password reset and MFA factors cleared. Re-enrol MFA after signing in.',
    factorsCleared: factors.length,
  });
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const action = typeof body.action === 'string' ? body.action : '';

    if (action === 'issue') return await handleIssue(req, body);
    if (action === 'redeem') return await handleRedeem(req, body);

    return json({ error: 'Unknown action. Expected "issue" or "redeem".' }, 400);
  } catch (err) {
    console.error('admin-recovery error:', err);
    return json({ error: 'Internal error' }, 500);
  }
});
