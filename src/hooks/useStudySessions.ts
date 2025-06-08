
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studySessionService } from '@/lib/database/studySessions';
import { StudySession, StudySessionNote } from '@/types/database';
import { toast } from 'sonner';
import { useRealtimeSync } from './useRealtimeSync';

export const useStudySessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total_hours: 0,
    avg_session_duration: 0,
    most_studied_subject: 'N/A',
    sessions_count: 0
  });

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [sessionsData, statsData] = await Promise.all([
        studySessionService.getStudySessions(user.id),
        studySessionService.getUserStats(user.id)
      ]);
      setSessions(sessionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading study sessions:', error);
      toast.error('Erreur lors du chargement des sessions d\'étude');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  // Real-time synchronization
  useRealtimeSync('study_sessions', loadSessions);

  const startSession = async (subject?: string) => {
    if (!user) return;

    try {
      const newSession = await studySessionService.createStudySession({
        user_id: user.id,
        subject,
        duration_minutes: 0,
        completed: false,
        started_at: new Date().toISOString()
      });
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  const endSession = async (sessionId: string, durationMinutes: number) => {
    try {
      const updatedSession = await studySessionService.updateStudySession(sessionId, {
        duration_minutes: durationMinutes,
        completed: true,
        ended_at: new Date().toISOString()
      });
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? updatedSession : session
      ));
      toast.success('Session terminée avec succès');
      return updatedSession;
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Erreur lors de la fin de session');
    }
  };

  const addNote = async (sessionId: string, content: string) => {
    try {
      await studySessionService.addSessionNote({ session_id: sessionId, content });
      toast.success('Note ajoutée');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  return {
    sessions,
    stats,
    isLoading,
    startSession,
    endSession,
    addNote,
    refreshSessions: loadSessions
  };
};
