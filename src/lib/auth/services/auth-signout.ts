
/**
 * Service optimisé et simplifié pour la gestion de la déconnexion des utilisateurs
 * Gère la déconnexion sécurisée, le support des comptes de démonstration et les erreurs.
 */
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fonction principale de déconnexion optimisée et sécurisée
 * @param redirectUrl - URL de redirection après déconnexion (défaut: '/')
 */
export const signOut = async (
  redirectUrl: string = '/'
): Promise<void> => {
  console.log('SignOut: Début de la procédure de déconnexion');

  // Nettoyage pour le compte de démonstration
  if (localStorage.getItem('demoUser')) {
    localStorage.removeItem('demoUser');
    console.log('SignOut: Compte de démonstration nettoyé');
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('SignOut: Erreur lors de la déconnexion Supabase:', error);
      toast.error("Erreur lors de la déconnexion", {
        description: error.message || "Une erreur inattendue est survenue.",
      });
      // Ne pas rediriger en cas d'erreur pour que l'utilisateur puisse voir le message.
      return;
    }

    toast.success("Déconnexion réussie", {
      description: "Vous avez été déconnecté en toute sécurité."
    });
    
    // Délai court pour permettre l'affichage du toast avant la redirection
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 500);

  } catch (error: any) {
    console.error('SignOut: Erreur critique lors de la déconnexion:', error);
    toast.error("Erreur critique de déconnexion", {
      description: error.message || "Une erreur inattendue est survenue."
    });
  }
};
