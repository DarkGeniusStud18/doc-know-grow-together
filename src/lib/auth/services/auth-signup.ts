
// Service pour la gestion de l'inscription des utilisateurs
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, KycStatus } from "../types";

/**
 * Gère le processus d'inscription d'un nouvel utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @param role - Rôle de l'utilisateur (étudiant ou professionnel)
 * @param displayName - Nom d'affichage de l'utilisateur
 * @returns Promise<boolean> - True si l'inscription est réussie, sinon False
 */
export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  displayName: string
): Promise<boolean> => {
  try {
    // Vérification si l'utilisateur existe déjà
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email as string) // Correction: Cast explicite pour éviter l'erreur de type
      .limit(1);
      
    if (existingUsers && existingUsers.length > 0) {
      toast.error("Un compte avec cet email existe déjà");
      return false;
    }

    // Récupération de l'URL de base pour la redirection, sans chemin ni paramètres
    const origin = window.location.origin;
    const redirectTo = `${origin}/email-confirmation`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role: role
        },
        emailRedirectTo: redirectTo
      }
    });
    
    if (error) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
      return false;
    }
    
    if (data.user) {
      // Création du profil utilisateur dans notre base de données
      const now = new Date().toISOString();
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          display_name: displayName,
          role: role,
          kyc_status: 'not_submitted' as KycStatus,
          email: email,
          created_at: now,
          updated_at: now
        });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Erreur lors de la création du profil");
        return false;
      }
      
      // Affichage d'un message toast sur la vérification par email
      toast.success("Inscription réussie!", {
        description: "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail et cliquer sur le lien de vérification pour activer votre compte.",
        duration: 8000, // Afficher plus longtemps pour que l'utilisateur le voie
      });
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error signing up:", error);
    toast.error("Erreur lors de l'inscription", {
      description: error.message || "Veuillez réessayer plus tard."
    });
    return false;
  }
};
