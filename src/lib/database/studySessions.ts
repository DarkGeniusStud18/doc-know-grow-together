
import { supabase } from '@/integrations/supabase/client';
import { StudySession, StudySessionNote } from '@/types/database';
import { handleSupabaseError } from '@/lib/supabase/query-helpers';

/**
 * Service pour la gestion des sessions d'étude
 * Fournit des méthodes CRUD et des statistiques pour les sessions d'étude
 */
export const studySessionService = {
  /**
   * Récupère toutes les sessions d'étude d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Liste des sessions d'étude triées par date de création
   */
  async getStudySessions(userId: string): Promise<StudySession[]> {
    console.log('StudySessionService: Récupération des sessions pour l\'utilisateur:', userId);
    
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError(error, 'récupération des sessions d\'étude');
      }
      
      console.log('StudySessionService: Sessions récupérées:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('StudySessionService: Erreur lors de la récupération:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle session d'étude
   * @param session - Données de la session à créer
   * @returns Session d'étude créée
   */
  async createStudySession(
    session: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>
  ): Promise<StudySession> {
    console.log('StudySessionService: Création d\'une nouvelle session:', session);
    
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([session])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'création de session d\'étude');
      }
      
      console.log('StudySessionService: Session créée avec succès:', data);
      return data;
    } catch (error) {
      console.error('StudySessionService: Erreur lors de la création:', error);
      throw error;
    }
  },

  /**
   * Met à jour une session d'étude existante
   * @param id - ID de la session à mettre à jour
   * @param updates - Champs à mettre à jour
   * @returns Session d'étude mise à jour
   */
  async updateStudySession(
    id: string, 
    updates: Partial<StudySession>
  ): Promise<StudySession> {
    console.log('StudySessionService: Mise à jour de la session:', id, updates);
    
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'mise à jour de session d\'étude');
      }
      
      console.log('StudySessionService: Session mise à jour avec succès:', data);
      return data;
    } catch (error) {
      console.error('StudySessionService: Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  /**
   * Supprime une session d'étude
   * @param id - ID de la session à supprimer
   */
  async deleteStudySession(id: string): Promise<void> {
    console.log('StudySessionService: Suppression de la session:', id);
    
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        handleSupabaseError(error, 'suppression de session d\'étude');
      }
      
      console.log('StudySessionService: Session supprimée avec succès');
    } catch (error) {
      console.error('StudySessionService: Erreur lors de la suppression:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques d'étude d'un utilisateur pour une période donnée
   * @param userId - ID de l'utilisateur
   * @param period - Période pour les statistiques ('day', 'week', 'month')
   * @returns Statistiques d'étude détaillées
   */
  async getUserStats(
    userId: string, 
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    total_hours: number;
    avg_session_duration: number;
    most_studied_subject: string;
    sessions_count: number;
  }> {
    console.log('StudySessionService: Récupération des statistiques pour:', userId, period);
    
    try {
      const { data, error } = await supabase
        .rpc('get_user_study_stats', { 
          p_user_id: userId,
          p_period: period 
        });

      if (error) {
        handleSupabaseError(error, 'récupération des statistiques d\'étude');
      }
      
      // Gestion de la réponse (peut être un tableau ou un objet)
      const result = Array.isArray(data) ? data[0] : data;
      
      const stats = result || {
        total_hours: 0,
        avg_session_duration: 0,
        most_studied_subject: 'N/A',
        sessions_count: 0
      };
      
      console.log('StudySessionService: Statistiques récupérées:', stats);
      return stats;
    } catch (error) {
      console.error('StudySessionService: Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  /**
   * Ajoute une note à une session d'étude
   * @param note - Données de la note à ajouter
   * @returns Note de session créée
   */
  async addSessionNote(
    note: Omit<StudySessionNote, 'id' | 'created_at' | 'updated_at'>
  ): Promise<StudySessionNote> {
    console.log('StudySessionService: Ajout d\'une note à la session:', note);
    
    try {
      const { data, error } = await supabase
        .from('study_session_notes')
        .insert([note])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'ajout de note de session');
      }
      
      console.log('StudySessionService: Note ajoutée avec succès:', data);
      return data;
    } catch (error) {
      console.error('StudySessionService: Erreur lors de l\'ajout de note:', error);
      throw error;
    }
  }
};
