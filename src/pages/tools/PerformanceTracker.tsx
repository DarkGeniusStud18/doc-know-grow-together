
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * 📊 Suivi des Performances - Version avec données réelles
 * 
 * Fonctionnalités :
 * - Analyse automatique des performances utilisateur
 * - Données réelles issues de la base de données
 * - Graphiques et statistiques interactifs
 * - Recommandations personnalisées basées sur l'activité
 * - Interface responsive et moderne
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/components/ui/sonner';
import { BarChart3, TrendingUp, PieChart, LineChart, Target, Brain, Trophy, Zap, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

/**
 * Interface pour les données de performance réelles
 */
interface RealPerformanceData {
  studyTime: number;
  studySessions: number;
  avgSessionDuration: number;
  completedGoals: number;
  totalGoals: number;
  pomodoroSessions: number;
  completedPomodoros: number;
  quizzesTaken: number;
  resourcesViewed: number;
  communityPosts: number;
  streak: number;
  weeklyProgress: number[];
}

/**
 * Interface pour les métriques d'activité hebdomadaire
 */
interface WeeklyActivity {
  date: string;
  studyMinutes: number;
  sessions: number;
  goals: number;
  pomodoros: number;
}

/**
 * Page principale du suivi des performances avec données réelles
 */
const PerformanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Récupération des données de performance réelles
   */
  const { data: performanceData, isLoading, refetch } = useQuery({
    queryKey: ['real-performance-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('📊 PerformanceTracker: Récupération des données réelles pour:', user.id);
      
      try {
        // Récupération des sessions d'étude
        const { data: studySessions, error: studyError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (studyError) throw studyError;

        // Récupération des objectifs
        const { data: goals, error: goalsError } = await supabase
          .from('study_goals')
          .select('*')
          .eq('user_id', user.id);

        if (goalsError) throw goalsError;

        // Récupération des sessions Pomodoro
        const { data: pomodoroSessions, error: pomodoroError } = await supabase
          .from('pomodoro_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (pomodoroError) throw pomodoroError;

        // Récupération des quiz
        const { data: quizzes, error: quizError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (quizError) throw quizError;

        // Récupération des posts communautaires
        const { data: communityPosts, error: communityError } = await supabase
          .from('community_topics')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (communityError) throw communityError;

        // Calcul des métriques
        const completedSessions = studySessions?.filter(s => s.completed) || [];
        const totalStudyTime = completedSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
        const avgSessionDuration = completedSessions.length > 0 
          ? totalStudyTime / completedSessions.length 
          : 0;

        const completedGoals = goals?.filter(g => g.completed).length || 0;
        const totalGoals = goals?.length || 0;

        const completedPomodoros = pomodoroSessions?.filter(p => p.completed).length || 0;
        const totalPomodoros = pomodoroSessions?.length || 0;

        // Calcul de la série (streak) - jours consécutifs avec activité
        const streak = calculateStreak(studySessions || [], pomodoroSessions || []);

        // Progression hebdomadaire (7 derniers jours)
        const weeklyProgress = calculateWeeklyProgress(
          studySessions || [],
          pomodoroSessions || [],
          goals || []
        );

        const performanceData: RealPerformanceData = {
          studyTime: totalStudyTime,
          studySessions: completedSessions.length,
          avgSessionDuration: Math.round(avgSessionDuration),
          completedGoals,
          totalGoals,
          pomodoroSessions: totalPomodoros,
          completedPomodoros,
          quizzesTaken: quizzes?.length || 0,
          resourcesViewed: 0, // À implémenter si nécessaire
          communityPosts: communityPosts?.length || 0,
          streak,
          weeklyProgress
        };

        console.log('✅ Données de performance calculées:', performanceData);
        return performanceData;

      } catch (error) {
        console.error('❌ Erreur lors de la récupération des données:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });

  /**
   * Calcul de la série de jours consécutifs avec activité
   */
  const calculateStreak = (studySessions: any[], pomodoroSessions: any[]): number => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasActivity = studySessions.some(s => 
        s.created_at.startsWith(dateStr) && s.completed
      ) || pomodoroSessions.some(p => 
        p.created_at.startsWith(dateStr) && p.completed
      );
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break; // Arrêter si pas d'activité (sauf pour aujourd'hui)
      }
    }
    
    return streak;
  };

  /**
   * Calcul de la progression hebdomadaire
   */
  const calculateWeeklyProgress = (studySessions: any[], pomodoroSessions: any[], goals: any[]): number[] => {
    const progress = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStudyTime = studySessions
        .filter(s => s.created_at.startsWith(dateStr) && s.completed)
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      
      const dayPomodoros = pomodoroSessions
        .filter(p => p.created_at.startsWith(dateStr) && p.completed)
        .length;
      
      const dayScore = Math.min(100, (dayStudyTime / 60) * 20 + dayPomodoros * 5);
      progress.push(dayScore);
    }
    
    return progress;
  };

  /**
   * Génération des recommandations basées sur les données réelles
   */
  const generateRealInsights = (data: RealPerformanceData) => {
    if (!data) return [];
    
    const insights = [];
    
    if (data.studyTime < 180) { // Moins de 3h par semaine
      insights.push({
        type: 'warning',
        icon: '⏰',
        title: 'Temps d\'étude à améliorer',
        message: `Vous avez étudié ${Math.round(data.studyTime / 60 * 10) / 10}h cette semaine. Essayez d'atteindre au moins 5h par semaine.`
      });
    } else if (data.studyTime > 600) { // Plus de 10h par semaine
      insights.push({
        type: 'success',
        icon: '🔥',
        title: 'Excellent rythme d\'étude !',
        message: `${Math.round(data.studyTime / 60 * 10) / 10}h d'étude cette semaine. Vous êtes très régulier !`
      });
    }
    
    if (data.completedGoals === 0 && data.totalGoals === 0) {
      insights.push({
        type: 'info',
        icon: '🎯',
        title: 'Définissez vos objectifs',
        message: 'Créez des objectifs d\'étude pour mieux structurer votre apprentissage.'
      });
    } else if (data.completedGoals > 0) {
      const completionRate = (data.completedGoals / data.totalGoals) * 100;
      if (completionRate >= 80) {
        insights.push({
          type: 'success',
          icon: '🏆',
          title: 'Objectifs en bonne voie !',
          message: `${data.completedGoals}/${data.totalGoals} objectifs atteints (${Math.round(completionRate)}%).`
        });
      }
    }
    
    if (data.streak >= 7) {
      insights.push({
        type: 'success',
        icon: '🔥',
        title: 'Série impressionnante !',
        message: `${data.streak} jours consécutifs d'activité. Continuez ainsi !`
      });
    } else if (data.streak === 0) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: 'Reprenez le rythme',
        message: 'Essayez d\'étudier un peu chaque jour pour maintenir votre motivation.'
      });
    }
    
    const pomodoroRate = data.pomodoroSessions > 0 ? (data.completedPomodoros / data.pomodoroSessions) * 100 : 0;
    if (data.pomodoroSessions > 0 && pomodoroRate < 50) {
      insights.push({
        type: 'info',
        icon: '🍅',
        title: 'Améliorez votre focus',
        message: `${Math.round(pomodoroRate)}% de vos sessions Pomodoro sont terminées. Essayez de réduire les distractions.`
      });
    }
    
    return insights;
  };

  /**
   * Gestionnaire de rafraîchissement des données
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Données actualisées !');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Calcul des couleurs de progression
   */
  const getProgressColor = (value: number, max: number = 100): string => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Affichage du chargement
  if (isLoading || !performanceData) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
            <span className="ml-3 text-lg">Analyse de vos performances en cours...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  const insights = generateRealInsights(performanceData);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        {/* En-tête avec actualisation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                Suivi des Performances
              </h1>
              <p className="text-gray-600">Analyse basée sur vos données réelles d'apprentissage</p>
            </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Temps d'étude</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {Math.round(performanceData.studyTime / 60 * 10) / 10}h
                  </p>
                  <p className="text-xs text-blue-600">Cette semaine</p>
                </div>
                <LineChart className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Sessions</p>
                  <p className="text-2xl font-bold text-green-900">{performanceData.studySessions}</p>
                  <p className="text-xs text-green-600">
                    Moy: {performanceData.avgSessionDuration}min
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Régularité</p>
                  <p className="text-2xl font-bold text-purple-900">{performanceData.streak}</p>
                  <p className="text-xs text-purple-600">Jours consécutifs</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Objectifs</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {performanceData.completedGoals}/{performanceData.totalGoals}
                  </p>
                  <p className="text-xs text-orange-600">Complétés</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu avec onglets */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="insights">Recommandations</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité de la semaine</CardTitle>
                  <CardDescription>Progression quotidienne (score sur 100)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.weeklyProgress.map((score, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - index));
                      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{dayName}</span>
                          <div className="flex items-center gap-2 flex-1 ml-4">
                            <Progress value={score} className="flex-1 h-2" />
                            <span className="text-sm w-12 text-right">{Math.round(score)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques détaillées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Sessions Pomodoro</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {performanceData.completedPomodoros}/{performanceData.pomodoroSessions}
                        </div>
                        <div className="text-xs text-gray-500">
                          {performanceData.pomodoroSessions > 0 
                            ? Math.round((performanceData.completedPomodoros / performanceData.pomodoroSessions) * 100)
                            : 0}% terminées
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Quiz créés</span>
                      <div className="font-medium">{performanceData.quizzesTaken}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Posts communautaires</span>
                      <div className="font-medium">{performanceData.communityPosts}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Durée moyenne/session</span>
                      <div className="font-medium">{performanceData.avgSessionDuration} min</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progression */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des compétences</CardTitle>
                <CardDescription>Basée sur votre activité réelle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Régularité d'étude</span>
                      <span className="text-sm">
                        {Math.min(100, Math.round((performanceData.streak / 30) * 100))}%
                      </span>
                    </div>
                    <Progress value={Math.min(100, (performanceData.streak / 30) * 100)} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {performanceData.streak} jours consécutifs d'activité
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Atteinte des objectifs</span>
                      <span className="text-sm">
                        {performanceData.totalGoals > 0 
                          ? Math.round((performanceData.completedGoals / performanceData.totalGoals) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={performanceData.totalGoals > 0 
                        ? (performanceData.completedGoals / performanceData.totalGoals) * 100
                        : 0} 
                      className="h-2" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {performanceData.completedGoals} sur {performanceData.totalGoals} objectifs atteints
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Efficacité Pomodoro</span>
                      <span className="text-sm">
                        {performanceData.pomodoroSessions > 0
                          ? Math.round((performanceData.completedPomodoros / performanceData.pomodoroSessions) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={performanceData.pomodoroSessions > 0
                        ? (performanceData.completedPomodoros / performanceData.pomodoroSessions) * 100
                        : 0} 
                      className="h-2" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {performanceData.completedPomodoros} sessions terminées sur {performanceData.pomodoroSessions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations personnalisées</CardTitle>
                <CardDescription>Basées sur votre activité des 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Excellent travail !
                      </h3>
                      <p className="text-gray-600">
                        Vos performances sont optimales. Continuez ainsi !
                      </p>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 p-4 rounded-lg border ${
                          insight.type === 'success' ? 'bg-green-50 border-green-200' :
                          insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="text-2xl">{insight.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${
                            insight.type === 'success' ? 'text-green-800' :
                            insight.type === 'warning' ? 'text-yellow-800' :
                            'text-blue-800'
                          }`}>
                            {insight.title}
                          </h4>
                          <p className={`text-sm ${
                            insight.type === 'success' ? 'text-green-700' :
                            insight.type === 'warning' ? 'text-yellow-700' :
                            'text-blue-700'
                          }`}>
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PerformanceTracker;
