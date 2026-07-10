CREATE OR REPLACE FUNCTION public.call_edge_with_service_role(p_url text, p_body jsonb DEFAULT '{}'::jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'vault'
AS $function$
declare
  v_key text;
  v_request_id bigint;
begin
  select decrypted_secret
    into v_key
  from vault.decrypted_secrets
  where name = 'service_role_key'
  limit 1;

  if v_key is null or length(v_key) = 0 then
    raise exception 'Missing Vault secret: service_role_key';
  end if;

  select net.http_post(
    url := p_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', v_key,
      'Authorization', 'Bearer ' || v_key
    ),
    body := coalesce(p_body, '{}'::jsonb),
    timeout_milliseconds := 120000
  )
  into v_request_id;

  return v_request_id;
end;
$function$;