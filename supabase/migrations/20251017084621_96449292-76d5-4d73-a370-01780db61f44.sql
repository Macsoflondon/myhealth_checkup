-- Update handle_new_user_profile to support both email/password and OAuth signups
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_full_name TEXT;
BEGIN
  -- Try to get first_name and last_name (email/password signup)
  v_first_name := NEW.raw_user_meta_data->>'first_name';
  v_last_name := NEW.raw_user_meta_data->>'last_name';
  
  -- If not present, try to parse full_name (OAuth signup - Google, etc.)
  IF v_first_name IS NULL AND v_last_name IS NULL THEN
    v_full_name := NEW.raw_user_meta_data->>'full_name';
    IF v_full_name IS NOT NULL THEN
      -- Split full name: first word = first name, rest = last name
      v_first_name := split_part(v_full_name, ' ', 1);
      v_last_name := NULLIF(trim(substring(v_full_name from length(split_part(v_full_name, ' ', 1)) + 1)), '');
    END IF;
  END IF;
  
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (NEW.id, v_first_name, v_last_name);
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Add default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;