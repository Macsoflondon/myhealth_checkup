import { ApiResponse } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface Clinic {
  id: string;
  name: string;
  provider_id?: string;
  full_address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  access_note?: string;
  created_at: string;
}

class ClinicsApi {
  /**
   * Get all clinics
   */
  async getAllClinics(): Promise<ApiResponse<Clinic[]>> {
    try {
      const { data, error } = await supabase.from("clinics").select("*");
      return { data: data as Clinic[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get clinics by provider
   */
  async getClinicsByProvider(providerId: string): Promise<ApiResponse<Clinic[]>> {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("provider_id", providerId);

      return { data: data as Clinic[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get clinics by postal code
   */
  async getClinicsByPostalCode(postalCode: string): Promise<ApiResponse<Clinic[]>> {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .ilike("postal_code", `${postalCode}%`);

      return { data: data as Clinic[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search clinics by name or address
   */
  async searchClinics(searchTerm: string): Promise<ApiResponse<Clinic[]>> {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .or(`name.ilike.%${searchTerm}%,full_address.ilike.%${searchTerm}%`);

      return { data: data as Clinic[], error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get nearest clinics (requires latitude/longitude)
   */
  async getNearestClinics(
    latitude: number,
    longitude: number,
    limit: number = 10
  ): Promise<ApiResponse<Clinic[]>> {
    try {
      // This would require PostGIS extension for proper distance calculation
      // For now, we'll fetch all clinics with coordinates and sort client-side
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (error || !data) {
        return { data: null, error };
      }

      // Calculate distance and sort
      const clinicsWithDistance = (data as any[]).map((clinic) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          clinic.latitude,
          clinic.longitude
        );
        return { ...clinic, distance };
      });

      clinicsWithDistance.sort((a, b) => a.distance - b.distance);

      return { data: clinicsWithDistance.slice(0, limit) as Clinic[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const clinicsApi = new ClinicsApi();
