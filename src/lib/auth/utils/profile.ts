
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, UserRole } from "../types";

/**
 * Crée un profil utilisateur dans la base de données
 * @param userId - ID de l'utilisateur
 * @param displayName - Nom d'affichage de l'utilisateur
 * @param email - Email de l'utilisateur
 * @param role - Rôle de l'utilisateur
 * @returns Promise<boolean> - True si la création du profil est réussie
 */
export async function createUserProfileRecord(
  userId: string,
  displayName: string,
  email: string,
  role: UserRole
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: displayName,
        role: role,
        kyc_status: 'not_submitted' as KycStatus,
        email: email,
        created_at: now,
        updated_at: now
      });
    
    if (error) {
      console.error("Error creating profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createUserProfileRecord:", error);
    return false;
  }
}
