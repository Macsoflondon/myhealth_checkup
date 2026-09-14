
UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id IN (
  '6872dffd-3086-48a8-9a51-851272a9744b', -- Deposit 100
  'e27efbe4-f885-446f-a32f-2e5a6587bf04', -- Deposit 50
  '9bdaeb91-01e6-4c75-a20b-da9b9a31a856'  -- Vitamin B12 shots
);
