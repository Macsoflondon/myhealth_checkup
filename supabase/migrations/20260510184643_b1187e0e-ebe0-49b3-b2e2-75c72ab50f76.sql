UPDATE public.provider_tests
SET turnaround_days_text = 'Typically 2 working days',
    base_price = CASE WHEN price > 35 THEN price - 35 ELSE price END,
    collection_options = '[
      {"method":"In-clinic phlebotomy","price_modifier":35,"note":"+£35"},
      {"method":"At-home phlebotomy","price_modifier":35,"note":"+£35"},
      {"method":"Self-arranged phlebotomist","price_modifier":0,"note":"Free"}
    ]'::jsonb
WHERE provider_id = 'lola-health' AND is_popular = true;

UPDATE public.provider_tests SET turnaround_days_text = 'Typically 3–5 working days'
  WHERE id IN ('38d56339-a139-4a70-b222-b533cd6a59fc','43aaf7fe-8786-4ad5-89ac-a300c00e9de5','bdf88d6f-5e7d-497d-9a94-54b253a96af4');

UPDATE public.provider_tests SET turnaround_days_text = 'Typically 12 working days'
  WHERE id = '48a3de7e-5718-4da8-9b0e-45c5e938b54f';

UPDATE public.provider_tests SET turnaround_days_text = 'Typically 5–7 working days'
  WHERE id = '544772f2-0bf1-41ec-b4dd-4c4c4f2c6db2';

UPDATE public.provider_tests SET turnaround_days_text = 'Typically 2–3 working days'
  WHERE provider_id IN ('medichecks','randox') AND is_popular = true;