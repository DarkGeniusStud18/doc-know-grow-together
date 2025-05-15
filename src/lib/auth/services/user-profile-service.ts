
/**
 * Service pour gérer les profils utilisateurs dans Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus } from "../types";
import { toast } from "@/components/ui/sonner";

/**
 * Récupère un profil utilisateur par son ID
 * @param userId ID de l'utilisateur
 * @returns Profil utilisateur ou null si non trouvé
 */
export const getUserProfileById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      email: data.email || '',
      displayName: data.display_name,
      role: data.role as UserRole,
      kycStatus: data.kyc_status as KycStatus,
      profileImage: data.profile_image,
      university: data.university,
      specialty: data.specialty,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return null;
  }
};

/**
 * Met à jour un profil utilisateur
 * @param userId ID de l'utilisateur
 * @param updates Données à mettre à jour
 * @returns Succès ou échec de la mise à jour
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    displayName?: string;
    university?: string | null;
    specialty?: string | null;
    profileImage?: string | null;
  }
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
    if (updates.university !== undefined) updateData.university = updates.university;
    if (updates.specialty !== undefined) updateData.specialty = updates.specialty;
    if (updates.profileImage !== undefined) updateData.profile_image = updates.profileImage;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("Profil mis à jour avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    toast.error("Erreur lors de la mise à jour du profil");
    return false;
  }
};

/**
 * Récupère tous les profils utilisateurs
 * @returns Liste des profils utilisateurs
 */
export const getAllUserProfiles = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('display_name');
      
    if (error) throw error;
    
    return data.map(profile => ({
      id: profile.id,
      email: profile.email || '',
      displayName: profile.display_name,
      role: profile.role as UserRole,
      kycStatus: profile.kyc_status as KycStatus,
      profileImage: profile.profile_image,
      university: profile.university,
      specialty: profile.specialty,
      createdAt: new Date(profile.created_at)
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return [];
  }
};
