
/**
 * 📊 Suivi des Performances - Tableau de bord analytique
 * Interface complète pour analyser et suivre les progrès d'étude
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, TrendingDown, Clock, Target, Award,
  BookOpen, Brain, Timer, CheckCircle, Calendar, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface StudyStats {
  totalHours: number;
  sessionsCount: number;
  averageSession: number;
  weeklyGoal: number;
  completedGoals: number;
  totalGoals: number;
}

interface PerformanceData {
  date: string;
  studyHours: number;
  sessions: number;
  efficiency: number;
}

const PerformanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalHours: 0,
    sessionsCount: 0,
    averageSession: 0,
    weeklyGoal: 40,
    completedGoals: 0,
    totalGoals: 0
  });
  const [loading, setLoading] = useState(true);

  // Données de performance simulées
  const performanceData: PerformanceData[] = [
    { date: '2024-01-01', studyHours: 4.5, sessions: 3, efficiency: 85 },
    { date: '2024-01-02', studyHours: 6.2, sessions: 4, efficiency: 78 },
    { date: '2024-01-03', studyHours: 3.8, sessions: 2, efficiency: 92 },
    { date: '2024-01-04', studyHours: 5.1, sessions: 3, efficiency: 88 },
    { date: '2024-01-05', studyHours: 7.3, sessions: 5, efficiency: 75 },
    { date: '2024-01-06', studyHours: 4.9, sessions: 3, efficiency: 89 },
    { date: '2024-01-07', studyHours: 5.7, sessions: 4, efficiency: 83 }
  ];

  const subjectData = [
    { name: 'Anatomie', hours: 12.5, color: '#0077B6' },
    { name: 'Physiologie', hours: 8.3, color: '#00B4D8' },
    { name: 'Pharmacologie', hours: 15.2, color: '#90E0EF' },
    { name: 'Pathologie', hours: 10.1, color: '#ADE8F4' },
    { name: 'Autres', hours: 6.8, color: '#CAF0F8' }
  ];

  const achievementData = [
    { name: 'Objectifs atteints', value: 78, color: '#22C55E' },
    { name: 'En cours', value: 15, color: '#F59E0B' },
    { name: 'Non atteints', value: 7, color: '#EF4444' }
  ];

  /**
   * 📊 Chargement des statistiques depuis Supabase
   */
  const loadStats = async () => {
    if (!user) return;
    
    try {
      // Chargement des sessions d'étude
      const { data: studyData, error: studyError } = await supabase
        .rpc('get_user_study_stats', { 
          p_user_id: user.id,
          p_period: selectedPeriod 
        });

      if (studyError) throw studyError;

      // Chargement des objectifs
      const { data: goalsData, error: goalsError } = await supabase
        .rpc('get_user_goal_progress', { p_user_id: user.id });

      if (goalsError) throw goalsError;

      if (studyData && studyData.length > 0) {
        const stats = studyData[0];
        const completedGoals = goalsData?.filter((g: any) => g.progress_percentage >= 100).length || 0;
        
        setStudyStats({
          totalHours: stats.total_hours || 0,
          sessionsCount: stats.sessions_count || 0,
          averageSession: stats.avg_session_duration || 0,
          weeklyGoal: 40,
          completedGoals,
          totalGoals: goalsData?.length || 0
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📈 Calcul du pourcentage de progression
   */
  const getProgressPercentage = () => {
    if (studyStats.weeklyGoal === 0) return 0;
    return Math.min((studyStats.totalHours / studyStats.weeklyGoal) * 100, 100);
  };

  /**
   * 🎯 Calcul du taux de réussite des objectifs
   */
  const getGoalCompletionRate = () => {
    if (studyStats.totalGoals === 0) return 0;
    return Math.round((studyStats.completedGoals / studyStats.totalGoals) * 100);
  };

  /**
   * 📊 Formatage des données pour les graphiques
   */
  const formatChartData = (data: PerformanceData[]) => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      })
    }));
  };

  // Chargement des données
  useEffect(() => {
    loadStats();
  }, [user, selectedPeriod]);

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-medical-blue" />
              Suivi des Performances
            </h1>
            <p className="text-gray-600 mt-2">
              Analysez vos progrès et optimisez votre apprentissage
            </p>
          </div>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Clock className="h-5 w-5" />
                Temps d'étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {studyStats.totalHours.toFixed(1)}h
              </div>
              <p className="text-sm text-blue-600">
                {selectedPeriod === 'week' ? 'Cette semaine' : 'Période sélectionnée'}
              </p>
              <Progress 
                value={getProgressPercentage()} 
                className="mt-2 h-2" 
              />
              <p className="text-xs text-blue-600 mt-1">
                Objectif: {studyStats.weeklyGoal}h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Activity className="h-5 w-5" />
                Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {studyStats.sessionsCount}
              </div>
              <p className="text-sm text-green-600">
                Sessions d'étude
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Moy: {studyStats.averageSession.toFixed(0)}min
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Target className="h-5 w-5" />
                Objectifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {getGoalCompletionRate()}%
              </div>
              <p className="text-sm text-purple-600">
                Taux de réussite
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {studyStats.completedGoals} / {studyStats.totalGoals} objectifs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Brain className="h-5 w-5" />
                Efficacité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-1">
                85%
              </div>
              <p className="text-sm text-orange-600">
                Score moyen
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">
                  +5% cette semaine
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="subjects">Matières</TabsTrigger>
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique de progression */}
              <Card>
                <CardHeader>
                  <CardTitle>Progression quotidienne</CardTitle>
                  <CardDescription>
                    Heures d'étude par jour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formatChartData(performanceData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="studyHours" 
                        stroke="#0077B6" 
                        strokeWidth={2}
                        dot={{ fill: '#0077B6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Graphique des sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Sessions d'étude</CardTitle>
                  <CardDescription>
                    Nombre de sessions par jour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatChartData(performanceData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#00B4D8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par matière */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par matière</CardTitle>
                  <CardDescription>
                    Temps consacré à chaque matière
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="hours"
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Détail par matière */}
              <Card>
                <CardHeader>
                  <CardTitle>Détail par matière</CardTitle>
                  <CardDescription>
                    Temps d'étude détaillé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectData.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="font-medium">{subject.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{subject.hours}h</div>
                          <div className="text-sm text-gray-500">
                            {Math.round((subject.hours / subjectData.reduce((a, b) => a + b.hours, 0)) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statut des objectifs */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut des objectifs</CardTitle>
                  <CardDescription>
                    Répartition de vos objectifs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={achievementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {achievementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Objectifs récents */}
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs récents</CardTitle>
                  <CardDescription>
                    Vos derniers objectifs créés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Réviser l\'anatomie cardiaque', progress: 100, status: 'completed' },
                      { title: 'Terminer le chapitre de pharmacologie', progress: 75, status: 'in-progress' },
                      { title: 'Préparer l\'examen de pathologie', progress: 45, status: 'in-progress' },
                      { title: 'Réviser les cas cliniques', progress: 20, status: 'started' }
                    ].map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{goal.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{goal.progress}%</span>
                            {goal.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Efficacité d'apprentissage</CardTitle>
                <CardDescription>
                  Évolution de votre efficacité dans le temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formatChartData(performanceData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#22C55E" 
                      strokeWidth={2}
                      dot={{ fill: '#22C55E' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommandations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Recommandations personnalisées
            </CardTitle>
            <CardDescription>
              Conseils pour améliorer vos performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📈 Augmentez votre régularité</h4>
                <p className="text-sm text-blue-700">
                  Vous avez étudié 3 jours cette semaine. Essayez d'atteindre 5 jours pour plus de consistance.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">⏱️ Optimisez vos sessions</h4>
                <p className="text-sm text-green-700">
                  Vos sessions de 45-60 minutes sont idéales. Maintenez cette durée pour une concentration optimale.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">🎯 Diversifiez les matières</h4>
                <p className="text-sm text-orange-700">
                  Équilibrez mieux votre temps entre les différentes matières pour une préparation complète.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PerformanceTracker;
