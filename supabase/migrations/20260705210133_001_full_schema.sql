-- Restored from supabase_migrations.schema_migrations (version 20260705210133, name 001_full_schema).
-- md5 of the recorded statements: 1ecff67bf1d1900bbe56c62a9ff7853a
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation: production already had pgvector installed in the extensions schema
-- (out-of-band) when this ran, so the bare CREATE EXTENSION was a no-op there. On
-- a fresh database it installed pgvector into public instead, and later migrations
-- that name extensions.vector failed. Pinning the schema reproduces production.

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE biomarker_knowledge_hub (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    clinical_description TEXT NOT NULL DEFAULT '',
    embedding vector(1536),
    snomed_code TEXT,
    category TEXT NOT NULL DEFAULT 'laboratory',
    related_symptoms TEXT[] DEFAULT '{}',
    effective_date_time TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'entered-in-error')),
    loinc_code TEXT,
    reference_range_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blood_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    name TEXT NOT NULL,
    test_url TEXT,
    price NUMERIC(10, 2),
    sample_type TEXT,
    collection_method TEXT,
    collection_fee_amount NUMERIC(10, 2) DEFAULT 0,
    total_expected_cost NUMERIC(10, 2),
    biomarker_count INTEGER DEFAULT 0,
    biomarkers_included TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    sub_goals TEXT[] DEFAULT '{}',
    gender_specific TEXT DEFAULT 'all',
    method TEXT DEFAULT 'any',
    last_validated TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recommendation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'guest',
    input_summary TEXT NOT NULL,
    matched_biomarkers UUID[] DEFAULT '{}',
    matched_biomarker_names TEXT[] DEFAULT '{}',
    final_recommendations JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    consent_given BOOLEAN NOT NULL DEFAULT true,
    data_retention_expiry TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    request_method TEXT DEFAULT 'web',
    processing_time_ms INTEGER
);

CREATE TABLE sync_heartbeat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    last_sync_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'failed')),
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE provider_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT NOT NULL UNIQUE,
    website_url TEXT,
    api_endpoint TEXT,
    supported_methods TEXT[] DEFAULT '{}',
    coverage_areas TEXT[] DEFAULT '{}',
    accreditations TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_scraped_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
