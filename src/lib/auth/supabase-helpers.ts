
/**
 * Helper functions for working with Supabase responses and types
 * This file provides utilities to safely handle Supabase query responses
 */

import { Database } from '@/integrations/supabase/types';

// Type aliases for Supabase table types
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type SwitchCredentialsRow = Database['public']['Tables']['switch_credentials']['Row'];

/**
 * Type guard to check if a Supabase response contains valid data
 * @param data - The response data to check
 * @returns true if the data is valid (not an error)
 */
export function isValidSupabaseData<T>(data: T | any): data is T {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  if ('error' in data && data.error !== null) return false;
  return true;
}

/**
 * Type guard to check if a response is a Supabase error
 * @param response - The response to check
 * @returns true if the response is an error
 */
export function isSupabaseError(response: any): boolean {
  return response && typeof response === 'object' && 'error' in response && response.error !== null;
}

/**
 * Safely extract data from a Supabase response
 * @param response - The Supabase response
 * @returns the data if valid, null otherwise
 */
export function extractSupabaseData<T>(response: { data: T | null; error: any }): T | null {
  if (response.error || !response.data) {
    return null;
  }
  return response.data;
}

/**
 * Helper to create a ProfileUpdate object with proper typing
 * @param updates - Partial update data
 * @returns properly typed ProfileUpdate object
 */
export function createProfileUpdate(updates: Partial<ProfileRow>): ProfileUpdate {
  const updateData: ProfileUpdate = {};
  
  if (updates.display_name !== undefined) updateData.display_name = updates.display_name;
  if (updates.university !== undefined) updateData.university = updates.university;
  if (updates.specialty !== undefined) updateData.specialty = updates.specialty;
  if (updates.profile_image !== undefined) updateData.profile_image = updates.profile_image;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.kyc_status !== undefined) updateData.kyc_status = updates.kyc_status;
  if (updates.subscription_status !== undefined) updateData.subscription_status = updates.subscription_status;
  if (updates.subscription_expiry !== undefined) updateData.subscription_expiry = updates.subscription_expiry;
  
  // Always update the updated_at timestamp
  updateData.updated_at = new Date().toISOString();
  
  return updateData;
}
