
delete from public.provider_tests
where provider_id = 'london-health-company' and is_active = true
  and test_name in (
    'Early Pregnancy Blood Test | Accurate Beta HCG Blood Testing',
    'Ultimate Comprehensive Male Hormone Panel (8 Biomarkers)'
  );
