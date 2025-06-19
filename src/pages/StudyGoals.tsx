
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * 🎯 Gestion des Objectifs d'Étude - Page principale
 * 
 * Fonctionnalités :
 * - Création et gestion d'objectifs personnalisés
 * - Suivi de progression en temps réel
 * - Statistiques et visualisations
 * - Interface utilisateur intuitive et responsive
 */

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Interface pour les objectifs d'étude
 */
interface StudyGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Types d'objectifs disponibles
 */
const GOAL_TYPES = [
  { value: 'study_time', label: 'Temps d\'étude', unit: 'minutes' },
  { value: 'sessions', label: 'Sessions d\'étude', unit: 'sessions' },
  { value: 'courses', label: 'Cours complétés', unit: 'cours' },
  { value: 'quizzes', label: 'Quiz réussis', unit: 'quiz' },
  { value: 'articles', label: 'Articles lus', unit: 'articles' }
];

/**
 * Page principale de gestion des objectifs d'étude
 */
const StudyGoals: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // États pour la gestion de l'interface utilisateur
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    goal_type: '',
    target_value: 0,
    unit: 'minutes',
    deadline: ''
  });

  /**
   * Récupération des objectifs depuis Supabase
   */
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['study-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('🎯 StudyGoals: Récupération des objectifs pour l\'utilisateur:', user.id);
      
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des objectifs:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} objectifs récupérés`);
      return data as StudyGoal[];
    },
    enabled: !!user
  });

  /**
   * Mutation pour créer un nouvel objectif
   */
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: typeof newGoal) => {
      if (!user) throw new Error('Utilisateur non authentifié');

      console.log('🎯 Création d\'un nouvel objectif:', goalData);

      const { data, error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          goal_type: goalData.goal_type,
          target_value: goalData.target_value,
          unit: goalData.unit,
          deadline: goalData.deadline || null,
          current_value: 0,
          completed: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création de l\'objectif:', error);
        throw error;
      }

      console.log('✅ Objectif créé avec succès:', data);
      return data;
    },
    onSuccess: () => {
      toast.success('Objectif créé avec succès !');
      setShowCreateDialog(false);
      setNewGoal({
        title: '',
        description: '',
        goal_type: '',
        target_value: 0,
        unit: 'minutes',
        deadline: ''
      });
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de l\'objectif');
    }
  });

  /**
   * Mutation pour supprimer un objectif
   */
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      console.log('🗑️ Suppression de l\'objectif:', goalId);

      const { error } = await supabase
        .from('study_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        throw error;
      }

      console.log('✅ Objectif supprimé avec succès');
    },
    onSuccess: () => {
      toast.success('Objectif supprimé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'objectif');
    }
  });

  /**
   * Mutation pour marquer un objectif comme terminé
   */
  const completeGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      console.log('✅ Marquage de l\'objectif comme terminé:', goalId);

      const { error } = await supabase
        .from('study_goals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          current_value: goals.find(g => g.id === goalId)?.target_value || 0
        })
        .eq('id', goalId);

      if (error) {
        console.error('❌ Erreur lors de la completion:', error);
        throw error;
      }

      console.log('✅ Objectif marqué comme terminé');
    },
    onSuccess: () => {
      toast.success('Objectif terminé ! Félicitations ! 🎉');
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la completion:', error);
      toast.error('Erreur lors de la validation de l\'objectif');
    }
  });

  /**
   * Gestionnaire de création d'objectif
   */
  const handleCreateGoal = () => {
    // Validation des champs obligatoires
    if (!newGoal.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (!newGoal.goal_type) {
      toast.error('Le type d\'objectif est requis');
      return;
    }

    if (newGoal.target_value <= 0) {
      toast.error('La valeur cible doit être supérieure à 0');
      return;
    }

    createGoalMutation.mutate(newGoal);
  };

  /**
   * Gestionnaire de changement de type d'objectif
   */
  const handleGoalTypeChange = (goalType: string) => {
    const selectedType = GOAL_TYPES.find(type => type.value === goalType);
    setNewGoal({
      ...newGoal,
      goal_type: goalType,
      unit: selectedType?.unit || 'minutes'
    });
  };

  /**
   * Calcul du pourcentage de progression
   */
  const calculateProgress = (goal: StudyGoal): number => {
    if (goal.target_value === 0) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  /**
   * Vérification si un objectif est en retard
   */
  const isOverdue = (goal: StudyGoal): boolean => {
    if (!goal.deadline || goal.completed) return false;
    return new Date(goal.deadline) < new Date();
  };

  /**
   * Rendu d'une carte d'objectif
   */
  const renderGoalCard = (goal: StudyGoal) => {
    const progress = calculateProgress(goal);
    const overdue = isOverdue(goal);

    return (
      <Card key={goal.id} className={`transition-all duration-300 hover:shadow-md ${
        goal.completed ? 'border-green-200 bg-green-50' : 
        overdue ? 'border-red-200 bg-red-50' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {goal.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                {goal.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {goal.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {goal.completed && (
                <Badge variant="default" className="bg-green-600">
                  Terminé
                </Badge>
              )}
              {overdue && !goal.completed && (
                <Badge variant="destructive">
                  En retard
                </Badge>
              )}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingGoal(goal)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteGoalMutation.mutate(goal.id)}
                  disabled={deleteGoalMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Barre de progression */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progression</span>
              <span className="font-medium">
                {goal.current_value} / {goal.target_value} {goal.unit}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {progress.toFixed(1)}% terminé
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{GOAL_TYPES.find(t => t.value === goal.goal_type)?.label}</span>
              </div>
              {goal.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(goal.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
            
            {!goal.completed && progress < 100 && (
              <Button
                size="sm"
                onClick={() => completeGoalMutation.mutate(goal.id)}
                disabled={completeGoalMutation.isPending}
                className="text-xs"
              >
                Marquer comme terminé
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Statistiques générales
  const completedGoals = goals.filter(goal => goal.completed).length;
  const overdueGoals = goals.filter(goal => isOverdue(goal)).length;
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / goals.length 
    : 0;

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* En-tête avec statistiques */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-medical-blue" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Objectifs d'Étude
                </h1>
                <p className="text-gray-600">
                  Définissez et suivez vos objectifs d'apprentissage
                </p>
              </div>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvel objectif
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel objectif</DialogTitle>
                  <DialogDescription>
                    Définissez un objectif d'étude mesurable et motivant
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'objectif</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Étudier 2 heures par jour"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnelle)</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre objectif en détail..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-type">Type d'objectif</Label>
                      <Select 
                        value={newGoal.goal_type} 
                        onValueChange={handleGoalTypeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {GOAL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target-value">Valeur cible</Label>
                      <Input
                        id="target-value"
                        type="number"
                        min="1"
                        placeholder="Ex: 120"
                        value={newGoal.target_value || ''}
                        onChange={(e) => setNewGoal({ 
                          ...newGoal, 
                          target_value: parseInt(e.target.value) || 0 
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Date limite (optionnelle)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    disabled={createGoalMutation.isPending}
                  >
                    {createGoalMutation.isPending ? 'Création...' : 'Créer l\'objectif'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-medical-blue">{goals.length}</div>
                <div className="text-sm text-gray-600">Objectifs totaux</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <div className="text-sm text-gray-600">Terminés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{overdueGoals}</div>
                <div className="text-sm text-gray-600">En retard</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-medical-teal">
                  {averageProgress.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Progression moyenne</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liste des objectifs */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : goals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucun objectif défini
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre premier objectif d'étude pour suivre vos progrès.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier objectif
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(renderGoalCard)}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyGoals;
