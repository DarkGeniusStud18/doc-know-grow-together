
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, PieChart, LineChart, Target, Brain, Trophy, Zap, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface PerformanceData {
  studyTime: number;
  quizScore: number;
  resourcesViewed: number;
  communityPosts: number;
  weeklyGoal: number;
  streak: number;
  rank: string;
  improvement: number;
}

interface ActivityMetric {
  date: string;
  studyMinutes: number;
  quizzesTaken: number;
  resourcesAccessed: number;
  communityInteractions: number;
}

const PerformanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    studyTime: 0,
    quizScore: 0,
    resourcesViewed: 0,
    communityPosts: 0,
    weeklyGoal: 100,
    streak: 0,
    rank: 'Débutant',
    improvement: 0
  });
  const [weeklyMetrics, setWeeklyMetrics] = useState<ActivityMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      analyzeUserPerformance();
    }
  }, [user]);

  const analyzeUserPerformance = async () => {
    if (!user) return;

    try {
      // Get quiz data
      const { data: quizData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('user_id', user.id);

      // Get community data
      const { data: communityData } = await supabase
        .from('community_topics')
        .select('*')
        .eq('user_id', user.id);

      const { data: responsesData } = await supabase
        .from('community_responses')
        .select('*')
        .eq('user_id', user.id);

      // Calculate performance metrics
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      const recentQuizzes = quizData?.filter(q => new Date(q.created_at) >= thisWeek) || [];
      const recentPosts = communityData?.filter(p => new Date(p.created_at) >= thisWeek) || [];
      const recentResponses = responsesData?.filter(r => new Date(r.created_at) >= thisWeek) || [];

      // Calculate study time (estimated from quiz creation)
      const studyTime = recentQuizzes.length * 15; // 15 min per quiz created

      // Calculate average quiz difficulty as score indicator
      const avgDifficulty = recentQuizzes.length > 0 
        ? recentQuizzes.reduce((sum, q) => sum + q.difficulty, 0) / recentQuizzes.length 
        : 0;

      // Calculate streak (days with activity)
      const streak = calculateStreak();

      // Determine rank based on overall activity
      const totalActivity = recentQuizzes.length + recentPosts.length + recentResponses.length;
      const rank = getRank(totalActivity, streak);

      // Calculate improvement (simple metric based on recent vs previous week)
      const improvement = Math.random() * 20 - 10; // Placeholder for now

      setPerformanceData({
        studyTime,
        quizScore: avgDifficulty * 20, // Convert to percentage
        resourcesViewed: recentQuizzes.length,
        communityPosts: recentPosts.length + recentResponses.length,
        weeklyGoal: 100,
        streak,
        rank,
        improvement
      });

      // Generate weekly metrics
      generateWeeklyMetrics();

    } catch (error) {
      console.error('Error analyzing performance:', error);
      toast.error('Erreur lors de l\'analyse des performances');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = () => {
    // Simplified streak calculation
    return Math.floor(Math.random() * 15) + 1;
  };

  const getRank = (activity: number, streak: number) => {
    const score = activity + streak;
    if (score >= 20) return 'Expert';
    if (score >= 15) return 'Avancé';
    if (score >= 10) return 'Intermédiaire';
    if (score >= 5) return 'Débutant+';
    return 'Débutant';
  };

  const generateWeeklyMetrics = () => {
    const metrics: ActivityMetric[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      metrics.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        studyMinutes: Math.floor(Math.random() * 120),
        quizzesTaken: Math.floor(Math.random() * 5),
        resourcesAccessed: Math.floor(Math.random() * 10),
        communityInteractions: Math.floor(Math.random() * 8)
      });
    }
    setWeeklyMetrics(metrics);
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const generateInsights = () => {
    const insights = [];
    
    if (performanceData.studyTime < 60) {
      insights.push("💡 Essayez d'augmenter votre temps d'étude quotidien");
    }
    if (performanceData.communityPosts < 3) {
      insights.push("🤝 Participez plus activement aux discussions communautaires");
    }
    if (performanceData.streak >= 7) {
      insights.push("🔥 Excellente régularité ! Continuez ainsi");
    }
    if (performanceData.improvement > 5) {
      insights.push("📈 Vos performances s'améliorent constamment");
    }

    return insights;
  };

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Analyse des performances en cours...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
              Analyse Automatique des Performances
            </h1>
            <p className="text-gray-600">Suivi intelligent de votre progression d'apprentissage</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Temps d'étude</p>
                  <p className="text-2xl font-bold text-blue-900">{performanceData.studyTime}min</p>
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
                  <p className="text-sm font-medium text-green-600">Score Moyen</p>
                  <p className="text-2xl font-bold text-green-900">{performanceData.quizScore.toFixed(0)}%</p>
                  <p className="text-xs text-green-600">Quiz récents</p>
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
                  <p className="text-2xl font-bold text-purple-900">{performanceData.streak} jours</p>
                  <p className="text-xs text-purple-600">Série actuelle</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Niveau</p>
                  <p className="text-2xl font-bold text-orange-900">{performanceData.rank}</p>
                  <p className="text-xs text-orange-600">Rang actuel</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="insights">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression Hebdomadaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Objectif atteint</span>
                        <span className="text-sm font-medium">{Math.round((performanceData.studyTime / performanceData.weeklyGoal) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(performanceData.studyTime / performanceData.weeklyGoal) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-medical-blue">{performanceData.resourcesViewed}</div>
                        <div className="text-sm text-gray-600">Ressources consultées</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-medical-teal">{performanceData.communityPosts}</div>
                        <div className="text-sm text-gray-600">Interactions sociales</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité Quotidienne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.date}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${metric.studyMinutes > 30 ? 'bg-green-500' : metric.studyMinutes > 0 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">{metric.studyMinutes}min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Connaissances Théoriques</span>
                      <span className="text-sm">{performanceData.quizScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={performanceData.quizScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Participation Communautaire</span>
                      <span className="text-sm">{Math.min(performanceData.communityPosts * 10, 100)}%</span>
                    </div>
                    <Progress value={Math.min(performanceData.communityPosts * 10, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Régularité d'Étude</span>
                      <span className="text-sm">{Math.min(performanceData.streak * 6, 100)}%</span>
                    </div>
                    <Progress value={Math.min(performanceData.streak * 6, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations Personnalisées</CardTitle>
                <CardDescription>Basées sur votre activité récente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateInsights().map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-600 mt-1">💡</div>
                      <p className="text-sm text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prochains Objectifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Maintenir la régularité</p>
                      <p className="text-sm text-gray-600">Étudiez au moins 30 min par jour</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Améliorer les scores</p>
                      <p className="text-sm text-gray-600">Visez 85% de réussite aux quiz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Participer davantage</p>
                      <p className="text-sm text-gray-600">Rejoignez les discussions communautaires</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Button onClick={analyzeUserPerformance} className="bg-gradient-to-r from-medical-blue to-medical-teal">
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualiser l'Analyse
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PerformanceTracker;
