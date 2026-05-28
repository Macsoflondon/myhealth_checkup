-- Update provider_tests for Goodbody and Medichecks
UPDATE public.provider_tests
SET 
    test_name = 'Advanced Well Man',
    description = 'This comprehensive test evaluates various biomarkers in the blood, providing insights into areas such as hormonal levels, cholesterol levels, and overall organ function.',
    image_url = 'https://37e227e1-0d67-4515-b064-99c243036534.lovableproject.com/lovable-uploads/b1fd9c18-e8ab-4e66-9b37-aa91aac93b18.png'
WHERE 
    (test_name ILIKE '%Advanced Well Woman%' OR description ILIKE '%Advanced Well Woman%')
    AND provider_id IN ('goodbody-clinic', 'medichecks');
