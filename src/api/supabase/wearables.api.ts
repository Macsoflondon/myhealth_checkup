import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./base";
import { encryptWearableTokens, decryptWearableTokens } from "@/services/EncryptionService";

export interface WearableConnection {
  id: string;
  user_id: string;
  provider: string;
  access_token?: string | null;
  refresh_token?: string | null;
  token_expires_at?: string | null;
  is_active: boolean;
  connected_at?: string | null;
  last_sync_at?: string | null;
  created_at: string;
  updated_at: string;
}

class WearablesApi {
  /**
   * Get all wearable connections for a user
   * Decrypts OAuth tokens after retrieval
   */
  async getWearableConnections(userId: string): Promise<ApiResponse<WearableConnection[]>> {
    const { data, error } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false });

    if (error || !data) {
      return { data: null, error };
    }

    // Decrypt tokens for each connection
    const decryptedConnections = await Promise.all(
      data.map(async (connection) => {
        const decrypted = await decryptWearableTokens(connection);
        return { ...connection, ...decrypted } as WearableConnection;
      })
    );

    return { data: decryptedConnections, error: null };
  }

  /**
   * Get a single wearable connection by provider
   * Decrypts OAuth tokens after retrieval
   */
  async getConnectionByProvider(userId: string, provider: string): Promise<ApiResponse<WearableConnection>> {
    const { data, error } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    const decrypted = await decryptWearableTokens(data);
    return { data: { ...data, ...decrypted } as WearableConnection, error: null };
  }

  /**
   * Create a new wearable connection
   * Encrypts OAuth tokens before storage
   */
  async createConnection(
    connection: Omit<WearableConnection, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<WearableConnection>> {
    // Encrypt sensitive tokens before storage
    const encryptedData = await encryptWearableTokens(connection) as typeof connection;

    const { data, error } = await supabase
      .from('wearable_connections')
      .insert(encryptedData)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    // Return decrypted data for immediate use
    const decrypted = await decryptWearableTokens(data);
    return { data: { ...data, ...decrypted } as WearableConnection, error: null };
  }

  /**
   * Update a wearable connection
   * Encrypts OAuth tokens before storage
   */
  async updateConnection(
    id: string,
    userId: string,
    updates: Partial<WearableConnection>
  ): Promise<ApiResponse<WearableConnection>> {
    const encryptedData = await encryptWearableTokens(updates) as typeof updates;

    const { data, error } = await supabase
      .from('wearable_connections')
      .update(encryptedData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    const decrypted = await decryptWearableTokens(data);
    return { data: { ...data, ...decrypted } as WearableConnection, error: null };
  }

  /**
   * Refresh OAuth tokens for a connection
   * Encrypts new tokens before storage
   */
  async refreshTokens(
    id: string,
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  ): Promise<ApiResponse<WearableConnection>> {
    return this.updateConnection(id, userId, {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: expiresAt,
      last_sync_at: new Date().toISOString(),
    });
  }

  /**
   * Delete a wearable connection
   */
  async deleteConnection(id: string, userId: string): Promise<ApiResponse<null>> {
    const { error } = await supabase
      .from('wearable_connections')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return { data: null, error };
  }

  /**
   * Deactivate a wearable connection without deleting
   */
  async deactivateConnection(id: string, userId: string): Promise<ApiResponse<WearableConnection>> {
    return this.updateConnection(id, userId, { is_active: false });
  }
}

export const wearablesApi = new WearablesApi();
