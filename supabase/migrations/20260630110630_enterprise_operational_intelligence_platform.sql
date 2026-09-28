-- Restored verbatim from supabase_migrations.schema_migrations (version 20260630110630, name enterprise_operational_intelligence_platform).
-- md5 of the recorded statements: 5143e428dac85c1fbf8d7b1ded9b61da
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- ============================================================
-- ENTERPRISE OPERATIONAL INTELLIGENCE PLATFORM
-- My Health Checkup — Complete Schema Migration
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. CUSTOMER INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          text NOT NULL UNIQUE,
  user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id        text,
  started_at          timestamptz NOT NULL DEFAULT now(),
  ended_at            timestamptz,
  last_seen_at        timestamptz DEFAULT now(),
  duration_seconds    integer,
  page_count          integer DEFAULT 0,
  event_count         integer DEFAULT 0,
  entry_page          text,
  exit_page           text,
  referrer            text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  utm_term            text,
  utm_content         text,
  device_type         text,
  browser             text,
  browser_version     text,
  os                  text,
  os_version          text,
  screen_width        integer,
  screen_height       integer,
  country             text,
  region              text,
  city                text,
  ip_hash             text,
  is_returning        boolean DEFAULT false,
  is_bot              boolean DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id    ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON public.user_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_anonymous  ON public.user_sessions(anonymous_id);

-- Partitioned events table: PK must include partition key (created_at)
CREATE TABLE IF NOT EXISTS public.user_events (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id      text NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id    text,
  event_type      text NOT NULL,
  event_name      text NOT NULL,
  page_url        text,
  page_title      text,
  referrer_url    text,
  entity_type     text,
  entity_id       text,
  entity_name     text,
  properties      jsonb DEFAULT '{}',
  duration_ms     integer,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS public.user_events_2025 PARTITION OF public.user_events
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS public.user_events_2026 PARTITION OF public.user_events
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS public.user_events_2027 PARTITION OF public.user_events
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE IF NOT EXISTS public.user_events_2028 PARTITION OF public.user_events
  FOR VALUES FROM ('2028-01-01') TO ('2029-01-01');

CREATE INDEX IF NOT EXISTS idx_user_events_session ON public.user_events(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_user    ON public.user_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_type    ON public.user_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_entity  ON public.user_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON public.user_events(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 2. PRODUCT INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.product_scores (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_test_id      text NOT NULL UNIQUE,
  provider_id           text NOT NULL,
  quality_score         numeric(4,1) DEFAULT 0,
  completeness_score    numeric(4,1) DEFAULT 0,
  seo_score             numeric(4,1) DEFAULT 0,
  ai_confidence_score   numeric(4,1) DEFAULT 0,
  overall_score         numeric(4,1) GENERATED ALWAYS AS (
    ROUND((quality_score + completeness_score + seo_score + ai_confidence_score) / 4.0, 1)
  ) STORED,
  has_price             boolean DEFAULT false,
  has_image             boolean DEFAULT false,
  has_description       boolean DEFAULT false,
  has_biomarkers        boolean DEFAULT false,
  has_affiliate_link    boolean DEFAULT false,
  has_sample_type       boolean DEFAULT false,
  biomarker_count       integer DEFAULT 0,
  last_verified_at      timestamptz,
  last_scraped_at       timestamptz,
  last_updated_at       timestamptz DEFAULT now(),
  computed_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_scores_provider ON public.product_scores(provider_id);
CREATE INDEX IF NOT EXISTS idx_product_scores_overall  ON public.product_scores(overall_score DESC);

CREATE TABLE IF NOT EXISTS public.product_change_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_test_id  text NOT NULL,
  provider_id       text NOT NULL,
  change_type       text NOT NULL,
  old_value         jsonb,
  new_value         jsonb,
  changed_by        text DEFAULT 'scraper',
  scrape_run_id     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_change_test     ON public.product_change_log(provider_test_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_change_type     ON public.product_change_log(change_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_change_provider ON public.product_change_log(provider_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.product_popularity (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_test_id        text NOT NULL,
  provider_id             text NOT NULL,
  master_test_id          text,
  view_count              bigint DEFAULT 0,
  comparison_count        bigint DEFAULT 0,
  affiliate_click_count   bigint DEFAULT 0,
  save_count              bigint DEFAULT 0,
  purchase_count          bigint DEFAULT 0,
  revenue_total           numeric(12,2) DEFAULT 0,
  conversion_rate         numeric(6,4) DEFAULT 0,
  period_start            date NOT NULL,
  period_type             text NOT NULL DEFAULT 'daily',
  computed_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider_test_id, period_start, period_type)
);

CREATE INDEX IF NOT EXISTS idx_product_pop_test   ON public.product_popularity(provider_test_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_product_pop_period ON public.product_popularity(period_type, period_start DESC);

-- ─────────────────────────────────────────────────────────────
-- 3. PROVIDER INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.provider_metrics (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id               text NOT NULL,
  health_score              numeric(4,1) DEFAULT 0,
  catalogue_completeness    numeric(4,1) DEFAULT 0,
  scrape_reliability        numeric(4,1) DEFAULT 0,
  affiliate_health          numeric(4,1) DEFAULT 0,
  total_products            integer DEFAULT 0,
  active_products           integer DEFAULT 0,
  products_with_price       integer DEFAULT 0,
  products_with_image       integer DEFAULT 0,
  products_with_biomarkers  integer DEFAULT 0,
  broken_affiliate_links    integer DEFAULT 0,
  avg_product_score         numeric(4,1) DEFAULT 0,
  total_page_views          bigint DEFAULT 0,
  total_affiliate_clicks    bigint DEFAULT 0,
  total_revenue             numeric(12,2) DEFAULT 0,
  conversion_rate           numeric(6,4) DEFAULT 0,
  last_scrape_at            timestamptz,
  last_scrape_success       boolean,
  consecutive_failures      integer DEFAULT 0,
  compliance_status         text DEFAULT 'unknown',
  trust_score               numeric(4,1) DEFAULT 0,
  computed_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_metrics_id     ON public.provider_metrics(provider_id, computed_at DESC);
CREATE INDEX IF NOT EXISTS idx_provider_metrics_health ON public.provider_metrics(health_score DESC);

CREATE TABLE IF NOT EXISTS public.provider_catalogue_snapshots (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       text NOT NULL,
  snapshot_date     date NOT NULL,
  product_count     integer DEFAULT 0,
  products_added    jsonb DEFAULT '[]',
  products_removed  jsonb DEFAULT '[]',
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_prov_snapshots ON public.provider_catalogue_snapshots(provider_id, snapshot_date DESC);

-- ─────────────────────────────────────────────────────────────
-- 4. SCRAPING INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.scrape_operations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id                text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  provider_id           text NOT NULL,
  function_name         text NOT NULL,
  status                text NOT NULL DEFAULT 'queued',
  triggered_by          text DEFAULT 'scheduler',
  triggered_by_user_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  queued_at             timestamptz DEFAULT now(),
  started_at            timestamptz,
  completed_at          timestamptz,
  duration_ms           integer,
  products_found        integer DEFAULT 0,
  products_updated      integer DEFAULT 0,
  products_added        integer DEFAULT 0,
  products_removed      integer DEFAULT 0,
  products_unchanged    integer DEFAULT 0,
  price_changes         integer DEFAULT 0,
  biomarker_changes     integer DEFAULT 0,
  image_changes         integer DEFAULT 0,
  description_changes   integer DEFAULT 0,
  affiliate_failures    integer DEFAULT 0,
  api_failures          integer DEFAULT 0,
  retry_count           integer DEFAULT 0,
  warning_count         integer DEFAULT 0,
  error_message         text,
  error_details         jsonb,
  request_count         integer DEFAULT 0,
  bytes_transferred     bigint DEFAULT 0,
  metadata              jsonb DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scrape_ops_provider ON public.scrape_operations(provider_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrape_ops_status   ON public.scrape_operations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrape_ops_created  ON public.scrape_operations(created_at DESC);

CREATE TABLE IF NOT EXISTS public.scrape_change_events (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scrape_operation_id   uuid REFERENCES public.scrape_operations(id) ON DELETE CASCADE,
  provider_id           text NOT NULL,
  provider_test_id      text,
  test_name             text,
  change_type           text NOT NULL,
  severity              text DEFAULT 'info',
  old_value             jsonb,
  new_value             jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scrape_chg_op       ON public.scrape_change_events(scrape_operation_id);
CREATE INDEX IF NOT EXISTS idx_scrape_chg_provider ON public.scrape_change_events(provider_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrape_chg_type     ON public.scrape_change_events(change_type, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 5. AI INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ai_operation_logs (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  job_type        text NOT NULL,
  model           text,
  prompt_version  text,
  input_tokens    integer,
  output_tokens   integer,
  total_tokens    integer,
  latency_ms      integer,
  success         boolean DEFAULT true,
  error_type      text,
  error_message   text,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id      text,
  entity_type     text,
  entity_id       text,
  cache_hit       boolean DEFAULT false,
  cost_usd        numeric(10,6),
  metadata        jsonb DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS public.ai_operation_logs_2025 PARTITION OF public.ai_operation_logs
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS public.ai_operation_logs_2026 PARTITION OF public.ai_operation_logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS public.ai_operation_logs_2027 PARTITION OF public.ai_operation_logs
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE IF NOT EXISTS public.ai_operation_logs_2028 PARTITION OF public.ai_operation_logs
  FOR VALUES FROM ('2028-01-01') TO ('2029-01-01');

CREATE INDEX IF NOT EXISTS idx_ai_logs_type    ON public.ai_operation_logs(job_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_success ON public.ai_operation_logs(success, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON public.ai_operation_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS public.ai_prompt_versions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key  text NOT NULL,
  version     text NOT NULL,
  content     text NOT NULL,
  job_type    text NOT NULL,
  is_active   boolean DEFAULT true,
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(prompt_key, version)
);

CREATE TABLE IF NOT EXISTS public.ai_vector_index_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  index_name        text NOT NULL,
  operation         text NOT NULL,
  records_affected  integer DEFAULT 0,
  duration_ms       integer,
  success           boolean DEFAULT true,
  error_message     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 6. CLINICAL INTELLIGENCE LAYER (Foundation only — not public-facing)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clinical_patient_uploads (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_type         text NOT NULL DEFAULT 'blood_test',
  file_ref            text,
  original_filename   text,
  mime_type           text,
  file_size_bytes     bigint,
  status              text NOT NULL DEFAULT 'pending',
  processed_at        timestamptz,
  error_message       text,
  source              text DEFAULT 'user_upload',
  consent_record_id   uuid,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_uploads_user   ON public.clinical_patient_uploads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_uploads_status ON public.clinical_patient_uploads(status);

CREATE TABLE IF NOT EXISTS public.clinical_biomarker_history (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  biomarker_code        text NOT NULL,
  biomarker_name        text,
  loinc_code            text,
  snomed_code           text,
  value                 numeric(14,4),
  unit                  text,
  status                text,
  reference_range_min   numeric(14,4),
  reference_range_max   numeric(14,4),
  recorded_at           timestamptz NOT NULL,
  source_upload_id      uuid REFERENCES public.clinical_patient_uploads(id) ON DELETE SET NULL,
  source_type           text DEFAULT 'upload',
  lab_name              text,
  trend_direction       text,
  ai_interpretation     text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_bh_user      ON public.clinical_biomarker_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_bh_biomarker ON public.clinical_biomarker_history(biomarker_code, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_bh_loinc     ON public.clinical_biomarker_history(loinc_code);

CREATE TABLE IF NOT EXISTS public.clinical_consent_records (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type  text NOT NULL,
  granted       boolean NOT NULL DEFAULT false,
  granted_at    timestamptz,
  revoked_at    timestamptz,
  expires_at    timestamptz,
  version       text NOT NULL DEFAULT '1.0',
  ip_hash       text,
  user_agent    text,
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON public.clinical_consent_records(user_id, consent_type);

CREATE TABLE IF NOT EXISTS public.clinical_fhir_bundles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundle_type       text NOT NULL,
  fhir_version      text DEFAULT 'R4',
  bundle_json       jsonb NOT NULL,
  source_upload_id  uuid REFERENCES public.clinical_patient_uploads(id) ON DELETE SET NULL,
  validated         boolean DEFAULT false,
  validation_errors jsonb DEFAULT '[]',
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fhir_user ON public.clinical_fhir_bundles(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.clinical_snomed_mappings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snomed_concept_id   text NOT NULL UNIQUE,
  preferred_term      text NOT NULL,
  biomarker_code      text,
  biomarker_name      text,
  category            text,
  is_active           boolean DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_snomed_biomarker ON public.clinical_snomed_mappings(biomarker_code);

CREATE TABLE IF NOT EXISTS public.clinical_loinc_mappings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loinc_code    text NOT NULL UNIQUE,
  long_name     text NOT NULL,
  short_name    text,
  biomarker_code text,
  component     text,
  property      text,
  time_aspect   text,
  system        text,
  scale_type    text,
  method_type   text,
  common_units  text[],
  is_active     boolean DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loinc_biomarker ON public.clinical_loinc_mappings(biomarker_code);

CREATE TABLE IF NOT EXISTS public.clinical_reference_ranges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  biomarker_code  text NOT NULL,
  loinc_code      text,
  min_value       numeric(14,4),
  max_value       numeric(14,4),
  unit            text NOT NULL,
  sex             text DEFAULT 'any',
  age_min_years   integer,
  age_max_years   integer,
  population      text DEFAULT 'general',
  source          text DEFAULT 'nhs',
  is_active       boolean DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ref_ranges_biomarker ON public.clinical_reference_ranges(biomarker_code, sex);

CREATE TABLE IF NOT EXISTS public.clinical_gp_notifications (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type     text NOT NULL,
  status                text NOT NULL DEFAULT 'pending',
  gp_practice_ods_code  text,
  gp_name               text,
  content_summary       text,
  fhir_bundle_id        uuid REFERENCES public.clinical_fhir_bundles(id) ON DELETE SET NULL,
  scheduled_at          timestamptz,
  sent_at               timestamptz,
  error_message         text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 7. SEO INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.seo_page_metrics (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url            text NOT NULL,
  page_path           text NOT NULL,
  page_type           text,
  title               text,
  meta_description    text,
  h1                  text,
  canonical_url       text,
  is_indexed          boolean,
  is_canonical        boolean DEFAULT true,
  lcp_ms              integer,
  fid_ms              integer,
  cls_score           numeric(6,4),
  ttfb_ms             integer,
  fcp_ms              integer,
  performance_score   integer,
  seo_score           integer,
  word_count          integer,
  internal_link_count integer DEFAULT 0,
  external_link_count integer DEFAULT 0,
  broken_link_count   integer DEFAULT 0,
  image_count         integer DEFAULT 0,
  images_missing_alt  integer DEFAULT 0,
  schema_types        text[],
  schema_valid        boolean,
  has_og_tags         boolean DEFAULT false,
  has_twitter_card    boolean DEFAULT false,
  http_status         integer,
  crawled_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_metrics_url     ON public.seo_page_metrics(page_url, crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_metrics_type    ON public.seo_page_metrics(page_type, crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_metrics_crawled ON public.seo_page_metrics(crawled_at DESC);

CREATE TABLE IF NOT EXISTS public.seo_keyword_rankings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword         text NOT NULL,
  page_url        text NOT NULL,
  position        numeric(6,1),
  search_volume   integer,
  impressions     bigint,
  clicks          bigint,
  ctr             numeric(6,4),
  measured_at     date NOT NULL DEFAULT CURRENT_DATE,
  source          text DEFAULT 'manual',
  UNIQUE(keyword, page_url, measured_at, source)
);

CREATE INDEX IF NOT EXISTS idx_seo_kw_keyword ON public.seo_keyword_rankings(keyword, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_kw_page    ON public.seo_keyword_rankings(page_url, measured_at DESC);

CREATE TABLE IF NOT EXISTS public.seo_crawl_issues (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url        text NOT NULL,
  issue_type      text NOT NULL,
  severity        text DEFAULT 'warning',
  description     text,
  related_url     text,
  is_resolved     boolean DEFAULT false,
  resolved_at     timestamptz,
  first_seen_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page_url, issue_type)
);

CREATE INDEX IF NOT EXISTS idx_seo_issues_type     ON public.seo_crawl_issues(issue_type, is_resolved);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON public.seo_crawl_issues(severity, is_resolved);

-- ─────────────────────────────────────────────────────────────
-- 8. COMMERCIAL INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.funnel_events (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id      text NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id    text,
  funnel_stage    text NOT NULL,
  entity_type     text,
  entity_id       text,
  entity_name     text,
  provider_id     text,
  revenue_amount  numeric(10,2),
  currency        text DEFAULT 'GBP',
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS public.funnel_events_2025 PARTITION OF public.funnel_events
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS public.funnel_events_2026 PARTITION OF public.funnel_events
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS public.funnel_events_2027 PARTITION OF public.funnel_events
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE IF NOT EXISTS public.funnel_events_2028 PARTITION OF public.funnel_events
  FOR VALUES FROM ('2028-01-01') TO ('2029-01-01');

CREATE INDEX IF NOT EXISTS idx_funnel_session ON public.funnel_events(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnel_stage   ON public.funnel_events(funnel_stage, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnel_created ON public.funnel_events(created_at DESC);

CREATE TABLE IF NOT EXISTS public.revenue_events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              text,
  user_id                 uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id            text,
  order_reference         text,
  provider_id             text NOT NULL,
  provider_test_id        text,
  test_name               text,
  amount                  numeric(10,2) NOT NULL,
  currency                text DEFAULT 'GBP',
  source                  text NOT NULL DEFAULT 'affiliate',
  commission_rate         numeric(6,4),
  commission_amount       numeric(10,2),
  affiliate_network       text,
  click_id                text,
  attribution_window_days integer DEFAULT 30,
  confirmed               boolean DEFAULT false,
  confirmed_at            timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revenue_provider ON public.revenue_events(provider_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_created  ON public.revenue_events(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 9. PLATFORM INTELLIGENCE LAYER
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  metric_name   text NOT NULL,
  metric_value  numeric(18,4) NOT NULL,
  metric_unit   text,
  component     text NOT NULL,
  environment   text DEFAULT 'production',
  tags          jsonb DEFAULT '{}',
  recorded_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);

CREATE TABLE IF NOT EXISTS public.platform_metrics_2025 PARTITION OF public.platform_metrics
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS public.platform_metrics_2026 PARTITION OF public.platform_metrics
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS public.platform_metrics_2027 PARTITION OF public.platform_metrics
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE IF NOT EXISTS public.platform_metrics_2028 PARTITION OF public.platform_metrics
  FOR VALUES FROM ('2028-01-01') TO ('2029-01-01');

CREATE INDEX IF NOT EXISTS idx_platform_met_name      ON public.platform_metrics(metric_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_met_component ON public.platform_metrics(component, recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.edge_function_logs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name         text NOT NULL,
  invocation_id         text,
  status                text NOT NULL,
  http_status           integer,
  duration_ms           integer,
  memory_mb             integer,
  error_message         text,
  error_stack           text,
  request_size_bytes    bigint,
  response_size_bytes   bigint,
  triggered_by          text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_edge_fn_name    ON public.edge_function_logs(function_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edge_fn_status  ON public.edge_function_logs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edge_fn_created ON public.edge_function_logs(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 10. OPERATIONAL ALERTS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.operational_alerts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_key         text UNIQUE,
  alert_type        text NOT NULL,
  severity          text NOT NULL DEFAULT 'warning',
  title             text NOT NULL,
  message           text NOT NULL,
  source            text NOT NULL,
  entity_type       text,
  entity_id         text,
  entity_name       text,
  metadata          jsonb DEFAULT '{}',
  is_resolved       boolean DEFAULT false,
  resolved_at       timestamptz,
  resolved_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_note   text,
  first_seen_at     timestamptz NOT NULL DEFAULT now(),
  last_seen_at      timestamptz NOT NULL DEFAULT now(),
  occurrence_count  integer DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_alerts_type       ON public.operational_alerts(alert_type, is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_severity   ON public.operational_alerts(severity, is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_created    ON public.operational_alerts(first_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON public.operational_alerts(severity, first_seen_at DESC) WHERE NOT is_resolved;

-- ─────────────────────────────────────────────────────────────
-- 11. ADMIN ACTIVITY LOG
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action          text NOT NULL,
  resource_type   text NOT NULL,
  resource_id     text,
  resource_name   text,
  old_value       jsonb,
  new_value       jsonb,
  ip_address      text,
  user_agent      text,
  session_id      text,
  success         boolean DEFAULT true,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_log_user     ON public.admin_activity_log(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_log_resource ON public.admin_activity_log(resource_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_log_created  ON public.admin_activity_log(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 12. ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.user_sessions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_scores               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_change_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_popularity           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_metrics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_catalogue_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_operations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_change_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_operation_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_versions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_vector_index_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_patient_uploads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_biomarker_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_consent_records     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_fhir_bundles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_snomed_mappings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_loinc_mappings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_reference_ranges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_gp_notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_page_metrics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keyword_rankings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_crawl_issues             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_events                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_events               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_function_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_alerts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log           ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "admin_user_sessions"      ON public.user_sessions                FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_user_events"        ON public.user_events                  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_product_scores"     ON public.product_scores               FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_product_change"     ON public.product_change_log           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_product_pop"        ON public.product_popularity           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_provider_metrics"   ON public.provider_metrics             FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_prov_snapshots"     ON public.provider_catalogue_snapshots FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_scrape_ops"         ON public.scrape_operations            FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_scrape_changes"     ON public.scrape_change_events         FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_ai_logs"            ON public.ai_operation_logs            FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_ai_prompts"         ON public.ai_prompt_versions           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_ai_vector"          ON public.ai_vector_index_log          FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_seo_metrics"        ON public.seo_page_metrics             FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_seo_keywords"       ON public.seo_keyword_rankings         FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_seo_issues"         ON public.seo_crawl_issues             FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_funnel"             ON public.funnel_events                FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_revenue"            ON public.revenue_events               FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_platform_metrics"   ON public.platform_metrics             FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_edge_fn"            ON public.edge_function_logs           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_alerts"             ON public.operational_alerts           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_admin_log"          ON public.admin_activity_log           FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_snomed"             ON public.clinical_snomed_mappings     FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_loinc"              ON public.clinical_loinc_mappings      FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_ref_ranges"         ON public.clinical_reference_ranges    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Clinical data: user owns their own records + admin access
CREATE POLICY "user_clinical_uploads"    ON public.clinical_patient_uploads   FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_biomarker_history"   ON public.clinical_biomarker_history FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_consent_records"     ON public.clinical_consent_records   FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_fhir_bundles"        ON public.clinical_fhir_bundles      FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_gp_notifications"    ON public.clinical_gp_notifications  FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Service role insert-only (for scrapers/edge functions writing telemetry)
CREATE POLICY "svc_insert_sessions"     ON public.user_sessions         FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_events"       ON public.user_events           FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_funnel"       ON public.funnel_events         FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_scrape_ops"   ON public.scrape_operations     FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_ai_logs"      ON public.ai_operation_logs     FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_alerts"       ON public.operational_alerts    FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_edge_logs"    ON public.edge_function_logs    FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_platform_met" ON public.platform_metrics      FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_prod_scores"  ON public.product_scores        FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_prov_metrics" ON public.provider_metrics      FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_scrape_chg"   ON public.scrape_change_events  FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_admin_log"    ON public.admin_activity_log    FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_seo_metrics"  ON public.seo_page_metrics      FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_seo_kw"       ON public.seo_keyword_rankings  FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_seo_issues"   ON public.seo_crawl_issues      FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_prod_change"  ON public.product_change_log    FOR INSERT WITH CHECK (true);
CREATE POLICY "svc_insert_revenue"      ON public.revenue_events        FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 13. ANALYTICS VIEWS
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.v_executive_kpis AS
SELECT
  (SELECT COUNT(*) FROM public.user_sessions WHERE started_at >= now() - interval '30 days') AS sessions_30d,
  (SELECT COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) FROM public.user_sessions WHERE started_at >= now() - interval '30 days') AS unique_visitors_30d,
  (SELECT COUNT(*) FROM public.provider_tests WHERE is_active = true)                         AS active_products,
  (SELECT COUNT(DISTINCT provider_id) FROM public.provider_tests WHERE is_active = true)      AS active_providers,
  (SELECT COALESCE(SUM(amount),0) FROM public.revenue_events WHERE created_at >= now() - interval '30 days') AS revenue_30d,
  (SELECT COUNT(*) FROM public.operational_alerts WHERE NOT is_resolved)                      AS open_alerts,
  (SELECT COUNT(*) FROM public.operational_alerts WHERE NOT is_resolved AND severity IN ('critical','emergency')) AS critical_alerts,
  (SELECT COUNT(*) FROM public.scrape_operations WHERE status = 'failed' AND created_at >= now() - interval '24 hours') AS scraper_failures_24h,
  (SELECT COUNT(*) FROM public.ai_operation_logs WHERE NOT success AND created_at >= now() - interval '24 hours') AS ai_failures_24h,
  (SELECT ROUND(AVG(health_score)::numeric,1) FROM (SELECT DISTINCT ON (provider_id) health_score FROM public.provider_metrics ORDER BY provider_id, computed_at DESC) t) AS avg_provider_health;

CREATE OR REPLACE VIEW public.v_provider_health_latest AS
SELECT DISTINCT ON (pm.provider_id)
  pm.*
FROM public.provider_metrics pm
ORDER BY pm.provider_id, pm.computed_at DESC;

CREATE OR REPLACE VIEW public.v_unresolved_alerts AS
SELECT
  id, alert_type, severity, title, message, source,
  entity_type, entity_id, entity_name,
  first_seen_at, last_seen_at, occurrence_count, metadata
FROM public.operational_alerts
WHERE NOT is_resolved
ORDER BY
  CASE severity WHEN 'emergency' THEN 0 WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END,
  first_seen_at DESC;

CREATE OR REPLACE VIEW public.v_scrape_ops_recent AS
SELECT
  so.provider_id,
  so.function_name,
  so.status,
  so.started_at,
  so.completed_at,
  so.duration_ms,
  so.products_found,
  so.products_updated,
  so.products_added,
  so.products_removed,
  so.price_changes,
  so.biomarker_changes,
  so.error_message,
  so.retry_count,
  so.created_at
FROM public.scrape_operations so
ORDER BY so.created_at DESC;

CREATE OR REPLACE VIEW public.v_ai_ops_summary AS
SELECT
  job_type,
  COUNT(*) AS total_calls,
  COUNT(*) FILTER (WHERE success) AS successful,
  COUNT(*) FILTER (WHERE NOT success) AS failed,
  ROUND(AVG(latency_ms)::numeric, 0) AS avg_latency_ms,
  ROUND(AVG(total_tokens)::numeric, 0) AS avg_tokens,
  COALESCE(SUM(cost_usd), 0) AS total_cost_usd,
  MAX(created_at) AS last_call_at
FROM public.ai_operation_logs
WHERE created_at >= now() - interval '30 days'
GROUP BY job_type;

CREATE OR REPLACE VIEW public.v_commercial_funnel AS
SELECT
  funnel_stage,
  COUNT(*) AS event_count,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS unique_users
FROM public.funnel_events
WHERE created_at >= now() - interval '30 days'
GROUP BY funnel_stage
ORDER BY
  CASE funnel_stage
    WHEN 'homepage' THEN 0 WHEN 'category' THEN 1 WHEN 'subcategory' THEN 2
    WHEN 'comparison' THEN 3 WHEN 'test_detail' THEN 4 WHEN 'provider' THEN 5
    WHEN 'affiliate_click' THEN 6 WHEN 'purchase' THEN 7 ELSE 8
  END;
