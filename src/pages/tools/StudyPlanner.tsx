
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, Edit, Trash2, Target, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  subjects: string[];
  progress: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const StudyPlanner: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    subjects: ['']
  });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['study-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure subjects is always an array
      return (data || []).map(plan => ({
        ...plan,
        subjects: Array.isArray(plan.subjects) ? plan.subjects : 
                 typeof plan.subjects === 'string' ? JSON.parse(plan.subjects) : []
      })) as StudyPlan[];
    },
    enabled: !!user
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          user_id: user.id,
          ...planData,
          subjects: planData.subjects.filter(s => s.trim() !== '')
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        subjects: Array.isArray(data.subjects) ? data.subjects : 
                 typeof data.subjects === 'string' ? JSON.parse(data.subjects) : []
      } as StudyPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      setDialogOpen(false);
      resetForm();
      toast.success('Plan d\'étude créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast.error('Erreur lors de la création du plan');
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, ...planData }: Partial<StudyPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('study_plans')
        .update({
          ...planData,
          subjects: planData.subjects?.filter(s => s.trim() !== ''),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        subjects: Array.isArray(data.subjects) ? data.subjects : 
                 typeof data.subjects === 'string' ? JSON.parse(data.subjects) : []
      } as StudyPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      setDialogOpen(false);
      setEditingPlan(null);
      resetForm();
      toast.success('Plan mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
      toast.error('Erreur lors de la mise à jour du plan');
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      toast.success('Plan supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting plan:', error);
      toast.error('Erreur lors de la suppression du plan');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      subjects: ['']
    });
  };

  const handleEdit = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description || '',
      start_date: plan.start_date,
      end_date: plan.end_date,
      subjects: Array.isArray(plan.subjects) && plan.subjects.length > 0 ? plan.subjects : ['']
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.start_date || !formData.end_date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const planData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date,
      subjects: formData.subjects.filter(s => s.trim() !== ''),
      progress: 0,
      is_active: true
    };

    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, ...planData });
    } else {
      createPlanMutation.mutate(planData);
    }
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  const updateSubject = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => i === index ? value : subject)
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              <Calendar className="h-8 w-8" />
              Planificateur d'étude
            </h1>
            <p className="text-gray-600 mt-2">Organisez vos révisions avec des plans personnalisés</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingPlan(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPlan ? 'Modifier le plan' : 'Créer un nouveau plan'}
                </DialogTitle>
                <DialogDescription>
                  Définissez votre plan d'étude avec les matières et la période concernée
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre du plan *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Révisions partiels de décembre"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez vos objectifs pour ce plan d'étude"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de début *</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de fin *</label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Matières</label>
                  <div className="space-y-2">
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          placeholder="Nom de la matière"
                        />
                        {formData.subjects.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSubject(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSubject}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une matière
                    </Button>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button className='mt-2' type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                  >
                    {editingPlan ? 'Mettre à jour' : 'Créer le plan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {plans.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucun plan d'étude</h3>
              <p className="text-gray-500 mb-6">Créez votre premier plan pour organiser vos révisions</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const daysRemaining = getDaysRemaining(plan.end_date);
              const isExpired = daysRemaining < 0;
              const subjects = Array.isArray(plan.subjects) ? plan.subjects : [];
              
              return (
                <Card key={plan.id} className={`transition-all hover:shadow-lg ${isExpired ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {plan.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePlanMutation.mutate(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4" />
                      <span>
                        {isExpired ? 'Expiré' : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>Progression</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                    
                    {subjects.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Matières:</p>
                        <div className="flex flex-wrap gap-1">
                          {subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{subjects.length - 3}
                            </Badge>
                          )}
                        </div>
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

export default StudyPlanner;
