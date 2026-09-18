-- This trigger granted admin to any signup that happened to be the only user in
-- auth.users. Admin is already established, so it has no remaining purpose and
-- leaves a privilege-escalation path open if the users table ever reached zero.
-- Profile creation is handled separately by handle_new_user_profile().
drop trigger if exists on_auth_user_created_engine on auth.users;
drop function if exists public.promote_first_user_to_admin();