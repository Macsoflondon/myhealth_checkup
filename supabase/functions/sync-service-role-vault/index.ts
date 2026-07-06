import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const jsonHeaders = { "Content-Type": "application/json" };

type VaultSecretRow = {
  id: string;
  name: string;
  description: string | null;
  key_id: string | null;
};

type TriggeredFunction = {
  provider: string;
  functionName: string;
  requestId: string;
};

type HttpResponseRow = {
  id: string;
  status_code: number | null;
  content: string | null;
  timed_out: boolean | null;
  error_msg: string | null;
};

const scraperTargets = [
  { provider: "clinilabs", functionName: "clinilabs-scraper" },
  { provider: "medichecks", functionName: "medichecks-firecrawl" },
  { provider: "lola-health", functionName: "lola-health-scraper" },
] as const;

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

      const triggered: TriggeredFunction[] = [];
      for (const target of scraperTargets) {
        const result = await client.queryObject<{ request_id: string }>(
          `SELECT public.call_edge_with_service_role($1::text, '{}'::jsonb)::text AS request_id`,
          [`https://clvuioagsgfadynuvodj.supabase.co/functions/v1/${target.functionName}`],
        );
        triggered.push({
          provider: target.provider,
          functionName: target.functionName,
          requestId: result.rows[0]?.request_id ?? "",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 6000));
      const responseIds = triggered.map((trigger) => trigger.requestId).filter((id) => id.length > 0);
      const responses = responseIds.length > 0
        ? await client.queryObject<HttpResponseRow>(
          `SELECT id::text, status_code, content, timed_out, error_msg
           FROM net._http_response
           WHERE id = ANY($1::bigint[])
           ORDER BY created DESC`,
          [responseIds],
        )
        : { rows: [] };

      return new Response(JSON.stringify({
        ok: true,
        action: "updated",
        triggered,
        responses: responses.rows,
      }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    await client.queryObject(
      `SELECT vault.create_secret($1::text, $2::text, $3::text, NULL::uuid)`,
      [serviceRoleKey, "service_role_key", "Synced from Edge runtime SUPABASE_SERVICE_ROLE_KEY"],
    );

    const triggered: TriggeredFunction[] = [];
    for (const target of scraperTargets) {
      const result = await client.queryObject<{ request_id: string }>(
        `SELECT public.call_edge_with_service_role($1::text, '{}'::jsonb)::text AS request_id`,
        [`https://clvuioagsgfadynuvodj.supabase.co/functions/v1/${target.functionName}`],
      );
      triggered.push({
        provider: target.provider,
        functionName: target.functionName,
        requestId: result.rows[0]?.request_id ?? "",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 6000));
    const responseIds = triggered.map((trigger) => trigger.requestId).filter((id) => id.length > 0);
    const responses = responseIds.length > 0
      ? await client.queryObject<HttpResponseRow>(
        `SELECT id::text, status_code, content, timed_out, error_msg
         FROM net._http_response
         WHERE id = ANY($1::bigint[])
         ORDER BY created DESC`,
        [responseIds],
      )
      : { rows: [] };

    return new Response(JSON.stringify({ ok: true, action: "created", triggered, responses: responses.rows }), {
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