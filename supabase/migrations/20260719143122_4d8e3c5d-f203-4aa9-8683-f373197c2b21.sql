CREATE OR REPLACE FUNCTION public.validate_live_comparison_panel_rows()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_catalog'
AS $$
DECLARE
  row_item jsonb;
  method_value text;
  first_method text := NULL;
  provider_key text;
  provider_keys text[] := '{}';
  forbidden_text text;
BEGIN
  IF jsonb_typeof(NEW.rows) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'live_comparison_panels.rows must be a JSON array';
  END IF;

  FOR row_item IN SELECT value FROM jsonb_array_elements(NEW.rows)
  LOOP
    method_value := row_item->>'method';

    IF method_value NOT IN ('at_home', 'clinic') THEN
      RAISE EXCEPTION 'live comparison rows must use method at_home or clinic';
    END IF;

    IF first_method IS NULL THEN
      first_method := method_value;
    ELSIF method_value <> first_method THEN
      RAISE EXCEPTION 'live comparison panels cannot mix at-home and in-clinic rows';
    END IF;

    provider_key := lower(btrim(coalesce(row_item->>'providerId', row_item->>'name', '')));
    IF provider_key = '' THEN
      RAISE EXCEPTION 'live comparison rows require a provider id or provider name';
    END IF;

    IF provider_key = ANY(provider_keys) THEN
      RAISE EXCEPTION 'live comparison panels cannot contain duplicate provider rows: %', provider_key;
    END IF;
    provider_keys := array_append(provider_keys, provider_key);

    forbidden_text := lower(concat_ws(' ',
      row_item->>'name',
      row_item->>'bio',
      row_item->>'badge',
      row_item->>'methodLabel',
      row_item->>'method'
    ));

    IF forbidden_text LIKE '%walk-in%' OR forbidden_text LIKE '%walk in%' OR forbidden_text LIKE '%clinic-based%' THEN
      RAISE EXCEPTION 'live comparison rows cannot use walk-in or clinic-based wording';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_live_comparison_panel_rows_trigger ON public.live_comparison_panels;
CREATE TRIGGER validate_live_comparison_panel_rows_trigger
  BEFORE INSERT OR UPDATE OF rows ON public.live_comparison_panels
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_live_comparison_panel_rows();