
delete from public.provider_tests
where provider_id = 'goodbody-clinic'
  and test_name in (
    'Blood Draw Appointment',
    'GP Consultation',
    'Oncologist Consultation',
    'Ear Wax Microsuction - book in your nearest clinic'
  );
