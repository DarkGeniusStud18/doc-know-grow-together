
/**
 * 🎯 Objectifs d'Étude - Version Mobile Responsive Optimisée
 * Interface professionnelle pour la gestion des objectifs d'étude
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Target, Plus, Edit, Trash2, CheckCircle, AlertCircle, Clock, Trophy, TrendingUp } from 'lucide-react';

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

interface GoalFormData {
  title: string;
  description: string;
  goal_type: string;
  target_value: number;
  unit: string;
  deadline: string;
}

const StudyGoals: React.FC = () => {
  const { user } = useAuth();
  
  // États principaux
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // États du formulaire
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    goal_type: 'study_time',
    target_value: 60,
    unit: 'minutes',
    deadline: ''
  });

  // Types d'objectifs disponibles
  const goalTypes = [
    { value: 'study_time', label: 'Temps d\'étude', unit: 'minutes', icon: '⏱️' },
    { value: 'sessions', label: 'Sessions d\'étude', unit: 'sessions', icon: '📚' },
    { value: 'flashcards', label: 'Cartes mémorisées', unit: 'cartes', icon: '🃏' },
    { value: 'chapters', label: 'Chapitres étudiés', unit: 'chapitres', icon: '📖' },
    { value: 'exercises', label: 'Exercices résolus', unit: 'exercices', icon: '✏️' },
    { value: 'courses', label: 'Cours suivis', unit: 'cours', icon: '🎓' }
  ];

  /**
   * 📡 Chargement des objectifs d'étude
   */
  const loadStudyGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement objectifs:', error);
        toast.error('Erreur lors du chargement des objectifs');
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast.error('Erreur inattendue lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✨ Création d'un nouvel objectif
   */
  const createStudyGoal = async () => {
    if (!user || !formData.title.trim()) {
      toast.error('Titre de l\'objectif requis');
      return;
    }

    setIsCreating(true);
    try {
      const selectedGoalType = goalTypes.find(type => type.value === formData.goal_type);
      
      const { data, error } = await supabase
        .from('study_goals')
        .insert([{
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          goal_type: formData.goal_type,
          target_value: formData.target_value,
          unit: selectedGoalType?.unit || formData.unit,
          deadline: formData.deadline || null,
          current_value: 0,
          completed: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur création objectif:', error);
        toast.error('Erreur lors de la création de l\'objectif');
        return;
      }

      toast.success('Objectif d\'étude créé avec succès !');
      setGoals(prev => [data, ...prev]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur inattendue création:', error);
      toast.error('Erreur inattendue lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * ✏️ Modification d'un objectif
   */
  const updateStudyGoal = async () => {
    if (!editingGoal || !user || !formData.title.trim()) {
      toast.error('Données de l\'objectif requises');
      return;
    }

    setIsCreating(true);
    try {
      const selectedGoalType = goalTypes.find(type => type.value === formData.goal_type);
      
      const { data, error } = await supabase
        .from('study_goals')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          goal_type: formData.goal_type,
          target_value: formData.target_value,
          unit: selectedGoalType?.unit || formData.unit,
          deadline: formData.deadline || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGoal.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur modification objectif:', error);
        toast.error('Erreur lors de la modification de l\'objectif');
        return;
      }

      toast.success('Objectif d\'étude modifié avec succès !');
      setGoals(prev => 
        prev.map(goal => goal.id === editingGoal.id ? data : goal)
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur inattendue modification:', error);
      toast.error('Erreur inattendue lors de la modification');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 🗑️ Suppression d'un objectif
   */
  const deleteStudyGoal = async (goalId: string) => {
    if (!user) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('study_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression objectif:', error);
        toast.error('Erreur lors de la suppression de l\'objectif');
        return;
      }

      toast.success('Objectif d\'étude supprimé avec succès');
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Erreur inattendue suppression:', error);
      toast.error('Erreur inattendue lors de la suppression');
    }
  };

  /**
   * ✅ Marquer un objectif comme terminé
   */
  const completeGoal = async (goalId: string) => {
    if (!user) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const { data, error } = await supabase
        .from('study_goals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          current_value: goal.target_value,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur finalisation objectif:', error);
        toast.error('Erreur lors de la finalisation de l\'objectif');
        return;
      }

      toast.success('🎉 Objectif atteint ! Félicitations !');
      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? data : goal)
      );
    } catch (error) {
      console.error('Erreur inattendue finalisation:', error);
      toast.error('Erreur inattendue lors de la finalisation');
    }
  };

  /**
   * 📊 Mise à jour du progrès d'un objectif
   */
  const updateGoalProgress = async (goalId: string, newValue: number) => {
    if (!user) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const isCompleted = newValue >= goal.target_value;
      
      const { data, error } = await supabase
        .from('study_goals')
        .update({
          current_value: Math.max(0, Math.min(newValue, goal.target_value)),
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour progrès:', error);
        toast.error('Erreur lors de la mise à jour du progrès');
        return;
      }

      if (isCompleted && !goal.completed) {
        toast.success('🎉 Objectif atteint ! Félicitations !');
      }

      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? data : goal)
      );
    } catch (error) {
      console.error('Erreur inattendue mise à jour:', error);
      toast.error('Erreur inattendue lors de la mise à jour');
    }
  };

  /**
   * 🔄 Réinitialisation du formulaire
   */
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goal_type: 'study_time',
      target_value: 60,
      unit: 'minutes',
      deadline: ''
    });
    setEditingGoal(null);
  };

  /**
   * ✏️ Préparation de l'édition d'un objectif
   */
  const startEditing = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      goal_type: goal.goal_type,
      target_value: goal.target_value,
      unit: goal.unit,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  /**
   * 📊 Calcul du pourcentage de progression
   */
  const getProgressPercentage = (goal: StudyGoal): number => {
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  };

  /**
   * 🎨 Obtention de l'icône selon le type d'objectif
   */
  const getGoalTypeIcon = (goalType: string): string => {
    const type = goalTypes.find(t => t.value === goalType);
    return type?.icon || '🎯';
  };

  /**
   * ⏰ Vérification si l'objectif est en retard
   */
  const isGoalOverdue = (goal: StudyGoal): boolean => {
    if (!goal.deadline || goal.completed) return false;
    return new Date(goal.deadline) < new Date();
  };

  // Chargement initial des données
  useEffect(() => {
    loadStudyGoals();
  }, [user]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 space-y-6 max-w-6xl">
        {/* En-tête avec actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
              Objectifs d'Étude
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Définissez et suivez vos objectifs d'apprentissage
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full sm:w-auto bg-medical-blue hover:bg-medical-blue/90"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Objectif
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Modifier l\'Objectif' : 'Créer un Nouvel Objectif'}
                </DialogTitle>
                <DialogDescription>
                  {editingGoal 
                    ? 'Modifiez les paramètres de votre objectif d\'étude'
                    : 'Définissez un objectif d\'étude mesurable et motivant'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Titre de l'objectif */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titre de l'Objectif *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Terminer le module d'anatomie"
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre objectif en détail..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Type d'objectif */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type d'Objectif
                  </label>
                  <Select
                    value={formData.goal_type}
                    onValueChange={(value) => {
                      const selectedType = goalTypes.find(type => type.value === value);
                      setFormData(prev => ({ 
                        ...prev, 
                        goal_type: value,
                        unit: selectedType?.unit || prev.unit
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Valeur cible */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Objectif à Atteindre
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={formData.target_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_value: parseInt(e.target.value) || 1 }))}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-600">
                      {goalTypes.find(type => type.value === formData.goal_type)?.unit || formData.unit}
                    </div>
                  </div>
                </div>

                {/* Date limite */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date Limite (Optionnel)
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={editingGoal ? updateStudyGoal : createStudyGoal}
                    disabled={isCreating || !formData.title.trim()}
                    className="flex-1"
                  >
                    {isCreating ? '⏳ En cours...' : editingGoal ? '✏️ Modifier' : '✨ Créer'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiques rapides */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-800">
                      {goals.filter(g => g.completed).length}
                    </div>
                    <div className="text-xs text-blue-600">Terminés</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-800">
                      {goals.filter(g => !g.completed).length}
                    </div>
                    <div className="text-xs text-green-600">En cours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-800">
                      {goals.filter(g => isGoalOverdue(g)).length}
                    </div>
                    <div className="text-xs text-orange-600">En retard</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-800">
                      {Math.round(goals.reduce((acc, g) => acc + getProgressPercentage(g), 0) / goals.length) || 0}%
                    </div>
                    <div className="text-xs text-purple-600">Progrès moyen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des objectifs */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucun Objectif d'Étude
            </h3>
            <p className="text-gray-500 mb-4">
              Créez votre premier objectif pour commencer à suivre vos progrès
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card 
                key={goal.id} 
                className={`
                  hover:shadow-lg transition-shadow relative
                  ${goal.completed ? 'bg-green-50 border-green-200' : ''}
                  ${isGoalOverdue(goal) ? 'bg-red-50 border-red-200' : ''}
                `}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-xl">
                          {getGoalTypeIcon(goal.goal_type)}
                        </span>
                        {goal.title}
                        {goal.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={goal.completed ? "default" : "secondary"}>
                          {goalTypes.find(t => t.value === goal.goal_type)?.label || goal.goal_type}
                        </Badge>
                        
                        {goal.deadline && (
                          <Badge variant={isGoalOverdue(goal) ? "destructive" : "outline"}>
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(goal)}
                        disabled={goal.completed}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStudyGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {goal.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {goal.description}
                      </p>
                    )}

                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Progression: {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                        <span className="font-semibold text-medical-blue">
                          {getProgressPercentage(goal)}%
                        </span>
                      </div>
                      
                      <Progress 
                        value={getProgressPercentage(goal)}
                        className="h-2"
                      />
                    </div>

                    {/* Actions rapides */}
                    {!goal.completed && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, goal.current_value + 1)}
                          className="flex-1"
                        >
                          +1 {goal.unit}
                        </Button>
                        
                        {goal.current_value < goal.target_value && (
                          <Button
                            size="sm"
                            onClick={() => completeGoal(goal.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                      </div>
                    )}

                    {goal.completed && goal.completed_at && (
                      <div className="text-xs text-green-600 text-center bg-green-100 p-2 rounded">
                        🎉 Objectif atteint le {new Date(goal.completed_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bouton de rechargement */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={loadStudyGoals}
            disabled={loading}
          >
            {loading ? '🔄 Chargement...' : '🔄 Actualiser'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyGoals;
