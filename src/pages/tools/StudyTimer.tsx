
/**
 * ⏱️ Chronomètre d'Étude - Version Mobile Responsive Corrigée
 * 
 * Fonctionnalités principales :
 * - Chronomètre avec pause/reprise
 * - Suivi des sessions d'étude par matière
 * - Statistiques détaillées
 * - Sauvegarde automatique des données
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Play, Pause, Square, BookOpen, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
}

const StudyTimer: React.FC = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(0); // Temps en secondes
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  // Chronomètre principal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Charger les sessions existantes
  useEffect(() => {
    if (user) {
      loadStudySessions();
    }
  }, [user]);

  /**
   * 📊 Charger les sessions d'étude de l'utilisateur
   */
  const loadStudySessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Erreur lors du chargement des sessions:', error);
        return;
      }

      if (data) {
        const formattedSessions: StudySession[] = data.map(session => ({
          id: session.id,
          subject: session.subject || 'Matière non spécifiée',
          duration: session.duration_minutes * 60,
          startTime: new Date(session.started_at),
          endTime: session.ended_at ? new Date(session.ended_at) : undefined
        }));
        
        setSessions(formattedSessions);
        
        // Calculer le temps total d'étude
        const total = data.reduce((acc, session) => acc + (session.duration_minutes || 0), 0);
        setTotalStudyTime(total);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des sessions:', error);
    }
  };

  /**
   * ▶️ Démarrer une session d'étude
   */
  const startTimer = async () => {
    if (!subject.trim()) {
      toast.error('Veuillez spécifier une matière d\'étude');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté pour utiliser le chronomètre');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject: subject.trim(),
          duration_minutes: 0,
          started_at: new Date().toISOString(),
          completed: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création de la session:', error);
        toast.error('Impossible de démarrer la session');
        return;
      }

      setCurrentSessionId(data.id);
      setIsRunning(true);
      setTime(0);
      toast.success(`Session d'étude démarrée pour ${subject}`);
    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  /**
   * ⏸️ Mettre en pause le chronomètre
   */
  const pauseTimer = () => {
    setIsRunning(false);
    toast.info('Session mise en pause');
  };

  /**
   * ▶️ Reprendre le chronomètre
   */
  const resumeTimer = () => {
    setIsRunning(true);
    toast.info('Session reprise');
  };

  /**
   * ⏹️ Arrêter et sauvegarder la session
   */
  const stopTimer = async () => {
    if (!currentSessionId || !user) return;

    try {
      const durationMinutes = Math.floor(time / 60);
      
      const { error } = await supabase
        .from('study_sessions')
        .update({
          duration_minutes: durationMinutes,
          ended_at: new Date().toISOString(),
          completed: true
        })
        .eq('id', currentSessionId);

      if (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde');
        return;
      }

      // Réinitialiser l'état
      setIsRunning(false);
      setTime(0);
      setSubject('');
      setCurrentSessionId(null);
      
      toast.success(`Session terminée : ${durationMinutes} minutes d'étude`);
      
      // Recharger les sessions
      await loadStudySessions();
    } catch (error) {
      console.error('❌ Erreur lors de l'arrêt:', error);
      toast.error('Erreur lors de l\'arrêt de la session');
    }
  };

  /**
   * 🕐 Formater le temps en HH:MM:SS
   */
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 max-w-4xl">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Chronomètre d'Étude</h1>
            <p className="text-sm sm:text-base text-gray-500">Suivez vos sessions d'étude en temps réel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chronomètre principal */}
          <Card className="lg:col-span-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl sm:text-3xl text-medical-blue">
                {formatTime(time)}
              </CardTitle>
              <CardDescription>
                {isRunning ? `Étude en cours : ${subject}` : 'Chronomètre arrêté'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Configuration de la session */}
              {!currentSessionId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Matière d'étude</label>
                    <Input
                      placeholder="Ex: Cardiologie, Anatomie..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Contrôles du chronomètre */}
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                {!currentSessionId ? (
                  <Button 
                    onClick={startTimer}
                    size="lg"
                    className="bg-medical-blue hover:bg-medical-blue/90 flex-1 sm:flex-none"
                    disabled={!subject.trim()}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Démarrer
                  </Button>
                ) : (
                  <>
                    {isRunning ? (
                      <Button 
                        onClick={pauseTimer}
                        size="lg"
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        onClick={resumeTimer}
                        size="lg"
                        className="bg-medical-green hover:bg-medical-green/90 flex-1 sm:flex-none"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Reprendre
                      </Button>
                    )}
                    <Button 
                      onClick={stopTimer}
                      size="lg"
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Arrêter
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Temps total d'étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-blue">
                {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}min
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Toutes sessions confondues
              </p>
            </CardContent>
          </Card>

          {/* Sessions récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Sessions récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{session.subject}</p>
                        <p className="text-xs text-gray-600">
                          {session.startTime.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm text-medical-blue">
                          {Math.floor(session.duration / 60)}min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Aucune session enregistrée
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyTimer;
