
-- Drop indexes flagged as never-used by the performance advisor.
-- Reversible: any can be re-created in one line if a feature that needs it goes live.
-- (Newly-added FK covering indexes are intentionally NOT dropped.)
drop index if exists public.idx_biomarker_snomed;
drop index if exists public.idx_biomarker_embedding_cosine;
drop index if exists public.idx_biomarker_symptoms;
drop index if exists public.idx_biomarker_status;
drop index if exists public.idx_rec_history_expiry;
drop index if exists public.idx_rec_history_status;
drop index if exists public.idx_sync_heartbeat_service;
drop index if exists public.idx_provider_active;
drop index if exists public.idx_blood_tests_biomarkers;
drop index if exists public.idx_blood_tests_provider;
drop index if exists public.idx_blood_tests_method;
drop index if exists public.idx_blood_tests_categories;
drop index if exists public.idx_blood_tests_goals;
drop index if exists public.fhir_export_jobs_user_status_idx;
drop index if exists public.fhir_export_jobs_expires_idx;
drop index if exists public.data_sharing_grants_user_idx;
drop index if exists public.data_sharing_grants_token_idx;
drop index if exists public.data_sharing_grants_expires_idx;
drop index if exists public.idx_audit_logs_user_created;
drop index if exists public.idx_role_audit_log_created_at;
drop index if exists public.soc_incidents_status_idx;
drop index if exists public.soc_incidents_severity_idx;
drop index if exists public.soc_incidents_source_idx;
drop index if exists public.soc_incidents_assignee_idx;
drop index if exists public.web_vitals_route_idx;
drop index if exists public.protected_call_log_denied_caller_idx;
drop index if exists public.edge_function_logs_errors_idx;
