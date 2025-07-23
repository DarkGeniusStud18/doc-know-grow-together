/**
 * ⏱️ Minuteur d'Étude - Page principale
 * 
 * Fonctionnalités :
 * - Minuteur personnalisable pour sessions d'étude
 * - Suivi en temps réel des sessions
 * - Gestion des notes de session
 * - Statistiques et historique
 * - Interface responsive et intuitive
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Play, Pause, Square, Clock, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Interface pour les sessions d'étude
 */
interface StudySession {
  id: string;
  user_id: string;
  subject?: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour les statistiques d'étude
 */
interface StudyStats {
  total_hours: number;
  avg_session_duration: number;
  most_studied_subject: string;
  sessions_count: number;
}

/**
 * Page principale du minuteur d'étude
 */
const StudyTimer: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // États pour le minuteur
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // États pour les données de session
  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');

  /**
   * Récupération des sessions d'étude
   */
  const { data: sessions = [], refetch: refetchSessions } = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('⏱️ StudyTimer: Récupération des sessions pour l\'utilisateur:', user.id);
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Erreur lors de la récupération des sessions:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} sessions récupérées`);
      return data as StudySession[];
    },
    enabled: !!user
  });

  /**
   * Récupération des statistiques d'étude
   */
  const { data: stats = {
    total_hours: 0,
    avg_session_duration: 0,
    most_studied_subject: 'N/A',
    sessions_count: 0
  }, refetch: refetchStats } = useQuery({
    queryKey: ['study-stats', user?.id],
    queryFn: async () => {
      if (!user) return {
        total_hours: 0,
        avg_session_duration: 0,
        most_studied_subject: 'N/A',
        sessions_count: 0
      };
      
      console.log('📊 StudyTimer: Récupération des statistiques pour l\'utilisateur:', user.id);
      
      const { data, error } = await supabase
        .rpc('get_user_study_stats', {
          p_user_id: user.id,
          p_period: 'week'
        });

      if (error) {
        console.error('❌ Erreur lors de la récupération des statistiques:', error);
        // Retourner des valeurs par défaut en cas d'erreur
        return {
          total_hours: 0,
          avg_session_duration: 0,
          most_studied_subject: 'N/A',
          sessions_count: 0
        };
      }

      // Gérer le cas où RPC retourne un tableau
      const result = Array.isArray(data) ? data[0] : data;
      const statsData = result || {
        total_hours: 0,
        avg_session_duration: 0,
        most_studied_subject: 'N/A',
        sessions_count: 0
      };

      console.log('✅ Statistiques récupérées:', statsData);
      return statsData as StudyStats;
    },
    enabled: !!user
  });

  /**
   * Mutation pour démarrer une session
   */
  const startSessionMutation = useMutation({
    mutationFn: async (sessionData: { subject?: string }) => {
      if (!user) throw new Error('Utilisateur non authentifié');

      console.log('▶️ Démarrage d\'une nouvelle session:', sessionData);

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject: sessionData.subject || null,
          duration_minutes: 0,
          completed: false,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors du démarrage de la session:', error);
        throw error;
      }

      console.log('✅ Session démarrée avec succès:', data);
      return data as StudySession;
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.id);
      setIsRunning(true);
      toast.success('Session d\'étude démarrée !');
    },
    onError: (error) => {
      console.error('❌ Erreur lors du démarrage:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  });

  /**
   * Mutation pour terminer une session
   */
  const endSessionMutation = useMutation({
    mutationFn: async (params: { sessionId: string; durationMinutes: number; notes?: string }) => {
      console.log('⏹️ Fin de session:', params);

      const { error: sessionError } = await supabase
        .from('study_sessions')
        .update({
          duration_minutes: params.durationMinutes,
          completed: true,
          ended_at: new Date().toISOString()
        })
        .eq('id', params.sessionId);

      if (sessionError) {
        console.error('❌ Erreur lors de la mise à jour de la session:', sessionError);
        throw sessionError;
      }

      // Ajouter une note si fournie
      if (params.notes && params.notes.trim()) {
        const { error: noteError } = await supabase
          .from('study_session_notes')
          .insert({
            session_id: params.sessionId,
            content: params.notes.trim()
          });

        if (noteError) {
          console.error('❌ Erreur lors de l\'ajout de la note:', noteError);
          // Ne pas faire échouer la mutation pour une erreur de note
        }
      }

      console.log('✅ Session terminée avec succès');
    },
    onSuccess: () => {
      toast.success('Session terminée et sauvegardée !');
      // Actualiser les données
      refetchSessions();
      refetchStats();
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['study-stats'] });
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la fin de session:', error);
      toast.error('Erreur lors de la sauvegarde de la session');
    }
  });

  /**
   * Effet pour le minuteur
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  /**
   * Formatage du temps en H:MM:SS ou MM:SS
   */
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Gestionnaire de démarrage
   */
  const handleStart = async () => {
    if (!currentSessionId) {
      // Démarrer une nouvelle session
      startSessionMutation.mutate({ subject: subject.trim() || undefined });
    } else {
      // Reprendre une session existante
      setIsRunning(true);
      toast.success('Session reprise !');
    }
  };

  /**
   * Gestionnaire de pause
   */
  const handlePause = () => {
    setIsRunning(false);
    toast.info('Session mise en pause');
  };

  /**
   * Gestionnaire d'arrêt
   */
  const handleStop = async () => {
    if (currentSessionId && time > 0) {
      const durationMinutes = Math.max(1, Math.floor(time / 60)); // Au moins 1 minute
      
      await endSessionMutation.mutateAsync({
        sessionId: currentSessionId,
        durationMinutes,
        notes: note.trim() || undefined
      });
    }
    
    // Réinitialiser l'état
    setIsRunning(false);
    setTime(0);
    setCurrentSessionId(null);
    setSubject('');
    setNote('');
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-8 w-8 text-medical-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Minuteur d'Étude</h1>
          </div>
          <p className="text-gray-600">
            Suivez vos sessions d'étude et améliorez votre productivité
          </p>
        </div>
        
        {/* Minuteur principal */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            {/* Affichage du temps */}
            <div className="text-6xl font-mono font-bold text-medical-teal">
              {formatTime(time)}
            </div>
            
            {/* Champ matière (uniquement si pas de session en cours) */}
            {!currentSessionId && (
              <div className="space-y-2">
                <Input
                  placeholder="Matière d'étude (optionnel)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            )}
            
            {/* Contrôles du minuteur */}
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <Button 
                  onClick={handleStart} 
                  size="lg" 
                  className="flex items-center gap-2"
                  disabled={startSessionMutation.isPending}
                >
                  <Play className="h-5 w-5" />
                  {currentSessionId ? 'Reprendre' : 'Démarrer'}
                </Button>
              ) : (
                <Button 
                  onClick={handlePause} 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-2"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              
              {currentSessionId && (
                <Button 
                  onClick={handleStop} 
                  variant="destructive" 
                  size="lg" 
                  className="flex items-center gap-2"
                  disabled={endSessionMutation.isPending}
                >
                  <Square className="h-5 w-5" />
                  {endSessionMutation.isPending ? 'Sauvegarde...' : 'Arrêter'}
                </Button>
              )}
            </div>
            
            {/* Champ note (uniquement si session en cours) */}
            {currentSessionId && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Note de session (optionnelle)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-medical-teal mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total_hours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Total cette semaine</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-medical-blue mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(stats.avg_session_duration)}min</div>
              <div className="text-sm text-gray-600">Durée moyenne</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-medical-purple mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.sessions_count}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-medical-green mx-auto mb-2" />
              <div className="text-lg font-semibold truncate" title={stats.most_studied_subject}>
                {stats.most_studied_subject}
              </div>
              <div className="text-sm text-gray-600">Matière principale</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sessions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune session d'étude pour le moment.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Démarrez votre première session pour commencer le suivi !
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {session.subject || 'Session d\'étude générale'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(session.started_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} à {new Date(session.started_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {session.duration_minutes} min
                        </div>
                        <Badge 
                          variant={session.completed ? "default" : "secondary"}
                          className={session.completed ? "bg-green-600" : ""}
                        >
                          {session.completed ? 'Terminée' : 'En cours'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudyTimer;
