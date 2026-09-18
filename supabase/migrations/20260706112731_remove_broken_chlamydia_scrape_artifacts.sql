
delete from public.provider_tests
where provider_id = 'medical-diagnosis'
  and url in (
    'https://www.medical-diagnosis.co.uk/exam/all-tests/chlamydia-trachomatis-neisseria-gonorrhoea-pcr-trichomonas-vaginalis-pcr/',
    'https://www.medical-diagnosis.co.uk/exam/all-tests/chlamydia-trachomatis-pcr/'
  );
