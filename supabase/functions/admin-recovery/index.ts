import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Constant-time string comparison to prevent timing attacks
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const expected = Deno.env.get('ADMIN_RECOVERY_SECRET');
    if (!expected) {
      return new Response(JSON.stringify({ error: 'Recovery not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { secret, email, newPassword } = body ?? {};

    if (typeof secret !== 'string' || typeof email !== 'string' || typeof newPassword !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!safeEqual(secret, expected)) {
      // Log denial for monitoring
      console.warn('admin-recovery: invalid secret attempt', { email, ip: req.headers.get('x-forwarded-for') });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (newPassword.length < 12) {
      return new Response(JSON.stringify({ error: 'Password must be at least 12 characters' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find user by email
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;
    const user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Reset password + confirm email
    const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
      password: newPassword,
      email_confirm: true,
    });
    if (updErr) throw updErr;

    // Unenroll all MFA factors so the user can sign in and re-enroll
    const { data: factorsData } = await admin.auth.admin.mfa.listFactors({ userId: user.id });
    const factors = factorsData?.factors ?? [];
    for (const f of factors) {
      await admin.auth.admin.mfa.deleteFactor({ userId: user.id, id: f.id });
    }

    // Ensure admin role granted
    const { error: roleErr } = await admin
      .from('user_roles')
      .upsert({ user_id: user.id, role: 'admin' }, { onConflict: 'user_id,role' });
    if (roleErr) console.error('admin-recovery: role upsert failed', roleErr);

    console.log('admin-recovery: success', { userId: user.id, email, factorsCleared: factors.length });

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset, MFA factors cleared, admin role ensured.',
      factorsCleared: factors.length,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('admin-recovery error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
