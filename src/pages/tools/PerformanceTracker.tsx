
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, PieChart, LineChart, Target, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  metric_unit?: string;
  category?: string;
  recorded_date: string;
  created_at: string;
}

const PerformanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMetric, setNewMetric] = useState({
    metric_type: 'study_time',
    metric_value: '',
    metric_unit: 'minutes',
    category: '',
    recorded_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_date', { ascending: false });

    if (error) {
      console.error('Error loading metrics:', error);
      toast.error('Erreur lors du chargement des métriques');
    } else {
      setMetrics(data || []);
    }
    setLoading(false);
  };

  const addMetric = async () => {
    if (!user || !newMetric.metric_value) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const metricData = {
      user_id: user.id,
      metric_type: newMetric.metric_type,
      metric_value: parseFloat(newMetric.metric_value),
      metric_unit: newMetric.metric_unit,
      category: newMetric.category || null,
      recorded_date: newMetric.recorded_date,
    };

    const { error } = await supabase
      .from('performance_metrics')
      .insert(metricData);

    if (error) {
      console.error('Error adding metric:', error);
      toast.error('Erreur lors de l\'ajout de la métrique');
    } else {
      toast.success('Métrique ajoutée !');
      setNewMetric({
        metric_type: 'study_time',
        metric_value: '',
        metric_unit: 'minutes',
        category: '',
        recorded_date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      loadMetrics();
    }
  };

  const getMetricTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      study_time: 'Temps d\'étude',
      quiz_score: 'Score de quiz',
      goal_completion: 'Completion d\'objectif',
      reading_pages: 'Pages lues',
      exercise_completed: 'Exercices terminés',
      exam_score: 'Score d\'examen',
    };
    return labels[type] || type;
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'study_time': return <LineChart className="h-5 w-5 text-blue-500" />;
      case 'quiz_score': return <PieChart className="h-5 w-5 text-green-500" />;
      case 'goal_completion': return <Target className="h-5 w-5 text-purple-500" />;
      case 'exam_score': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default: return <BarChart3 className="h-5 w-5 text-gray-500" />;
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisWeekMetrics = metrics.filter(m => new Date(m.recorded_date) >= thisWeek);
    const thisMonthMetrics = metrics.filter(m => new Date(m.recorded_date) >= thisMonth);

    const studyTimeThisWeek = thisWeekMetrics
      .filter(m => m.metric_type === 'study_time')
      .reduce((sum, m) => sum + m.metric_value, 0);

    const avgQuizScore = metrics
      .filter(m => m.metric_type === 'quiz_score')
      .reduce((sum, m, _, arr) => sum + m.metric_value / arr.length, 0);

    return {
      totalMetrics: metrics.length,
      studyTimeThisWeek,
      thisMonthMetrics: thisMonthMetrics.length,
      avgQuizScore: avgQuizScore || 0,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Suivi des performances</h1>
              <p className="text-gray-500">Analysez vos résultats et identifiez vos points forts</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Métrique
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total métriques</p>
                  <p className="text-2xl font-bold">{stats.totalMetrics}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Temps d'étude (semaine)</p>
                  <p className="text-2xl font-bold">{stats.studyTimeThisWeek}h</p>
                </div>
                <LineChart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Métriques ce mois</p>
                  <p className="text-2xl font-bold">{stats.thisMonthMetrics}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Score moyen quiz</p>
                  <p className="text-2xl font-bold">{stats.avgQuizScore.toFixed(1)}%</p>
                </div>
                <PieChart className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter une nouvelle métrique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  value={newMetric.metric_type} 
                  onValueChange={(value) => setNewMetric({ ...newMetric, metric_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de métrique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study_time">Temps d'étude</SelectItem>
                    <SelectItem value="quiz_score">Score de quiz</SelectItem>
                    <SelectItem value="goal_completion">Completion d'objectif</SelectItem>
                    <SelectItem value="reading_pages">Pages lues</SelectItem>
                    <SelectItem value="exercise_completed">Exercices terminés</SelectItem>
                    <SelectItem value="exam_score">Score d'examen</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Valeur"
                  type="number"
                  value={newMetric.metric_value}
                  onChange={(e) => setNewMetric({ ...newMetric, metric_value: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select 
                  value={newMetric.metric_unit} 
                  onValueChange={(value) => setNewMetric({ ...newMetric, metric_unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Heures</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                    <SelectItem value="percent">Pourcentage</SelectItem>
                    <SelectItem value="count">Nombre</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Catégorie (optionnel)"
                  value={newMetric.category}
                  onChange={(e) => setNewMetric({ ...newMetric, category: e.target.value })}
                />
                <Input
                  type="date"
                  value={newMetric.recorded_date}
                  onChange={(e) => setNewMetric({ ...newMetric, recorded_date: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addMetric}>Ajouter la métrique</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics List */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des métriques</CardTitle>
            <CardDescription>Vos performances récentes</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.length > 0 ? (
              <div className="space-y-3">
                {metrics.slice(0, 20).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getMetricIcon(metric.metric_type)}
                      <div>
                        <div className="font-medium">{getMetricTypeLabel(metric.metric_type)}</div>
                        <div className="text-sm text-gray-500">
                          {metric.category && `${metric.category} • `}
                          {new Date(metric.recorded_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {metric.metric_value} {metric.metric_unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">Aucune métrique</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Commencez par ajouter votre première métrique de performance !
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PerformanceTracker;
