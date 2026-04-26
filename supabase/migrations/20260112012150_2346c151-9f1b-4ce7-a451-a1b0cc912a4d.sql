-- Remove all Tuli Health data from the database
DELETE FROM provider_tests WHERE provider_id = 'tuli-health';
DELETE FROM clinics WHERE provider_id = 'tuli-health';
DELETE FROM scraping_jobs WHERE provider_id = 'tuli-health';