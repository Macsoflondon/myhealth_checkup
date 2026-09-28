-- Restored verbatim from supabase_migrations.schema_migrations (version 20260705210203, name 002_indexes).
-- md5 of the recorded statements: 5b9cc9f9df2a00e9f198ca4b72e9604d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

CREATE INDEX idx_biomarker_embedding_cosine ON biomarker_knowledge_hub USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_biomarker_symptoms ON biomarker_knowledge_hub USING GIN (related_symptoms);
CREATE INDEX idx_biomarker_category ON biomarker_knowledge_hub (category);
CREATE INDEX idx_biomarker_snomed ON biomarker_knowledge_hub (snomed_code);
CREATE INDEX idx_biomarker_status ON biomarker_knowledge_hub (status);
CREATE INDEX idx_blood_tests_provider ON blood_tests (provider);
CREATE INDEX idx_blood_tests_method ON blood_tests (method);
CREATE INDEX idx_blood_tests_biomarkers ON blood_tests USING GIN (biomarkers_included);
CREATE INDEX idx_blood_tests_categories ON blood_tests USING GIN (categories);
CREATE INDEX idx_blood_tests_goals ON blood_tests USING GIN (goals);
CREATE INDEX idx_rec_history_user ON recommendation_history (user_id, created_at DESC);
CREATE INDEX idx_rec_history_status ON recommendation_history (status);
CREATE INDEX idx_rec_history_expiry ON recommendation_history (data_retention_expiry);
CREATE INDEX idx_sync_heartbeat_service ON sync_heartbeat (service_name, last_sync_at DESC);
CREATE INDEX idx_provider_active ON provider_metadata (is_active);
