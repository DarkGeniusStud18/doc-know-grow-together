
/**
 * Type guards and validation utilities for Supabase responses
 */
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Type guard to check if a Supabase response has data
 */
export function hasData<T>(response: { data: T | null; error: PostgrestError | null }): response is { data: T; error: null } {
  return response.data !== null && response.error === null;
}

/**
 * Type guard to check if a Supabase response has an error
 */
export function hasError<T>(response: { data: T | null; error: PostgrestError | null }): response is { data: null; error: PostgrestError } {
  return response.error !== null;
}

/**
 * Type guard to validate profile data
 */
export function isValidProfile(data: any): data is { id: string; display_name: string; profile_image?: string } {
  return data && 
         typeof data === 'object' && 
         typeof data.id === 'string' && 
         typeof data.display_name === 'string';
}

/**
 * Type guard to validate switch credentials data
 */
export function isValidSwitchCredentials(data: any): data is { pin_code: string; password: string } {
  return data && 
         typeof data === 'object' && 
         typeof data.pin_code === 'string' && 
         typeof data.password === 'string';
}

/**
 * Type guard to validate user music preferences
 */
export function isValidMusicPreferences(data: any): data is { volume: number; last_played_track?: string } {
  return data && 
         typeof data === 'object' && 
         (typeof data.volume === 'number' || data.volume == null) &&
         (typeof data.last_played_track === 'string' || data.last_played_track == null);
}

/**
 * Safely extract data from Supabase response with type checking
 */
export function extractData<T>(response: { data: T | null; error: PostgrestError | null }): T | null {
  if (hasData(response)) {
    return response.data;
  }
  if (hasError(response)) {
    console.error('Supabase error:', response.error);
  }
  return null;
}
