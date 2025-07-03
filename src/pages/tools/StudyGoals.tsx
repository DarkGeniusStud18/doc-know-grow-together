
/**
 * 🎯 Objectifs d'Étude - Version Mobile Responsive Optimisée
 * 
 * Fonctionnalités principales :
 * - Création et gestion d'objectifs personnalisables
 * - Suivi des progrès en temps réel
 * - Différents types d'objectifs (temps, sessions, révisions)
 * - Notifications et rappels
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Trophy,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface StudyGoal {
  id: string;
  title: string;
  description?: string;
  goalType: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

const GOAL_TYPES = [
  { value: 'study_time', label: 'Temps d\'étude', icon: Clock, unit: 'minutes' },
  { value: 'sessions', label: 'Nombre de sessions', icon: BookOpen, unit: 'sessions' },
  { value: 'pages', label: 'Pages à lire', icon: BookOpen, unit: 'pages' },
  { value: 'exercises', label: 'Exercices à faire', icon: Target, unit: 'exercices' },
  { value: 'custom', label: 'Objectif personnalisé', icon: Trophy, unit: 'unités' }
];

const StudyGoals: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);

  // Formulaire pour nouveau/édition objectif
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: '',
    targetValue: 0,
    unit: 'minutes',
    deadline: ''
  });

  // Charger les objectifs
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  /**
   * 📊 Charger les objectifs de l'utilisateur
   */
  const loadGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors du chargement des objectifs:', error);
        toast.error('Impossible de charger les objectifs');
        return;
      }

      if (data) {
        const formattedGoals: StudyGoal[] = data.map(goal => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          goalType: goal.goal_type,
          targetValue: goal.target_value,
          currentValue: goal.current_value,
          unit: goal.unit,
          deadline: goal.deadline,
          completed: goal.completed,
          completedAt: goal.completed_at,
          createdAt: goal.created_at
        }));
        
        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Créer un nouvel objectif
   */
  const createGoal = async () => {
    if (!user || !formData.title.trim() || !formData.goalType || formData.targetValue <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          goal_type: formData.goalType,
          target_value: formData.targetValue,
          unit: formData.unit,
          deadline: formData.deadline || null,
          current_value: 0,
          completed: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création:', error);
        toast.error('Impossible de créer l\'objectif');
        return;
      }

      toast.success('Objectif créé avec succès !');
      setIsDialogOpen(false);
      resetForm();
      await loadGoals();
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de l\'objectif');
    }
  };

  /**
   * ✏️ Modifier un objectif existant
   */
  const updateGoal = async () => {
    if (!user || !editingGoal || !formData.title.trim()) {
      toast.error('Données invalides pour la modification');
      return;
    }

    try {
      const { error } = await supabase
        .from('study_goals')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          goal_type: formData.goalType,
          target_value: formData.targetValue,
          unit: formData.unit,
          deadline: formData.deadline || null
        })
        .eq('id', editingGoal.id);

      if (error) {
        console.error('❌ Erreur lors de la modification:', error);
        toast.error('Impossible de modifier l\'objectif');
        return;
      }

      toast.success('Objectif modifié avec succès !');
      setIsDialogOpen(false);
      setEditingGoal(null);
      resetForm();
      await loadGoals();
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  /**
   * 🗑️ Supprimer un objectif
   */
  const deleteGoal = async (goalId: string) => {
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
        console.error('❌ Erreur lors de la suppression:', error);
        toast.error('Impossible de supprimer l\'objectif');
        return;
      }

      toast.success('Objectif supprimé avec succès');
      await loadGoals();
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  /**
   * ✅ Marquer un objectif comme terminé
   */
  const completeGoal = async (goalId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_goals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          current_value: goals.find(g => g.id === goalId)?.targetValue || 0
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erreur lors de la completion:', error);
        toast.error('Impossible de marquer l\'objectif comme terminé');
        return;
      }

      toast.success('🎉 Félicitations ! Objectif accompli !');
      await loadGoals();
    } catch (error) {
      console.error('❌ Erreur lors de la completion:', error);
      toast.error('Erreur lors de la completion');
    }
  };

  /**
   * 📝 Réinitialiser le formulaire
   */
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goalType: '',
      targetValue: 0,
      unit: 'minutes',
      deadline: ''
    });
  };

  /**
   * ✏️ Préparer l'édition d'un objectif
   */
  const startEditing = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      unit: goal.unit,
      deadline: goal.deadline || ''
    });
    setIsDialogOpen(true);
  };

  /**
   * 📊 Calculer le pourcentage de progression
   */
  const getProgressPercentage = (goal: StudyGoal): number => {
    if (goal.targetValue === 0) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  /**
   * 🎨 Obtenir la couleur de la barre de progression
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 max-w-6xl">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Objectifs d'Étude</h1>
              <p className="text-sm sm:text-base text-gray-500">Définissez et suivez vos objectifs académiques</p>
            </div>
          </div>
          
          {/* Bouton d'ajout */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-medical-blue hover:bg-medical-blue/90 w-full sm:w-auto"
                onClick={() => {
                  setEditingGoal(null);
                  resetForm();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Objectif
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Titre *</label>
                  <Input
                    placeholder="Ex: Lire 50 pages de cardiologie"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Description optionnelle de l'objectif"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Type d'objectif *</label>
                  <Select 
                    value={formData.goalType} 
                    onValueChange={(value) => {
                      const goalType = GOAL_TYPES.find(t => t.value === value);
                      setFormData({
                        ...formData, 
                        goalType: value,
                        unit: goalType?.unit || 'unités'
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Objectif *</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={formData.targetValue || ''}
                      onChange={(e) => setFormData({...formData, targetValue: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unité</label>
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="Ex: pages, heures"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Date limite (optionnel)</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={editingGoal ? updateGoal : createGoal}
                    className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
                  >
                    {editingGoal ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingGoal(null);
                      resetForm();
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

        {/* Liste des objectifs */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
          </div>
        ) : goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun objectif défini</h3>
              <p className="text-gray-600 mb-4">Créez votre premier objectif d'étude pour commencer votre suivi</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal);
              const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed;
              const IconComponent = GOAL_TYPES.find(t => t.value === goal.goalType)?.icon || Target;
              
              return (
                <Card key={goal.id} className={`transition-all duration-200 hover:shadow-md ${goal.completed ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-5 w-5 ${goal.completed ? 'text-green-600' : 'text-medical-blue'}`} />
                        <div className="flex flex-wrap gap-1">
                          {goal.completed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Terminé
                            </Badge>
                          )}
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              En retard
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!goal.completed && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(goal)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.description && (
                      <CardDescription className="text-sm">{goal.description}</CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-gray-600">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    
                    {/* Date limite */}
                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Échéance : {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    
                    {/* Actions */}
                    {!goal.completed && progress < 100 && (
                      <Button
                        onClick={() => completeGoal(goal.id)}
                        variant="outline"
                        size="sm"
                        className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marquer comme terminé
                      </Button>
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
