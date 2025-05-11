
// Service pour la gestion de l'inscription des utilisateurs
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types";
import { checkUserExists } from "../utils/user-validation";
import { createUserProfileRecord } from "../utils/profile";
import { showSignupSuccessMessage, showErrorMessage } from "../utils/notification";

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
    const userExists = await checkUserExists(email);
    if (userExists) {
      showErrorMessage("Un compte avec cet email existe déjà");
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
      showErrorMessage(error.message || "Erreur lors de l'inscription");
      return false;
    }
    
    if (data.user) {
      // Création du profil utilisateur dans notre base de données
      const profileCreated = await createUserProfileRecord(
        data.user.id,
        displayName,
        email,
        role
      );
      
      if (!profileCreated) {
        showErrorMessage("Erreur lors de la création du profil");
        return false;
      }
      
      // Affichage d'un message toast sur la vérification par email
      showSignupSuccessMessage();
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error signing up:", error);
    showErrorMessage("Erreur lors de l'inscription", error.message);
    return false;
  }
};
