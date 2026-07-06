import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const jsonHeaders = { "Content-Type": "application/json" };

type VaultSecretRow = {
  id: string;
  name: string;
  description: string | null;
  key_id: string | null;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY") ?? "";
  const presentedKey = req.headers.get("x-lovable-api-key") ?? "";

  if (!lovableApiKey || presentedKey !== lovableApiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const databaseUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";

  if (!serviceRoleKey || !databaseUrl) {
    return new Response(JSON.stringify({ error: "Missing Supabase runtime secrets" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const client = new Client(databaseUrl);

  try {
    await client.connect();
    const secrets = await client.queryObject<VaultSecretRow>(
      `SELECT id::text, name, description, key_id::text
       FROM vault.secrets
       WHERE name = $1
       LIMIT 1`,
      ["service_role_key"],
    );

    if (secrets.rows.length > 0) {
      const [secret] = secrets.rows;
      await client.queryObject(
        `SELECT vault.update_secret($1::uuid, $2::text, $3::text, $4::text, $5::uuid)`,
        [
          secret.id,
          serviceRoleKey,
          "service_role_key",
          secret.description ?? "Synced from Edge runtime SUPABASE_SERVICE_ROLE_KEY",
          secret.key_id,
        ],
      );

      return new Response(JSON.stringify({ ok: true, action: "updated" }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    await client.queryObject(
      `SELECT vault.create_secret($1::text, $2::text, $3::text, NULL::uuid)`,
      [serviceRoleKey, "service_role_key", "Synced from Edge runtime SUPABASE_SERVICE_ROLE_KEY"],
    );

    return new Response(JSON.stringify({ ok: true, action: "created" }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 500,
      headers: jsonHeaders,
    });
  } finally {
    try {
      await client.end();
    } catch {
      // noop
    }
  }
});