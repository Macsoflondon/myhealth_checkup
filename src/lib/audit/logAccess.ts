import { supabase } from '@/integrations/supabase/client';

/**
 * Standard reason codes for sensitive data access. Extend as needed but keep
 * the set small - the whole point is that a human reviewer can eyeball a SIEM
 * dashboard and understand *why* each C3/C4 read happened.
 */
export type AccessReason =
  | 'user:self-view'
  | 'user:profile-edit'
  | 'admin:support-ticket'
  | 'admin:security-investigation'
  | 'clinician:review'
  | 'system:automated-processing';

export type DataClassification = 'C0' | 'C1' | 'C2' | 'C3' | 'C4';

export interface LogAccessArgs {
  tableName: string;
  recordId: string;
  reason: AccessReason;
  purpose?: string;
  classification?: DataClassification;
}

/**
 * Records a purpose-bound read of a sensitive record. Fails soft: if the log
 * call errors we surface it but never block the caller (blocking would let a
 * logging outage double as a denial of service on legitimate access).
 */
export async function logSensitiveAccess(args: LogAccessArgs): Promise<void> {
  const { tableName, recordId, reason, purpose, classification = 'C2' } = args;
  const { error } = await supabase.rpc('log_data_access_with_reason', {
    _table_name: tableName,
    _record_id: recordId,
    _reason_code: reason,
    _purpose: purpose ?? null,
    _classification: classification,
  });
  if (error) {
     
    console.warn('[audit] log_data_access_with_reason failed', error.message);
  }
}
