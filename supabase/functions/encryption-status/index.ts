import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mirror of SENSITIVE_USER_PROFILE_FIELDS in encrypt-sensitive-data, scoped to
// columns that actually exist on user_profiles (text columns only).
const USER_PROFILE_TEXT_FIELDS = [
  "phone_number",
  "address_line1",
  "address_line2",
  "postal_code",
  "emergency_contact_name",
  "emergency_contact_phone",
];

// Encryption parameters — must match encrypt-sensitive-data exactly.
const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );
}

async function decryptField(encryptedText: string, secret: string): Promise<string> {
  if (!encryptedText.startsWith("enc:")) return encryptedText;
  const decoder = new TextDecoder();
  const binaryStr = atob(encryptedText.slice(4));
  const combined = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) combined[i] = binaryStr.charCodeAt(i);
  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);
  const key = await deriveKey(secret, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer,
  );
  // We discard the actual plaintext — we only care that decryption succeeded.
  decoder.decode(plaintext);
  return "ok";
}

async function fingerprint(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: isAdmin, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Service-role client for the audit (bypasses RLS — needed to count across users).
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // ---- Secret inspection ----
    const encryptionKey = Deno.env.get("ENCRYPTION_KEY") ?? null;
    const legacyKey = Deno.env.get("VITE_ENCRYPTION_KEY") ?? null;

    const secrets = {
      encryption_key_present: !!encryptionKey,
      legacy_vite_key_present: !!legacyKey,
      keys_match:
        encryptionKey && legacyKey ? encryptionKey === legacyKey : null,
      active_key_fingerprint: encryptionKey ? await fingerprint(encryptionKey) : null,
      legacy_key_fingerprint: legacyKey ? await fingerprint(legacyKey) : null,
    };

    // ---- PII audit on user_profiles ----
    const { data: profiles, error: profilesErr } = await admin
      .from("user_profiles")
      .select(
        `id, ${USER_PROFILE_TEXT_FIELDS.join(", ")}, date_of_birth`,
      );
    if (profilesErr) throw profilesErr;

    const totalRows = profiles?.length ?? 0;
    const piiAudit = USER_PROFILE_TEXT_FIELDS.map((column) => {
      let encrypted = 0;
      let plaintext = 0;
      let nulls = 0;
      for (const row of profiles ?? []) {
        const v = (row as Record<string, unknown>)[column];
        if (v === null || v === undefined || v === "") {
          nulls++;
        } else if (typeof v === "string" && v.startsWith("enc:")) {
          encrypted++;
        } else {
          plaintext++;
        }
      }
      return {
        table: "user_profiles",
        column,
        total_rows: totalRows,
        encrypted_rows: encrypted,
        plaintext_rows: plaintext,
        null_rows: nulls,
      };
    });

    // date_of_birth is a date column — can never store ciphertext. Report it for clarity.
    let dobSet = 0;
    for (const row of profiles ?? []) {
      if ((row as Record<string, unknown>).date_of_birth) dobSet++;
    }
    const dobNote = {
      table: "user_profiles",
      column: "date_of_birth",
      total_rows: totalRows,
      encrypted_rows: 0,
      plaintext_rows: dobSet,
      null_rows: totalRows - dobSet,
      note: "Date column — cannot store encrypted ciphertext. Schema-level limitation.",
    };

    // Sensitive fields declared in encrypt-sensitive-data but not present in schema
    const declaredButMissing = [
      "nhs_number",
      "health_conditions",
      "allergies",
      "medications",
      "date_of_birth (as text)",
    ];

    // ---- Decryption probe ----
    let decryption_probe: {
      attempted: boolean;
      sample_table: string | null;
      sample_column: string | null;
      success: boolean;
      error: string | null;
    } = {
      attempted: false,
      sample_table: null,
      sample_column: null,
      success: false,
      error: null,
    };

    if (encryptionKey) {
      let sampleCipher: string | null = null;
      let sampleColumn: string | null = null;
      for (const row of profiles ?? []) {
        for (const col of USER_PROFILE_TEXT_FIELDS) {
          const v = (row as Record<string, unknown>)[col];
          if (typeof v === "string" && v.startsWith("enc:")) {
            sampleCipher = v;
            sampleColumn = col;
            break;
          }
        }
        if (sampleCipher) break;
      }
      if (sampleCipher && sampleColumn) {
        decryption_probe.attempted = true;
        decryption_probe.sample_table = "user_profiles";
        decryption_probe.sample_column = sampleColumn;
        try {
          await decryptField(sampleCipher, encryptionKey);
          decryption_probe.success = true;
        } catch (e) {
          decryption_probe.success = false;
          decryption_probe.error = e instanceof Error ? e.message : "Decryption failed";
        }
      }
    }

    // ---- Rotation safety verdict ----
    const totalEncrypted = piiAudit.reduce((sum, c) => sum + c.encrypted_rows, 0);
    const totalPlaintext = piiAudit.reduce((sum, c) => sum + c.plaintext_rows, 0);

    let rotation_safety: "safe" | "data_at_risk" | "edge_function_broken";
    let verdict_reason: string;

    if (!encryptionKey) {
      rotation_safety = "edge_function_broken";
      verdict_reason =
        "ENCRYPTION_KEY is not set. The encrypt-sensitive-data edge function will fail on every call until you add it.";
    } else if (totalEncrypted === 0) {
      rotation_safety = "safe";
      verdict_reason =
        "No encrypted PII exists in the database. You can rotate to a freshly generated random key with zero data loss.";
    } else if (decryption_probe.attempted && !decryption_probe.success) {
      rotation_safety = "data_at_risk";
      verdict_reason = `${totalEncrypted} encrypted value(s) exist but the active ENCRYPTION_KEY cannot decrypt them. Restore the original key before rotating, or this data becomes unreadable.`;
    } else {
      rotation_safety = "data_at_risk";
      verdict_reason = `${totalEncrypted} encrypted value(s) are currently readable with the active key. Rotating the key will make this data unreadable unless you decrypt and re-encrypt first.`;
    }

    // Plaintext leakage warning (sensitive fields stored unencrypted)
    const plaintext_warning = totalPlaintext > 0
      ? `${totalPlaintext} sensitive value(s) are stored as plaintext, violating the validate_encrypted_fields trigger expectation.`
      : null;

    return new Response(
      JSON.stringify({
        secrets,
        pii_audit: [...piiAudit, dobNote],
        declared_but_missing_in_schema: declaredButMissing,
        decryption_probe,
        totals: {
          encrypted_rows: totalEncrypted,
          plaintext_rows: totalPlaintext,
          profiles_total: totalRows,
        },
        rotation_safety,
        verdict_reason,
        plaintext_warning,
        generated_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("encryption-status error:", error);
    return new Response(
      JSON.stringify({ error: "Encryption status check failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
