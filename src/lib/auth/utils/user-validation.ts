
/**
 * user-validation.ts
 *
 * Utilitaires pour la validation des utilisateurs
 * Contient des fonctions pour vérifier l'existence et la validité des utilisateurs
 */

import { supabase } from "@/integrations/supabase/client";

// Fonction pour vérifier l'existence d'un utilisateur par email
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // Note: We don't have direct access to auth.users via the client
    // So we just check profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Exception lors de la vérification de l'utilisateur:", err);
    return false;
  }
};

// Ajouter alias pour maintenir la compatibilité avec le code existant
export const checkUserExistsByEmail = checkUserExists;

// Validation du formulaire d'inscription
export const validateSignupForm = (
  email: string,
  password: string,
  confirmPassword: string
): string[] => {
  const errors: string[] = [];

  // Validation de l'email
  if (!email) {
    errors.push("L'email est requis");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push("Veuillez entrer une adresse email valide");
  }

  // Validation du mot de passe
  if (!password) {
    errors.push("Le mot de passe est requis");
  } else if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
  } else if (!/(?=.*\d)/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  // Validation de la confirmation du mot de passe
  if (password !== confirmPassword) {
    errors.push("Les mots de passe ne correspondent pas");
  }

  return errors;
};

// Validation du formulaire de connexion
export const validateLoginForm = (email: string, password: string): string[] => {
  const errors: string[] = [];

  if (!email) {
    errors.push("L'email est requis");
  }

  if (!password) {
    errors.push("Le mot de passe est requis");
  }

  return errors;
};
