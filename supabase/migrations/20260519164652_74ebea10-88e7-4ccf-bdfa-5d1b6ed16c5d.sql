DROP VIEW IF EXISTS public.provider_image_audit_latest;
CREATE VIEW public.provider_image_audit_latest
WITH (security_invoker = true) AS
WITH latest AS (
  SELECT run_id FROM public.provider_image_audit ORDER BY checked_at DESC LIMIT 1
)
SELECT
  a.provider_id,
  a.category,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE a.status = 'ok')          AS ok,
  COUNT(*) FILTER (WHERE a.status = 'missing')     AS missing,
  COUNT(*) FILTER (WHERE a.status = 'placeholder') AS placeholder,
  COUNT(*) FILTER (WHERE a.status = 'unreachable') AS unreachable,
  COUNT(*) FILTER (WHERE a.status = 'wrong_type')  AS wrong_type,
  COUNT(*) FILTER (WHERE a.status = 'wrong_host')  AS wrong_host,
  ROUND(100.0 * COUNT(*) FILTER (WHERE a.status = 'ok') / NULLIF(COUNT(*), 0), 1) AS pct_ok,
  MAX(a.checked_at) AS checked_at
FROM public.provider_image_audit a
JOIN latest l ON l.run_id = a.run_id
GROUP BY a.provider_id, a.category
ORDER BY a.provider_id, a.category;