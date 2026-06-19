
REVOKE EXECUTE ON FUNCTION public.run_logged_cleanup(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_cron_run_log() FROM PUBLIC, anon, authenticated;
