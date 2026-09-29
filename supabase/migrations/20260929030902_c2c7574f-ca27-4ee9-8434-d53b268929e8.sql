DO $$
DECLARE
  targets constant text[][] := ARRAY[
    ARRAY['clinilabs','Phlebotomy (Venous draw) at clinic'],
    ARRAY['lola-health','Biological Kit'],
    ARRAY['medichecks','Medichecks E-Gift Card'],
    ARRAY['randox','Flu Vaccine'],
    ARRAY['randox','HPV Vaccine - 1 dose']
  ];
  t text[];
  n integer;
BEGIN
  FOREACH t SLICE 1 IN ARRAY targets LOOP
    SELECT count(*) INTO n FROM public.provider_tests
      WHERE provider_id = t[1] AND test_name = t[2] AND is_active = true;
    IF n = 1 THEN
      UPDATE public.provider_tests SET is_active = false, updated_at = now()
        WHERE provider_id = t[1] AND test_name = t[2] AND is_active = true;
    ELSIF n = 0 THEN
      RAISE NOTICE 'No active row for % / % (already inactive, skipped)', t[1], t[2];
    ELSE
      RAISE EXCEPTION 'Expected exactly one active row for % / %, found %', t[1], t[2], n;
    END IF;
  END LOOP;
END $$;