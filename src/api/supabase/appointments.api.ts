import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";
import { encryptSensitiveFields, decryptSensitiveFields } from "@/services/EncryptionService";

/**
 * Sensitive fields in appointments that require encryption
 */
const SENSITIVE_APPOINTMENT_FIELDS = ['booking_reference'] as const;

export interface Appointment {
  id: string;
  user_id: string;
  provider_id: string;
  test_master_id?: string | null;
  clinic_id?: string | null;
  appointment_date?: string | null;
  appointment_type?: string | null;
  booking_reference?: string | null;
  status: string;
  payment_status?: string | null;
  price_paid?: number | null;
  sample_collected_at?: string | null;
  results_expected_at?: string | null;
  results_available_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

class AppointmentsApi {
  /**
   * Get all appointments for a user
   * Decrypts booking references after retrieval
   */
  async getAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    const { data, error, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false });

    if (error || !data) {
      return { data: null, error, count };
    }

    // Decrypt sensitive fields for each appointment
    const decryptedAppointments = await Promise.all(
      data.map(async (appointment) => {
        const decrypted = await decryptSensitiveFields(appointment, SENSITIVE_APPOINTMENT_FIELDS);
        return { ...appointment, ...decrypted } as Appointment;
      })
    );

    return { data: decryptedAppointments, error: null, count };
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    const decrypted = await decryptSensitiveFields(data, SENSITIVE_APPOINTMENT_FIELDS);
    return { data: { ...data, ...decrypted } as Appointment, error: null };
  }

  /**
   * Create a new appointment
   * Encrypts booking reference before storage
   */
  async createAppointment(
    appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<Appointment>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const appointmentData = { ...appointment, user_id: user.id };
    const encryptedData = await encryptSensitiveFields(
      appointmentData,
      SENSITIVE_APPOINTMENT_FIELDS
    ) as typeof appointmentData;

    const { data, error } = await supabase
      .from('appointments')
      .insert(encryptedData)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    const decrypted = await decryptSensitiveFields(data, SENSITIVE_APPOINTMENT_FIELDS);
    return { data: { ...data, ...decrypted } as Appointment, error: null };
  }

  /**
   * Update an appointment
   * Encrypts booking reference if it's being updated
   */
  async updateAppointment(
    id: string,
    updates: Partial<Appointment>
  ): Promise<ApiResponse<Appointment>> {
    const encryptedData = await encryptSensitiveFields(updates, SENSITIVE_APPOINTMENT_FIELDS) as typeof updates;

    const { data, error } = await supabase
      .from('appointments')
      .update(encryptedData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    const decrypted = await decryptSensitiveFields(data, SENSITIVE_APPOINTMENT_FIELDS);
    return { data: { ...data, ...decrypted } as Appointment, error: null };
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true });

    if (error || !data) {
      return { data: null, error };
    }

    const decryptedAppointments = await Promise.all(
      data.map(async (appointment) => {
        const decrypted = await decryptSensitiveFields(appointment, SENSITIVE_APPOINTMENT_FIELDS);
        return { ...appointment, ...decrypted } as Appointment;
      })
    );

    return { data: decryptedAppointments, error: null };
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, { status: 'cancelled' });
  }
}

export const appointmentsApi = new AppointmentsApi();
