
// Service pour la gestion des profils utilisateurs
import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";

/**
 * Crée un profil utilisateur dans la base de données
 * @param user - Données de l'utilisateur
 * @returns Promise avec les données du profil créé
 */
export const createUserProfile = async (user: User) => {
  // Conversion de la date en format ISO string pour Supabase
  const createdAt = user.createdAt.toISOString();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      display_name: user.displayName,
      role: user.role,
      kyc_status: user.kycStatus,
      created_at: createdAt,
      profile_image: user.profileImage || null,
      university: user.university || null,
      specialty: user.specialty || null,
    });

  if (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }

  return data;
};
