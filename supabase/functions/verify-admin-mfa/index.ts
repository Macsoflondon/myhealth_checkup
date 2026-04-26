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

    // Check admin role using service role client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: isAdmin, error: roleError } = await adminClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

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

    // Check the current session's AAL (Authenticator Assurance Level)
    const { data: aalData, error: aalError } = await userClient.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (aalError) {
      console.error('Failed to check AAL:', aalError);
    }

    // AAL2 means the user has verified with MFA in this session
    const mfaVerified = aalData?.currentLevel === 'aal2';

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
        error: (error instanceof Error ? error.message : String(error)),
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
