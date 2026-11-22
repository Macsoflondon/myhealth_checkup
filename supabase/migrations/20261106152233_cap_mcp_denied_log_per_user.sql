CREATE OR REPLACE FUNCTION public.mcp_log_denied_tool_call(p_tool text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tool text := left(coalesce(p_tool, 'unknown'), 100);
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  IF p_tool IS NULL OR p_tool !~ '^[a-z_]{1,60}$' THEN
    v_tool := 'unknown';
  END IF;
  -- One row per tool per 10 minutes, and at most 20 denied-call rows per
  -- user per hour, so a signed-in non-admin cannot flood the admin log by
  -- varying the tool name.
  IF EXISTS (
    SELECT 1 FROM public.admin_activity_log
    WHERE admin_user_id = auth.uid()
      AND action = 'mcp.denied'
      AND resource_name = v_tool
      AND created_at > now() - interval '10 minutes'
  ) OR (
    SELECT count(*) FROM public.admin_activity_log
    WHERE admin_user_id = auth.uid()
      AND action = 'mcp.denied'
      AND created_at > now() - interval '1 hour'
  ) >= 20 THEN
    RETURN;
  END IF;
  INSERT INTO public.admin_activity_log
    (admin_user_id, action, resource_type, resource_name, new_value, success, error_message)
  VALUES
    (auth.uid(), 'mcp.denied', 'mcp_tool', v_tool,
     jsonb_build_object('via', 'mcp'), false, 'Caller lacks admin role');
END;
$function$;

REVOKE ALL ON FUNCTION public.mcp_log_denied_tool_call(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_log_denied_tool_call(text) TO authenticated, service_role;

COMMENT ON FUNCTION public.admin_price_sync_status() IS 'Intentionally callable by authenticated; guarded by has_role(admin) which requires aal2.';
COMMENT ON FUNCTION public.admin_request_price_sync(text) IS 'Intentionally callable by authenticated; guarded by has_role(admin) which requires aal2.';
COMMENT ON FUNCTION public.os_plugin_secret_status() IS 'Intentionally callable by authenticated; guarded by has_role(admin) which requires aal2.';
COMMENT ON FUNCTION public.os_set_plugin_secret(text, text, text) IS 'Intentionally callable by authenticated; guarded by has_role(admin) which requires aal2.';
