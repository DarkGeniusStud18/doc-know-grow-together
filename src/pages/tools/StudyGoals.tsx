/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit, Trash2, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface StudyGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const GOAL_TYPES = [
  { value: 'study_time', label: 'Temps d\'étude', unit: 'minutes' },
  { value: 'sessions', label: 'Nombre de sessions', unit: 'sessions' },
  { value: 'chapters', label: 'Chapitres étudiés', unit: 'chapitres' },
  { value: 'exercises', label: 'Exercices complétés', unit: 'exercices' },
  { value: 'exams', label: 'Examens passés', unit: 'examens' },
  { value: 'score', label: 'Score à atteindre', unit: 'points' }
];

const StudyGoals: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: '',
    target_value: '',
    deadline: ''
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['study-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      if (!user) throw new Error('User not authenticated');

      const selectedGoalType = GOAL_TYPES.find(type => type.value === goalData.goal_type);
      
      const { data, error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          goal_type: goalData.goal_type,
          target_value: parseInt(goalData.target_value),
          current_value: 0,
          unit: selectedGoalType?.unit || 'unités',
          deadline: goalData.deadline || null,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      setDialogOpen(false);
      resetForm();
      toast.success('Objectif créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
      toast.error('Erreur lors de la création de l\'objectif');
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, ...goalData }: any) => {
      const selectedGoalType = GOAL_TYPES.find(type => type.value === goalData.goal_type);
      
      const { data, error } = await supabase
        .from('study_goals')
        .update({
          title: goalData.title,
          description: goalData.description,
          goal_type: goalData.goal_type,
          target_value: parseInt(goalData.target_value),
          unit: selectedGoalType?.unit || 'unités',
          deadline: goalData.deadline || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      setDialogOpen(false);
      setEditingGoal(null);
      resetForm();
      toast.success('Objectif mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast.error('Erreur lors de la mise à jour de l\'objectif');
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      toast.success('Objectif supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting goal:', error);
      toast.error('Erreur lors de la suppression de l\'objectif');
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, newValue }: { id: string; newValue: number }) => {
      const goal = goals.find(g => g.id === id);
      if (!goal) throw new Error('Goal not found');

      const isCompleted = newValue >= goal.target_value;
      
      const { data, error } = await supabase
        .from('study_goals')
        .update({
          current_value: newValue,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      if (data.completed) {
        toast.success('🎉 Objectif atteint ! Félicitations !');
      } else {
        toast.success('Progression mise à jour');
      }
    },
    onError: (error) => {
      console.error('Error updating progress:', error);
      toast.error('Erreur lors de la mise à jour de la progression');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goal_type: '',
      target_value: '',
      deadline: ''
    });
  };

  const handleEdit = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      goal_type: goal.goal_type,
      target_value: goal.target_value.toString(),
      deadline: goal.deadline || ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.goal_type || !formData.target_value) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (parseInt(formData.target_value) <= 0) {
      toast.error('La valeur cible doit être supérieure à 0');
      return;
    }

    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, ...formData });
    } else {
      createGoalMutation.mutate(formData);
    }
  };

  const handleProgressUpdate = (goal: StudyGoal, increment: number) => {
    const newValue = Math.max(0, goal.current_value + increment);
    updateProgressMutation.mutate({ id: goal.id, newValue });
  };

  const getProgressPercentage = (goal: StudyGoal) => {
    return Math.min(100, (goal.current_value / goal.target_value) * 100);
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const end = new Date(deadline);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy flex items-center gap-2">
              <Target className="h-8 w-8" />
              Objectifs d'étude
            </h1>
            <p className="text-gray-600 mt-2">Définissez et suivez vos objectifs académiques</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingGoal(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvel objectif
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}
                </DialogTitle>
                <DialogDescription>
                  Définissez un objectif d'étude mesurable et motivant
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'objectif *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Étudier 2h par jour"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre objectif en détail"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Type d'objectif *</label>
                  <Select value={formData.goal_type} onValueChange={(value) => setFormData(prev => ({ ...prev, goal_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valeur cible *</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.target_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                    placeholder="Ex: 60"
                    required
                  />
                  {formData.goal_type && (
                    <p className="text-sm text-gray-500 mt-1">
                      Unité: {GOAL_TYPES.find(type => type.value === formData.goal_type)?.unit}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date limite (optionnelle)</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
                  >
                    {editingGoal ? 'Mettre à jour' : 'Créer l\'objectif'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucun objectif défini</h3>
              <p className="text-gray-500 mb-6">Créez votre premier objectif pour suivre vos progrès</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un objectif
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progressPercentage = getProgressPercentage(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const isOverdue = daysRemaining !== null && daysRemaining < 0;
              const isCompleted = goal.completed;
              
              return (
                <Card key={goal.id} className={`transition-all hover:shadow-lg ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {goal.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {goal.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(goal)}
                          disabled={isCompleted}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteGoalMutation.mutate(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>Progression</span>
                        <span className="font-medium">
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">
                        {progressPercentage.toFixed(1)}% complété
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {GOAL_TYPES.find(type => type.value === goal.goal_type)?.label}
                      </Badge>
                      
                      {goal.deadline && (
                        <Badge variant={isOverdue ? "destructive" : "outline"}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {isOverdue ? 'Expiré' : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`}
                        </Badge>
                      )}
                      
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complété
                        </Badge>
                      )}
                    </div>
                    
                    {goal.deadline && (
                      <p className="text-xs text-gray-500">
                        Échéance: {formatDate(goal.deadline)}
                      </p>
                    )}
                    
                    {!isCompleted && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressUpdate(goal, -1)}
                          disabled={goal.current_value <= 0}
                        >
                          -1
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleProgressUpdate(goal, 1)}
                          disabled={goal.current_value >= goal.target_value}
                          className="flex-1"
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +1
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyGoals;
