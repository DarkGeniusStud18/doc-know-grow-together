
// Service pour la gestion de la déconnexion des utilisateurs
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Déconnecte l'utilisateur actuellement connecté
 * @returns Promise<void>
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Déconnexion réussie");
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error("Erreur lors de la déconnexion", {
      description: error.message || "Veuillez réessayer plus tard."
    });
  }
};
