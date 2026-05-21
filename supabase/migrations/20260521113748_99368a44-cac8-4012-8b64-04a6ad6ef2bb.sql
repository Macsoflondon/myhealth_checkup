UPDATE public.provider_tests SET image_url = REPLACE(image_url, 'http://', 'https://') WHERE image_url LIKE 'http://%';
UPDATE public.provider_tests SET url = REPLACE(url, 'http://', 'https://') WHERE url LIKE 'http://%';
UPDATE public.provider_test_mapping SET provider_url = REPLACE(provider_url, 'http://', 'https://') WHERE provider_url LIKE 'http://%';
UPDATE public.scraper_alerts SET acknowledged = true, acknowledged_at = now() WHERE acknowledged = false;