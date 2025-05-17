
/**
 * Utilitaires pour la gestion des profils utilisateur dans l'application
 * Ce fichier contient des fonctions pour télécharger des images, mettre à jour
 * les profils et récupérer les informations des utilisateurs
 */

import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, KycStatus, ProfilesUpdate, isSupabaseResponseError } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';
import { Database } from '@/integrations/supabase/types';

/**
 * Télécharge une image de profil vers Supabase Storage
 * @param file Fichier image à télécharger
 * @param user Utilisateur connecté
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export const uploadProfileImage = async (file: File, user: User): Promise<string | null> => {
  try {
    // Extraction de l'extension du fichier
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 2MB)');
      return null;
    }
    
    // Vérifier le type de fichier
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Format de fichier non supporté (JPG, PNG ou GIF uniquement)');
      return null;
    }
    
    // Télécharger l'image vers le bucket avatars
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) throw uploadError;

    // Obtenir l'URL publique
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image de profil:', error);
    toast.error('Erreur lors du téléchargement de l\'image');
    return null;
  }
};

/**
 * Met à jour le profil utilisateur dans Supabase
 * @param userId ID de l'utilisateur
 * @param updates Données à mettre à jour
 * @returns Succès ou échec de la mise à jour
 */
export const updateUserProfile = async (
  userId: string,
  updates: { 
    display_name?: string; 
    university?: string | null; 
    specialty?: string | null;
    profile_image?: string | null;
  }
): Promise<boolean> => {
  try {
    // Préparation des données pour la mise à jour
    const updateData: Record<string, any> = {};
    
    if (updates.display_name !== undefined) updateData.display_name = updates.display_name;
    if (updates.university !== undefined) updateData.university = updates.university;
    if (updates.specialty !== undefined) updateData.specialty = updates.specialty;
    if (updates.profile_image !== undefined) updateData.profile_image = updates.profile_image;
    
    // Ajout de la date de mise à jour
    updateData.updated_at = new Date().toISOString();
    
    // Requête de mise à jour dans Supabase
    const { error } = await supabase
      .from('profiles')
      .update(updateData as Database['public']['Tables']['profiles']['Update'])
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("Profil mis à jour avec succès");
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    toast.error("Échec de la mise à jour du profil");
    return false;
  }
};

/**
 * Récupère le profil complet d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Profil complet ou null si non trouvé
 */
export const getUserFullProfile = async (userId: string): Promise<User | null> => {
  try {
    // Requête pour récupérer les données du profil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) return null;

    // S'assurer que data n'est pas une erreur
    if (isSupabaseResponseError(data)) {
      throw new Error('Erreur lors de la récupération du profil');
    }
    
    // Conversion des dates en objets Date
    const createdAt = new Date(data.created_at);
    const updatedAt = data.updated_at ? new Date(data.updated_at) : undefined;
    const subscriptionExpiry = data.subscription_expiry ? new Date(data.subscription_expiry) : null;
    
    // Conversion des données en objet User
    return {
      id: data.id,
      email: data.email || '',
      displayName: data.display_name,
      role: data.role as UserRole,
      kycStatus: data.kyc_status as KycStatus,
      profileImage: data.profile_image,
      university: data.university,
      specialty: data.specialty,
      subscriptionStatus: data.subscription_status,
      subscriptionExpiry: subscriptionExpiry,
      createdAt: createdAt,
      updatedAt: updatedAt
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};
