
/**
 * Utilitaires pour la gestion des profils utilisateur dans l'application
 * Ce fichier contient des fonctions pour télécharger des images, mettre à jour
 * les profils et récupérer les informations des utilisateurs
 */

import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, KycStatus } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';
import { ProfileUpdate, createProfileUpdate, isValidSupabaseData } from '@/lib/auth/supabase-helpers';

/**
 * Télécharge une image de profil vers Supabase Storage
 * @param file - Fichier image à télécharger
 * @param user - Utilisateur connecté pour lequel télécharger l'image
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export const uploadProfileImage = async (file: File, user: User): Promise<string | null> => {
  try {
    console.log('Début du téléchargement de l\'image de profil pour l\'utilisateur:', user.id);
    
    // Extraction de l'extension du fichier à partir du nom
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;
    
    // Vérification de la taille du fichier (maximum 2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.error('Fichier trop volumineux:', file.size);
      toast.error('Le fichier est trop volumineux (max 2MB)');
      return null;
    }
    
    // Vérification du type de fichier (formats autorisés)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Type de fichier non supporté:', file.type);
      toast.error('Format de fichier non supporté (JPG, PNG ou GIF uniquement)');
      return null;
    }
    
    // Téléchargement de l'image vers le bucket avatars de Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false // Ne pas écraser si le fichier existe déjà
      });
    
    if (uploadError) {
      console.error('Erreur lors du téléchargement:', uploadError);
      throw uploadError;
    }

    // Obtention de l'URL publique du fichier téléchargé
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('Image téléchargée avec succès:', data?.publicUrl);
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image de profil:', error);
    toast.error('Erreur lors du téléchargement de l\'image');
    return null;
  }
};

/**
 * Met à jour le profil utilisateur dans Supabase
 * @param userId - ID de l'utilisateur à mettre à jour
 * @param updates - Données à mettre à jour dans le profil
 * @returns Succès ou échec de la mise à jour
 */
export const updateUserProfile = async (
  userId: string,
  updates: { 
    /** Nouveau nom d'affichage (optionnel) */
    display_name?: string; 
    /** Nouvelle université (optionnelle, peut être null) */
    university?: string | null; 
    /** Nouvelle spécialité (optionnelle, peut être null) */
    specialty?: string | null;
    /** Nouvelle image de profil (optionnelle, peut être null) */
    profile_image?: string | null;
  }
): Promise<boolean> => {
  try {
    console.log('Mise à jour du profil pour l\'utilisateur:', userId, updates);
    
    // Utilisation de l'helper pour créer les données de mise à jour
    const updateData = createProfileUpdate(updates);
    
    // Exécution de la requête de mise à jour dans Supabase
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
    
    console.log('Profil mis à jour avec succès');
    toast.success("Profil mis à jour avec succès");
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    toast.error("Échec de la mise à jour du profil");
    return false;
  }
};

/**
 * Récupère le profil complet d'un utilisateur depuis Supabase
 * @param userId - ID de l'utilisateur dont récupérer le profil
 * @returns Profil complet formaté ou null si non trouvé/erreur
 */
export const getUserFullProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log('Récupération du profil complet pour l\'utilisateur:', userId);
    
    // Requête pour récupérer toutes les données du profil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // maybeSingle() pour éviter les erreurs si aucun résultat
      
    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
    
    // Vérification que des données ont été trouvées et qu'elles sont valides
    if (!data || !isValidSupabaseData(data)) {
      console.log('Aucun profil trouvé ou données invalides pour l\'utilisateur:', userId);
      return null;
    }
    
    // Conversion des dates string en objets Date avec vérification
    const createdAt = data.created_at ? new Date(data.created_at) : new Date();
    const updatedAt = data.updated_at ? new Date(data.updated_at) : undefined;
    const subscriptionExpiry = data.subscription_expiry ? new Date(data.subscription_expiry) : null;
    
    // Conversion et formatage des données en objet User
    const userProfile: User = {
      id: data.id,
      email: data.email || '',
      displayName: data.display_name,
      role: data.role as UserRole,
      kycStatus: data.kyc_status as KycStatus,
      profileImage: data.profile_image || undefined,
      university: data.university || undefined,
      specialty: data.specialty || undefined,
      subscriptionStatus: data.subscription_status as any,
      subscriptionExpiry: subscriptionExpiry,
      createdAt: createdAt,
      updatedAt: updatedAt
    };
    
    console.log('Profil récupéré avec succès:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};
