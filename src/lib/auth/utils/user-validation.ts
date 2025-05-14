
import { supabase } from '@/integrations/supabase/client';
import type { EmailCheckResponse } from './types/validation-types';

/**
 * Vérifie si un utilisateur existe déjà avec l'email donné
 * 
 * @param email Email à vérifier
 * @returns True si l'utilisateur existe déjà, false sinon
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const response = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (response.error) {
      console.error("Error checking if user exists:", response.error);
      return false;
    }
    
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}
