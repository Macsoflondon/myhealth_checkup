
-- Create a validation trigger that ensures sensitive fields are encrypted before storage
-- This prevents plaintext PII from being stored if the application layer encryption is bypassed

CREATE OR REPLACE FUNCTION public.validate_encrypted_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sensitive_fields TEXT[] := ARRAY[
    'phone_number',
    'emergency_contact_name',
    'emergency_contact_phone',
    'address_line1',
    'address_line2',
    'postal_code',
    'date_of_birth'
  ];
  field_name TEXT;
  field_value TEXT;
BEGIN
  FOREACH field_name IN ARRAY sensitive_fields
  LOOP
    -- Use dynamic field access via hstore or json
    field_value := CASE field_name
      WHEN 'phone_number' THEN NEW.phone_number
      WHEN 'emergency_contact_name' THEN NEW.emergency_contact_name
      WHEN 'emergency_contact_phone' THEN NEW.emergency_contact_phone
      WHEN 'address_line1' THEN NEW.address_line1
      WHEN 'address_line2' THEN NEW.address_line2
      WHEN 'postal_code' THEN NEW.postal_code
      WHEN 'date_of_birth' THEN NEW.date_of_birth::text
    END;

    -- Allow NULL values, but if a value is set it must be encrypted (start with 'enc:')
    IF field_value IS NOT NULL AND field_value != '' AND NOT field_value LIKE 'enc:%' THEN
      RAISE EXCEPTION 'Security violation: field "%" must be encrypted before storage. Plaintext values are not permitted.', field_name;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create the trigger on user_profiles for INSERT and UPDATE
CREATE TRIGGER enforce_encryption_on_user_profiles
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_encrypted_fields();
