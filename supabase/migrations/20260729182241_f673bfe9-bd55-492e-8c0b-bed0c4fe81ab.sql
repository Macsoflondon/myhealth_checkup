DELETE FROM public.scraper_alerts WHERE provider_id = ':providerId' OR provider_id ILIKE ':%';
DELETE FROM public.scraping_jobs WHERE provider_id = ':providerId' OR provider_id ILIKE ':%';