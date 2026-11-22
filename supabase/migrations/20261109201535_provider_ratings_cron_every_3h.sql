select cron.unschedule(jobid) from cron.job where jobname in ('refresh-provider-ratings-daily','refresh-provider-ratings');
select cron.schedule('refresh-provider-ratings', '50 */3 * * *', $$select public.call_edge_with_service_role('https://clvuioagsgfadynuvodj.supabase.co/functions/v1/refresh-trustpilot-ratings', '{}'::jsonb);$$);
