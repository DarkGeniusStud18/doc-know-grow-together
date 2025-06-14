
/**
 * Utilitaires d'aide pour les requêtes Supabase avec sécurité renforcée
 * Fournit des wrappers type-safe pour les opérations Supabase communes
 * Inclut la gestion d'erreurs et la validation des données
 */
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Alias de types pour une meilleure lisibilité et maintenance
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Met à jour un profil utilisateur de manière type-safe avec validation
 * @param userId - ID de l'utilisateur à mettre à jour
 * @param updates - Champs à mettre à jour avec validation
 * @returns Réponse Supabase avec le profil mis à jour ou erreur
 */
export const updateProfile = async (userId: string, updates: Partial<ProfileRow>) => {
  console.log('QueryHelpers: Mise à jour du profil pour l\'utilisateur:', userId, updates);
  
  // Validation des données d'entrée
  if (!userId || typeof userId !== 'string') {
    throw new Error('ID utilisateur invalide fourni');
  }

  // Construction des données de mise à jour avec horodatage
  const updateData: ProfileUpdate = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  try {
    const result = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
      
    console.log('QueryHelpers: Résultat de la mise à jour du profil:', result.error ? 'erreur' : 'succès');
    
    if (result.error) {
      handleSupabaseError(result.error, 'mise à jour du profil');
    }
    
    return result;
  } catch (error) {
    console.error('QueryHelpers: Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Récupère un profil utilisateur avec gestion d'erreur et validation appropriées
 * @param userId - ID de l'utilisateur dont récupérer le profil
 * @returns Réponse Supabase avec le profil ou null si inexistant
 */
export const getProfile = async (userId: string) => {
  console.log('QueryHelpers: Récupération du profil pour l\'utilisateur:', userId);
  
  // Validation de l'ID utilisateur
  if (!userId || typeof userId !== 'string') {
    throw new Error('ID utilisateur invalide fourni pour la récupération du profil');
  }
  
  try {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    console.log('QueryHelpers: Profil récupéré:', result.error ? 'erreur' : 'succès');
    
    if (result.error) {
      handleSupabaseError(result.error, 'récupération du profil');
    }
    
    return result;
  } catch (error) {
    console.error('QueryHelpers: Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

/**
 * Récupère les identifiants de changement de rôle depuis la base de données
 * @returns Réponse Supabase avec les identifiants ou erreur
 */
export const getSwitchCredentials = async () => {
  console.log('QueryHelpers: Récupération des identifiants de changement de rôle');
  
  try {
    const result = await supabase
      .from('switch_credentials')
      .select('pin_code, password')
      .limit(1)
      .maybeSingle();
      
    console.log('QueryHelpers: Identifiants récupérés:', result.error ? 'erreur' : 'succès');
    
    if (result.error) {
      handleSupabaseError(result.error, 'récupération des identifiants');
    }
    
    return result;
  } catch (error) {
    console.error('QueryHelpers: Erreur lors de la récupération des identifiants:', error);
    throw error;
  }
};

/**
 * Vérifie si une réponse Supabase contient des données valides
 * Type guard pour assurer la sécurité des types
 * 
 * @param response - Réponse Supabase à vérifier
 * @returns Guard de type pour vérifier la présence de données valides
 */
export const hasData = <T>(
  response: { data: T | null; error: any }
): response is { data: T; error: null } => {
  const isValid = response.data !== null && response.error === null;
  console.log('QueryHelpers: Validation des données:', isValid ? 'valide' : 'invalide');
  return isValid;
};

/**
 * Gère les erreurs Supabase de manière standardisée avec logging détaillé
 * @param error - Erreur Supabase à traiter
 * @param context - Contexte de l'erreur pour le débogage et les logs
 */
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`QueryHelpers: Erreur dans ${context}:`, error);
  
  // Logging spécifique selon le type d'erreur pour un débogage efficace
  if (error?.code) {
    console.error(`QueryHelpers: Code d'erreur Supabase: ${error.code}`);
  }
  
  if (error?.message) {
    console.error(`QueryHelpers: Message d'erreur: ${error.message}`);
  }
  
  if (error?.details) {
    console.error(`QueryHelpers: Détails de l'erreur: ${error.details}`);
  }
  
  // Construction d'un message d'erreur utilisateur-friendly
  const userMessage = error?.message || 'Erreur inconnue lors de l\'opération de base de données';
  
  // Lancement d'une erreur formatée pour l'application
  throw new Error(`Erreur ${context}: ${userMessage}`);
};

/**
 * Crée un profil utilisateur avec validation complète des données
 * @param userId - ID de l'utilisateur
 * @param profileData - Données du profil à créer (display_name requis)
 * @returns Réponse Supabase avec le profil créé
 */
export const createProfile = async (
  userId: string, 
  profileData: Omit<ProfileInsert, 'id' | 'created_at' | 'updated_at'> & { display_name: string }
) => {
  console.log('QueryHelpers: Création d\'un nouveau profil pour:', userId);
  
  // Validation des données d'entrée
  if (!userId) {
    throw new Error('ID utilisateur requis pour la création du profil');
  }

  if (!profileData.display_name) {
    throw new Error('Le nom d\'affichage est requis pour créer un profil');
  }

  try {
    // Construction des données d'insertion avec horodatage automatique
    const insertData: ProfileInsert = {
      id: userId,
      display_name: profileData.display_name,
      email: profileData.email,
      role: profileData.role || 'student',
      kyc_status: profileData.kyc_status || 'not_submitted',
      subscription_status: profileData.subscription_status || 'free',
      university: profileData.university,
      specialty: profileData.specialty,
      profile_image: profileData.profile_image,
      subscription_expiry: profileData.subscription_expiry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await supabase
      .from('profiles')
      .insert(insertData)
      .select()
      .single();

    console.log('QueryHelpers: Profil créé:', result.error ? 'erreur' : 'succès');
    
    if (result.error) {
      handleSupabaseError(result.error, 'création du profil');
    }
    
    return result;
  } catch (error) {
    console.error('QueryHelpers: Erreur lors de la création du profil:', error);
    throw error;
  }
};
