
// Service pour la gestion de la déconnexion des utilisateurs
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Déconnecte l'utilisateur actuellement connecté
 * @param redirectUrl - URL de redirection après déconnexion (optionnel)
 * @returns Promise<void>
 */
export const signOut = async (redirectUrl: string = '/'): Promise<void> => {
  try {
    console.log("Signing out, will redirect to:", redirectUrl);
    
    // Check if it's a demo user
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      localStorage.removeItem('demoUser');
      toast.success("Déconnexion réussie");
      
      // Redirection vers la page d'accueil par défaut
      window.location.href = redirectUrl;
      return;
    }
    
    // Normal Supabase signout
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Déconnexion réussie");
    
    // Redirection vers la page d'accueil par défaut
    window.location.href = redirectUrl;
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error("Erreur lors de la déconnexion", {
      description: error.message || "Veuillez réessayer plus tard."
    });
  }
};
