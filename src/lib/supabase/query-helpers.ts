
/**
 * Supabase query helper utilities
 * Provides type-safe wrappers for common Supabase operations
 */
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type aliases for better readability
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type SwitchCredentialsRow = Database['public']['Tables']['switch_credentials']['Row'];

/**
 * Type-safe profile update with proper Supabase types
 */
export const updateProfile = async (userId: string, updates: Partial<ProfileRow>) => {
  const updateData: ProfileUpdate = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  return await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);
};

/**
 * Type-safe profile fetch with proper error handling
 */
export const getProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
};

/**
 * Type-safe switch credentials fetch
 */
export const getSwitchCredentials = async () => {
  return await supabase
    .from('switch_credentials')
    .select('pin_code, password')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
};

/**
 * Helper to check if Supabase response has data
 */
export const hasData = <T>(response: { data: T | null; error: any }): response is { data: T; error: null } => {
  return response.data !== null && response.error === null;
};
