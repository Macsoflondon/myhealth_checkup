import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MFAVerificationResult {
  isAdmin: boolean;
  hasMFA: boolean;
  mfaVerified: boolean;
  requiresMFA: boolean;
  userId: string | null;
  message: string;
}

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: No authorization header',
          isAdmin: false,
          hasMFA: false,
          mfaVerified: false,
          requiresMFA: false,
          userId: null,
          message: 'Authentication required'
        } as MFAVerificationResult),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's token to verify identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: Invalid token',
          isAdmin: false,
          hasMFA: false,
          mfaVerified: false,
          requiresMFA: false,
          userId: null,
          message: 'Invalid authentication token'
        } as MFAVerificationResult),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role membership directly; has_role() is reserved for
    // contexts that should additionally enforce an AAL2 session.
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: adminRoleRow, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    const isAdmin = !!adminRoleRow;

    if (roleError) {
      console.error('Failed to check admin role:', roleError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to verify permissions',
          isAdmin: false,
          hasMFA: false,
          mfaVerified: false,
          requiresMFA: false,
          userId: user.id,
          message: 'Error checking admin status'
        } as MFAVerificationResult),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If not admin, no MFA check needed
    if (!isAdmin) {
      console.log(`User ${user.id} is not an admin`);
      return new Response(
        JSON.stringify({ 
          isAdmin: false,
          hasMFA: false,
          mfaVerified: false,
          requiresMFA: false,
          userId: user.id,
          message: 'User is not an admin'
        } as MFAVerificationResult),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For admins, check MFA status
    const { data: mfaFactors, error: mfaError } = await userClient.auth.mfa.listFactors();
    
    if (mfaError) {
      console.error('Failed to check MFA factors:', mfaError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to verify MFA status',
          isAdmin: true,
          hasMFA: false,
          mfaVerified: false,
          requiresMFA: true,
          userId: user.id,
          message: 'Error checking MFA status'
        } as MFAVerificationResult),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has any verified TOTP factors
    const verifiedTotpFactors = mfaFactors?.totp?.filter(f => f.status === 'verified') || [];
    const hasMFA = verifiedTotpFactors.length > 0;

    // Check the current session's AAL (Authenticator Assurance Level) directly
    // from the bearer token. In Edge Functions, createClient(...Authorization)
    // authenticates getUser()/listFactors(), but it does not persist a browser
    // session for auth.mfa.getAuthenticatorAssuranceLevel(), which caused the
    // admin UI to remain stuck on the MFA screen after a valid code.
    const tokenPayload = decodeJwtPayload(accessToken);
    const mfaVerified = tokenPayload?.aal === 'aal2';

    const result: MFAVerificationResult = {
      isAdmin: true,
      hasMFA,
      mfaVerified,
      requiresMFA: true, // Admins always require MFA for privileged operations
      userId: user.id,
      message: hasMFA 
        ? (mfaVerified 
            ? 'Admin verified with MFA' 
            : 'MFA verification required for this session')
        : 'MFA setup required for admin operations'
    };

    console.log(`Admin MFA check for ${user.id}: hasMFA=${hasMFA}, mfaVerified=${mfaVerified}`);

    // If admin doesn't have MFA set up or hasn't verified this session, return 403
    if (!hasMFA || !mfaVerified) {
      return new Response(
        JSON.stringify(result),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin is fully verified
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-admin-mfa function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        isAdmin: false,
        hasMFA: false,
        mfaVerified: false,
        requiresMFA: false,
        userId: null,
        message: 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
