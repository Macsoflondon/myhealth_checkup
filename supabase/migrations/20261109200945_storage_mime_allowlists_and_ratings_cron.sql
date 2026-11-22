-- Server-side upload allow-lists (previously enforced in the app only).
update storage.buckets set allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp','image/heic','image/heif'], file_size_limit = 20971520 where id = 'test-results';
update storage.buckets set allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'], file_size_limit = 10485760 where id = 'provider-test-images';
update storage.buckets set allowed_mime_types = array['video/mp4','video/webm','video/quicktime'], file_size_limit = 209715200 where id = 'videos';

-- Provider star ratings: daily refresh.
select cron.unschedule(jobid) from cron.job where jobname = 'refresh-provider-ratings-daily';
select cron.schedule('refresh-provider-ratings-daily', '50 4 * * *', $$select public.call_edge_with_service_role('https://clvuioagsgfadynuvodj.supabase.co/functions/v1/refresh-trustpilot-ratings', '{}'::jsonb);$$);

-- Duplicate security scan: the 15-minute job already covers the hourly one.
select cron.unschedule(jobid) from cron.job where jobname = 'security-scan-snapshot-hourly';
