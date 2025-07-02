
/**
 * ⏱️ Minuteur d'Étude - Version mobile responsive corrigée
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

interface StudyStats {
  total_hours: number;
  avg_session_duration: number;
  most_studied_subject: string;
  sessions_count: number;
}

const StudyTimer: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');

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

  const { data: stats = {
    total_hours: 0,
    avg_session_duration: 0,
    most_studied_subject: 'N/A',
    sessions_count: 0
  } } = useQuery({
    queryKey: ['study-stats', user?.id],
    queryFn: async () => {
      if (!user) return {
        total_hours: 0,
        avg_session_duration: 0,
        most_studied_subject: 'N/A',
        sessions_count: 0
      };
      
      console.log('📊 StudyTimer: Récupération des statistiques');
      
      const { data, error } = await supabase
        .rpc('get_user_study_stats', {
          p_user_id: user.id,
          p_period: 'week'
        });

      if (error) {
        console.error('❌ Erreur statistiques:', error);
        return {
          total_hours: 0,
          avg_session_duration: 0,
          most_studied_subject: 'N/A',
          sessions_count: 0
        };
      }

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

  const startSessionMutation = useMutation({
    mutationFn: async (sessionData: { subject?: string }) => {
      if (!user) throw new Error('Utilisateur non authentifié');

      console.log('▶️ Démarrage session:', sessionData);

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
        console.error('❌ Erreur démarrage session:', error);
        throw error;
      }

      console.log('✅ Session démarrée:', data);
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
        console.error('❌ Erreur fin session:', sessionError);
        throw sessionError;
      }

      if (params.notes && params.notes.trim()) {
        const { error: noteError } = await supabase
          .from('study_session_notes')
          .insert({
            session_id: params.sessionId,
            content: params.notes.trim()
          });

        if (noteError) {
          console.error('❌ Erreur note:', noteError);
        }
      }

      console.log('✅ Session terminée');
    },
    onSuccess: () => {
      toast.success('Session terminée et sauvegardée !');
      refetchSessions();
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['study-stats'] });
    },
    onError: (error) => {
      console.error('❌ Erreur fin session:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  });

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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!currentSessionId) {
      startSessionMutation.mutate({ subject: subject.trim() || undefined });
    } else {
      setIsRunning(true);
      toast.success('Session reprise !');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    toast.info('Session mise en pause');
  };

  const handleStop = async () => {
    if (currentSessionId && time > 0) {
      const durationMinutes = Math.max(1, Math.floor(time / 60));
      
      await endSessionMutation.mutateAsync({
        sessionId: currentSessionId,
        durationMinutes,
        notes: note.trim() || undefined
      });
    }
    
    setIsRunning(false);
    setTime(0);
    setCurrentSessionId(null);
    setSubject('');
    setNote('');
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-4 max-w-4xl">
        {/* En-tête responsive */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Minuteur d'Étude</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Suivez vos sessions d'étude et améliorez votre productivité
          </p>
        </div>
        
        {/* Minuteur principal responsive */}
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
            {/* Affichage du temps */}
            <div className="text-4xl sm:text-6xl font-mono font-bold text-medical-teal">
              {formatTime(time)}
            </div>
            
            {/* Champ matière */}
            {!currentSessionId && (
              <div className="space-y-2">
                <Input
                  placeholder="Matière d'étude (optionnel)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isRunning}
                  className="text-center"
                />
              </div>
            )}
            
            {/* Contrôles responsive */}
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {!isRunning ? (
                <Button 
                  onClick={handleStart} 
                  size="lg" 
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                  disabled={startSessionMutation.isPending}
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  {currentSessionId ? 'Reprendre' : 'Démarrer'}
                </Button>
              ) : (
                <Button 
                  onClick={handlePause} 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  Pause
                </Button>
              )}
              
              {currentSessionId && (
                <Button 
                  onClick={handleStop} 
                  variant="destructive" 
                  size="lg" 
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                  disabled={endSessionMutation.isPending}
                >
                  <Square className="h-4 w-4 sm:h-5 sm:w-5" />
                  {endSessionMutation.isPending ? 'Sauvegarde...' : 'Arrêter'}
                </Button>
              )}
            </div>
            
            {/* Champ note */}
            {currentSessionId && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Note de session (optionnelle)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-medical-teal mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.total_hours.toFixed(1)}h</div>
              <div className="text-xs sm:text-sm text-gray-600">Total semaine</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{Math.round(stats.avg_session_duration)}min</div>
              <div className="text-xs sm:text-sm text-gray-600">Durée moy.</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-medical-purple mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.sessions_count}</div>
              <div className="text-xs sm:text-sm text-gray-600">Sessions</div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-4 text-center">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-medical-green mx-auto mb-2" />
              <div className="text-sm sm:text-lg font-semibold truncate" title={stats.most_studied_subject}>
                {stats.most_studied_subject}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Matière principale</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions récentes responsive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              Sessions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune session d'étude pour le moment.</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Démarrez votre première session !
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2 sm:gap-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {session.subject || 'Session d\'étude générale'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
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
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">
                          {session.duration_minutes} min
                        </div>
                      </div>
                      <Badge 
                        variant={session.completed ? "default" : "secondary"}
                        className={session.completed ? "bg-green-600 text-xs" : "text-xs"}
                      >
                        {session.completed ? 'Terminée' : 'En cours'}
                      </Badge>
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
