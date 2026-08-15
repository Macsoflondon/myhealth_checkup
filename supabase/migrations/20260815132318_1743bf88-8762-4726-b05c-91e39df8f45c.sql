CREATE OR REPLACE FUNCTION public.call_edge_with_automations(p_url text, p_body jsonb DEFAULT '{}'::jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO 'public', 'vault'
AS $function$
declare
  v_key text;
  v_request_id bigint;
begin
  if p_url is null or p_url !~ '^https://[a-z0-9-]+\.(supabase\.co|functions\.supabase\.co)/' then
    raise exception 'Refusing to send automation credentials to untrusted URL';
  end if;

  select decrypted_secret
    into v_key
  from vault.decrypted_secrets
  where name = 'automations_apikey'
  limit 1;

  if v_key is null or length(v_key) = 0 then
    raise exception 'Missing Vault secret: automations_apikey';
  end if;

  select net.http_post(
    url := p_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', v_key,
      'Authorization', 'Bearer ' || v_key,
      'x-api-key', v_key,
      'x-automation-key', v_key,
      'x-cron-key', v_key,
      'x-cron-secret', v_key
    ),
    body := coalesce(p_body, '{}'::jsonb)
  )
  into v_request_id;

  return v_request_id;
end;
$function$;

REVOKE ALL ON FUNCTION public.call_edge_with_automations(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.call_edge_with_automations(text, jsonb) TO postgres;