
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, TrendingUp, Calendar, Award, Trash2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface StudyGoal {
  id: string;
  title: string;
  description?: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  created_at: string;
}

const StudyGoals: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    goal_type: 'daily',
    target_value: 60,
    unit: 'minutes',
    deadline: '',
  });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('study_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
      toast.error('Erreur lors du chargement des objectifs');
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  const createGoal = async () => {
    if (!user || !newGoal.title.trim()) {
      toast.error('Veuillez remplir au moins le titre');
      return;
    }

    const { error } = await supabase
      .from('study_goals')
      .insert({
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description,
        goal_type: newGoal.goal_type,
        target_value: newGoal.target_value,
        unit: newGoal.unit,
        deadline: newGoal.deadline || null,
      });

    if (error) {
      console.error('Error creating goal:', error);
      toast.error('Erreur lors de la création de l\'objectif');
    } else {
      toast.success('Objectif créé !');
      setNewGoal({
        title: '',
        description: '',
        goal_type: 'daily',
        target_value: 60,
        unit: 'minutes',
        deadline: '',
      });
      setShowForm(false);
      loadGoals();
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    const { error } = await supabase
      .from('study_goals')
      .update({ current_value: newValue })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal:', error);
      toast.error('Erreur lors de la mise à jour');
    } else {
      loadGoals();
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('study_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Objectif supprimé');
      loadGoals();
    }
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'weekly': return <TrendingUp className="h-6 w-6 text-green-500" />;
      case 'monthly': return <Award className="h-6 w-6 text-purple-500" />;
      case 'semester': return <Target className="h-6 w-6 text-orange-500" />;
      default: return <Target className="h-6 w-6 text-gray-500" />;
    }
  };

  const getProgressPercentage = (goal: StudyGoal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Objectifs d'étude</h1>
              <p className="text-gray-500">Définissez et suivez vos objectifs d'apprentissage</p>
            </div>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Objectif
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer un nouvel objectif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de l'objectif"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optionnel)"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={newGoal.goal_type} onValueChange={(value) => setNewGoal({ ...newGoal, goal_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="semester">Semestriel</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Valeur cible"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 0 })}
                />
                <Select value={newGoal.unit} onValueChange={(value) => setNewGoal({ ...newGoal, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Heures</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                    <SelectItem value="chapters">Chapitres</SelectItem>
                    <SelectItem value="exercises">Exercices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={createGoal}>Créer l'objectif</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      {getGoalIcon(goal.goal_type)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                {goal.description && (
                  <CardDescription>{goal.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression</span>
                      <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                    </div>
                    <Progress value={getProgressPercentage(goal)} />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Nouvelle valeur"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const newValue = parseInt(input.value) || 0;
                          updateGoalProgress(goal.id, newValue);
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector(`input[type="number"]`) as HTMLInputElement;
                        if (input) {
                          const newValue = parseInt(input.value) || 0;
                          updateGoalProgress(goal.id, newValue);
                          input.value = '';
                        }
                      }}
                    >
                      Mettre à jour
                    </Button>
                  </div>
                  {goal.deadline && (
                    <div className="text-sm text-gray-500">
                      Échéance: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">Aucun objectif</h3>
            <p className="text-sm text-gray-500 mt-1">
              Commencez par créer votre premier objectif d'étude !
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyGoals;
