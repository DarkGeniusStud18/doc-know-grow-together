
/**
 * Profile data service utilities
 */
import { User, UserRole, KycStatus } from '@/lib/auth/types';
import { updateProfile, getProfile, hasData } from '@/lib/supabase/query-helpers';
import { toast } from '@/components/ui/sonner';

/**
 * Updates user profile with type safety
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    display_name?: string;
    university?: string | null;
    specialty?: string | null;
    profile_image?: string | null;
    role?: UserRole;
  }
): Promise<boolean> => {
  try {
    console.log('Mise à jour du profil pour l\'utilisateur:', userId, updates);
    
    const { error } = await updateProfile(userId, updates);
    
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
 * Fetches complete user profile
 */
export const getUserFullProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log('Récupération du profil complet pour l\'utilisateur:', userId);
    
    const response = await getProfile(userId);
    
    if (response.error) {
      console.error('Erreur lors de la récupération du profil:', response.error);
      throw response.error;
    }
    
    if (!hasData(response)) {
      console.log('Aucun profil trouvé pour l\'utilisateur:', userId);
      return null;
    }

    const data = response.data;
    
    // Convert and format data to User object
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
      subscriptionExpiry: data.subscription_expiry ? new Date(data.subscription_expiry) : null,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
    
    console.log('Profil récupéré avec succès:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};
