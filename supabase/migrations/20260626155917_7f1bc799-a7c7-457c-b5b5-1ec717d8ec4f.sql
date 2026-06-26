
-- categories_set_path: only reads public data, INVOKER is fine
CREATE OR REPLACE FUNCTION public.categories_set_path()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  parent_path ltree;
  parent_level integer;
  safe_slug text;
BEGIN
  safe_slug := regexp_replace(lower(NEW.slug), '[^a-z0-9_]+', '_', 'g');
  IF NEW.parent_id IS NULL THEN
    NEW.level := 0;
    NEW.path := safe_slug::ltree;
  ELSE
    SELECT path, level INTO parent_path, parent_level
    FROM public.categories WHERE id = NEW.parent_id;
    IF parent_path IS NULL THEN
      RAISE EXCEPTION 'Parent category % has no path', NEW.parent_id;
    END IF;
    NEW.level := parent_level + 1;
    NEW.path := parent_path || safe_slug::ltree;
  END IF;
  RETURN NEW;
END;
$$;

-- resolve_categories_for_text: only reads public aliases, INVOKER is fine
CREATE OR REPLACE FUNCTION public.resolve_categories_for_text(_text text)
RETURNS uuid[]
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result uuid[] := '{}'::uuid[];
  lower_text text;
BEGIN
  IF _text IS NULL OR _text = '' THEN RETURN result; END IF;
  lower_text := lower(_text);

  SELECT COALESCE(array_agg(DISTINCT category_id), '{}'::uuid[]) INTO result
  FROM public.category_aliases
  WHERE (match_type = 'exact'    AND lower(alias) = lower_text)
     OR (match_type = 'contains' AND lower_text LIKE '%' || lower(alias) || '%')
     OR (match_type = 'regex'    AND lower_text ~ alias);

  RETURN result;
END;
$$;

-- sync_provider_test_categories stays DEFINER (must update provider_tests) but
-- the trigger runs it; lock down direct EXECUTE to service_role only.
REVOKE EXECUTE ON FUNCTION public.sync_provider_test_categories() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_provider_test_categories() TO service_role;
