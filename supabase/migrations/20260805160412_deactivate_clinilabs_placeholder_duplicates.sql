UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id IN (
  '11b1a546-f61a-42de-be80-1c004db115b5',
  '9146ec7f-28b8-42f4-b584-0ef0d7f64e2c',
  'ffd6b34b-2b38-408e-b426-79d61a85c758',
  'fea8b2fb-a54d-4bdc-a0d7-b991f09edb92',
  'de9a6072-8aa9-4aef-82d7-efff92869d01',
  '298b4f44-227d-49db-ab50-528bc2f0a635',
  'fb01ee60-f4dd-4916-aeb8-8704d7e5e4d4',
  'bf2c1aec-e714-4ed0-869e-2546fe92f806',
  '247fe553-581e-4661-9e23-e6ba328712a3',
  'e659e181-b36d-4056-8733-dd8ad5d48bec',
  '0765c084-4e43-4544-8c6e-956038354cba',
  '68b325d9-1972-4af0-bf18-033fa66ac000',
  '51ac2f15-1e3a-4f87-85ae-624418a1d81a',
  'f57c5424-f6b4-43a1-a024-d4ed61d04507',
  'a53c84c0-a9e6-4924-a06e-b6b9df1d2e46',
  '55d39926-5b81-41b4-985e-bcdeee05178d',
  '0e11a8d5-895d-491c-af36-d4c2b0efa994',
  '8795f797-a90a-48f5-98e0-c547153fa224',
  '3268db69-8851-42dc-98d4-a07e5c5328cf'
);