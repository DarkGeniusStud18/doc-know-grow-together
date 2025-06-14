
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '@/types/database';

/**
 * Service pour la gestion des préférences utilisateur
 * Fournit des méthodes pour créer, lire, mettre à jour les préférences
 */
export const userPreferencesService = {
  /**
   * Récupère les préférences d'un utilisateur spécifique
   * @param userId - ID de l'utilisateur
   * @returns Préférences utilisateur ou null si non trouvées
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    console.log('UserPreferencesService: Récupération des préférences pour:', userId);
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Ignorer l'erreur PGRST116 (aucun résultat trouvé)
    if (error && error.code !== 'PGRST116') {
      console.error('UserPreferencesService: Erreur lors de la récupération:', error);
      throw error;
    }
    
    console.log('UserPreferencesService: Préférences récupérées:', data);
    return data;
  },

  /**
   * Crée de nouvelles préférences utilisateur
   * @param preferences - Données des préférences à créer
   * @returns Préférences créées
   */
  async createUserPreferences(
    preferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>
  ): Promise<UserPreferences> {
    console.log('UserPreferencesService: Création de nouvelles préférences:', preferences);
    
    const { data, error } = await supabase
      .from('user_preferences')
      .insert([preferences])
      .select()
      .single();

    if (error) {
      console.error('UserPreferencesService: Erreur lors de la création:', error);
      throw error;
    }
    
    console.log('UserPreferencesService: Préférences créées avec succès:', data);
    return data;
  },

  /**
   * Met à jour les préférences d'un utilisateur
   * Utilise upsert pour créer si n'existe pas
   * @param userId - ID de l'utilisateur
   * @param updates - Champs à mettre à jour
   * @returns Préférences mises à jour
   */
  async updateUserPreferences(
    userId: string, 
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    console.log('UserPreferencesService: Mise à jour des préférences:', { userId, updates });
    
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: userId, 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('UserPreferencesService: Erreur lors de la mise à jour:', error);
      throw error;
    }
    
    console.log('UserPreferencesService: Préférences mises à jour avec succès:', data);
    return data;
  }
};
