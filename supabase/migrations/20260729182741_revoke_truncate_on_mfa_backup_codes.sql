-- TRUNCATE is not subject to RLS, so leaving it granted would let any
-- authenticated role wipe every user's backup codes in one statement.
revoke truncate, trigger, references on public.mfa_backup_codes from authenticated, anon;