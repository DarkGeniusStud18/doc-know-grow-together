
/**
 * Utilitaires pour la gestion des profils utilisateur
 */
import { supabase } from '@/integrations/supabase/client';
import { User, toDatabaseRole, toDatabaseSubscriptionStatus } from '../types';

/**
 * Crée un profil utilisateur dans la base de données
 * @param userData - Données de l'utilisateur à créer
 * @returns Promise résolue avec les données du profil créé
 */
export const createUserProfile = async (userData: Partial<User>) => {
  try {
    const profileData = {
      id: userData.id!,
      display_name: userData.displayName!,
      role: toDatabaseRole(userData.role!),
      kyc_status: userData.kycStatus || 'not_submitted',
      profile_image: userData.profileImage || null,
      university: userData.university || null,
      specialty: userData.specialty || null,
      subscription_status: toDatabaseSubscriptionStatus(userData.subscriptionStatus || 'free'),
      subscription_expiry: userData.subscriptionExpiry?.toISOString() || null,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du profil:', error);
      throw error;
    }

    console.log('Profil créé avec succès:', data);
    return data;
  } catch (error) {
    console.error('Erreur dans createUserProfile:', error);
    throw error;
  }
};

/**
 * Met à jour un profil utilisateur existant
 * @param userId - ID de l'utilisateur
 * @param updates - Données à mettre à jour
 * @returns Promise résolue avec les données mises à jour
 */
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const updateData: any = {};
    
    if (updates.displayName) updateData.display_name = updates.displayName;
    if (updates.role) updateData.role = toDatabaseRole(updates.role);
    if (updates.kycStatus) updateData.kyc_status = updates.kycStatus;
    if (updates.profileImage !== undefined) updateData.profile_image = updates.profileImage;
    if (updates.university !== undefined) updateData.university = updates.university;
    if (updates.specialty !== undefined) updateData.specialty = updates.specialty;
    if (updates.subscriptionStatus) updateData.subscription_status = toDatabaseSubscriptionStatus(updates.subscriptionStatus);
    if (updates.subscriptionExpiry !== undefined) {
      updateData.subscription_expiry = updates.subscriptionExpiry?.toISOString() || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }

    console.log('Profil mis à jour avec succès:', data);
    return data;
  } catch (error) {
    console.error('Erreur dans updateUserProfile:', error);
    throw error;
  }
};
