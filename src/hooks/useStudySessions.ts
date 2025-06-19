import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { studySessionService } from '@/lib/database/studySessions';
import { StudySession, StudySessionNote } from '@/types/database';
import { toast } from 'sonner';
import { useRealtimeSync } from './useRealtimeSync';

/**
 * Hook personnalisé optimisé pour la gestion des sessions d'étude
 * Fournit un cache local et une synchronisation en temps réel
 * Gère le cycle de vie complet des sessions d'étude avec des statistiques
 * 
 * @returns Objet contenant les sessions, statistiques et fonctions de gestion
 */
export const useStudySessions = () => {
  const { user } = useAuth();
  
  // États locaux pour la gestion des sessions d'étude
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les statistiques utilisateur optimisées
  const [stats, setStats] = useState({
    total_hours: 0,
    avg_session_duration: 0,
    most_studied_subject: 'N/A',
    sessions_count: 0
  });

  /**
   * Fonction optimisée pour charger les sessions d'étude
   * Utilise Promise.allSettled pour éviter l'échec complet en cas d'erreur partielle
   */
  const loadSessions = async () => {
    if (!user) {
      console.log('StudySessions: Aucun utilisateur connecté, abandon du chargement');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('StudySessions: Chargement des sessions pour l\'utilisateur:', user.id);
      
      // Chargement parallèle optimisé avec gestion d'erreur individuelle
      const [sessionsResult, statsResult] = await Promise.allSettled([
        studySessionService.getStudySessions(user.id),
        studySessionService.getUserStats(user.id)
      ]);
      
      // Traitement des résultats avec gestion d'erreur granulaire
      if (sessionsResult.status === 'fulfilled') {
        setSessions(sessionsResult.value);
        console.log('StudySessions: Sessions chargées avec succès:', sessionsResult.value.length);
      } else {
        console.error('StudySessions: Erreur lors du chargement des sessions:', sessionsResult.reason);
        toast.error('Erreur lors du chargement des sessions d\'étude');
      }
      
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
        console.log('StudySessions: Statistiques chargées avec succès');
      } else {
        console.warn('StudySessions: Erreur lors du chargement des statistiques:', statsResult.reason);
        // Les statistiques ne sont pas critiques, on continue sans elles
      }
      
    } catch (error) {
      console.error('StudySessions: Erreur inattendue lors du chargement:', error);
      setError('Erreur lors du chargement des données');
      toast.error('Erreur lors du chargement des sessions d\'étude');
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial avec dépendance sur l'utilisateur
  useEffect(() => {
    loadSessions();
  }, [user]);

  // Synchronisation en temps réel pour les mises à jour automatiques
  useRealtimeSync('study_sessions', loadSessions);

  /**
   * Démarre une nouvelle session d'étude avec validation
   * @param subject - Matière d'étude (optionnel)
   * @returns Session créée ou undefined en cas d'erreur
   */
  const startSession = async (subject?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour démarrer une session');
      return;
    }

    try {
      console.log('StudySessions: Démarrage d\'une nouvelle session', { subject, userId: user.id });
      
      const newSession = await studySessionService.createStudySession({
        user_id: user.id,
        subject: subject || null,
        duration_minutes: 0,
        completed: false,
        started_at: new Date().toISOString()
      });
      
      // Mise à jour optimiste de l'état local
      setSessions(prev => [newSession, ...prev]);
      console.log('StudySessions: Session créée avec succès:', newSession.id);
      toast.success('Session d\'étude démarrée');
      
      return newSession;
    } catch (error) {
      console.error('StudySessions: Erreur lors du démarrage de session:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  /**
   * Termine une session d'étude avec validation de durée
   * @param sessionId - ID de la session à terminer
   * @param durationMinutes - Durée de la session en minutes
   * @returns Session mise à jour ou undefined en cas d'erreur
   */
  const endSession = async (sessionId: string, durationMinutes: number) => {
    // Validation de la durée
    if (durationMinutes < 0) {
      toast.error('La durée de session ne peut pas être négative');
      return;
    }

    try {
      console.log('StudySessions: Fin de session', { sessionId, durationMinutes });
      
      const updatedSession = await studySessionService.updateStudySession(sessionId, {
        duration_minutes: durationMinutes,
        completed: true,
        ended_at: new Date().toISOString()
      });
      
      // Mise à jour optimiste de l'état local
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? updatedSession : session
      ));
      
      console.log('StudySessions: Session terminée avec succès');
      toast.success(`Session terminée (${durationMinutes} minutes)`);
      
      // Rechargement des statistiques après modification
      try {
        const newStats = await studySessionService.getUserStats(user?.id || '');
        setStats(newStats);
      } catch (statsError) {
        console.warn('StudySessions: Erreur lors de la mise à jour des statistiques:', statsError);
      }
      
      return updatedSession;
    } catch (error) {
      console.error('StudySessions: Erreur lors de la fin de session:', error);
      toast.error('Erreur lors de la fin de session');
    }
  };

  /**
   * Ajoute une note à une session d'étude avec validation
   * @param sessionId - ID de la session
   * @param content - Contenu de la note
   */
  const addNote = async (sessionId: string, content: string) => {
    // Validation du contenu
    if (!content.trim()) {
      toast.error('Le contenu de la note ne peut pas être vide');
      return;
    }

    try {
      console.log('StudySessions: Ajout d\'une note à la session:', sessionId);
      
      await studySessionService.addSessionNote({ 
        session_id: sessionId, 
        content: content.trim() 
      });
      
      console.log('StudySessions: Note ajoutée avec succès');
      toast.success('Note ajoutée à la session');
    } catch (error) {
      console.error('StudySessions: Erreur lors de l\'ajout de note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  /**
   * Supprime une session d'étude avec confirmation
   * @param sessionId - ID de la session à supprimer
   */
  const deleteSession = async (sessionId: string) => {
    try {
      console.log('StudySessions: Suppression de la session:', sessionId);
      
      await studySessionService.deleteStudySession(sessionId);
      
      // Mise à jour optimiste de l'état local
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      console.log('StudySessions: Session supprimée avec succès');
      toast.success('Session supprimée');
      
      // Rechargement des statistiques après suppression
      if (user) {
        try {
          const newStats = await studySessionService.getUserStats(user.id);
          setStats(newStats);
        } catch (statsError) {
          console.warn('StudySessions: Erreur lors de la mise à jour des statistiques:', statsError);
        }
      }
      
    } catch (error) {
      console.error('StudySessions: Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la session');
    }
  };

  return {
    // Données d'état
    sessions,
    stats,
    isLoading,
    error,
    
    // Actions disponibles
    startSession,
    endSession,
    addNote,
    deleteSession,
    refreshSessions: loadSessions
  };
};
