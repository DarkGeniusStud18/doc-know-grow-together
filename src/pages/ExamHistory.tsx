/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trophy, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

type ExamSession = {
  id: string;
  exam_type: string;
  subjects: string[];
  questions_count: number;
  score: number;
  max_score: number;
  duration_minutes: number;
  completed_at: string;
};

const ExamHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageScore: 0,
    totalTime: 0,
    bestScore: 0
  });

  useEffect(() => {
    if (user) {
      loadExamHistory();
    }
  }, [user]);

  const loadExamHistory = async () => {
    try {
      setLoading(true);
      
      // Get exam sessions from last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const { data: sessionsData, error } = await supabase
        .from('exam_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('completed_at', threeMonthsAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;

      setSessions(sessionsData || []);
      
      // Calculate stats
      if (sessionsData && sessionsData.length > 0) {
        const totalSessions = sessionsData.length;
        const averageScore = sessionsData.reduce((sum, session) => 
          sum + (session.score / session.max_score * 100), 0) / totalSessions;
        const totalTime = sessionsData.reduce((sum, session) => sum + session.duration_minutes, 0);
        const bestScore = Math.max(...sessionsData.map(session => 
          session.score / session.max_score * 100));
        
        setStats({
          totalSessions,
          averageScore: Math.round(averageScore),
          totalTime,
          bestScore: Math.round(bestScore)
        });
      }
    } catch (error) {
      console.error('Error loading exam history:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Historique des examens</h1>
            <p className="text-gray-500">Vos performances des 3 derniers mois</p>
          </div>
          <Button onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-medical-teal" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Sessions totales</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-medical-teal" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Score moyen</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-medical-teal" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Temps total</p>
                  <p className="text-2xl font-bold">{formatDuration(stats.totalTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-medical-teal" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Meilleur score</p>
                  <p className="text-2xl font-bold">{stats.bestScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions d'examen</CardTitle>
            <CardDescription>Détail de vos sessions d'examen récentes</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucune session d'examen trouvée</p>
                <Button onClick={() => window.location.href = '/exam-simulator'}>
                  Commencer un examen
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{session.exam_type}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(session.completed_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDuration(session.duration_minutes)}
                          </div>
                          <span>{session.questions_count} questions</span>
                        </div>
                        
                        {session.subjects.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {session.subjects.slice(0, 3).map((subject, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {session.subjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{session.subjects.length - 3} autres
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getScoreColor(session.score, session.max_score)}>
                          {session.score}/{session.max_score} ({Math.round((session.score / session.max_score) * 100)}%)
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

export default ExamHistory;
