
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, UserRole } from "../types";

/**
 * Vérifie si un utilisateur existe déjà avec l'email donné
 * 
 * @param email Email à vérifier
 * @returns True si l'utilisateur existe déjà, false sinon
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // Simplifying the type handling to avoid excessive type instantiation
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);
      
    if (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
    
    return data !== null && data.length > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}

export const isUserValid = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    return !!data && !error;
  } catch (error) {
    console.error('Error checking user validity:', error);
    return false;
  }
};

export const isUserVerified = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status')
      .eq('id', userId)
      .single();
      
    return !!data && !error && data.kyc_status === 'verified';
  } catch (error) {
    console.error('Error checking user verification:', error);
    return false;
  }
};

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    return data && !error ? data.role as UserRole : null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const getKycStatus = async (userId: string): Promise<KycStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status')
      .eq('id', userId)
      .single();
      
    return data && !error ? data.kyc_status as KycStatus : null;
  } catch (error) {
    console.error('Error getting KYC status:', error);
    return null;
  }
};
