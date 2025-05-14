
import { supabase } from "@/integrations/supabase/client";
import { EmailCheckResponse } from "./types/validation-types";

/**
 * Vérifie si un utilisateur existe déjà avec l'email spécifié
 * @param email - Email à vérifier
 * @returns Promise<boolean> - true si l'utilisateur existe, false sinon
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // Utilisation du typage explicite pour résoudre l'erreur d'instantiation infinie
    const response = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    // Cast explicite du résultat pour éviter l'erreur de type
    const { data, error } = response as EmailCheckResponse;
      
    if (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
    
    return Boolean(data && data.length > 0);
  } catch (error) {
    console.error("Error in checkUserExists:", error);
    return false;
  }
}
