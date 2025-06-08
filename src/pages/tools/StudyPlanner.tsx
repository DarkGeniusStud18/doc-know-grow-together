
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, BookOpen, Target } from 'lucide-react';
import { useStudyPlans } from '@/hooks/useStudyPlans';

const StudyPlanner: React.FC = () => {
  const { plans, activePlan, isLoading, createPlan, updatePlan, deletePlan } = useStudyPlans();
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    subjects: [] as string[],
    is_active: false
  });
  const [newSubject, setNewSubject] = useState('');

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.title.trim() || !newPlan.start_date || !newPlan.end_date) return;

    await createPlan({
      ...newPlan,
      progress: 0,
      subjects: newPlan.subjects.map(subject => ({ name: subject, completed: false }))
    });

    setNewPlan({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      subjects: [],
      is_active: false
    });
    setShowNewPlanForm(false);
  };

  const addSubject = () => {
    if (newSubject.trim() && !newPlan.subjects.includes(newSubject.trim())) {
      setNewPlan(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setNewPlan(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const togglePlanActive = async (planId: string, isActive: boolean) => {
    await updatePlan(planId, { is_active: !isActive });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Planificateur d'étude</h1>
          <Button onClick={() => setShowNewPlanForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau plan
          </Button>
        </div>

        {/* Active Plan */}
        {activePlan && (
          <Card className="border-medical-teal border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-medical-teal" />
                  Plan actif: {activePlan.title}
                </CardTitle>
                <Badge variant="default">Actif</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{activePlan.description}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Début: {new Date(activePlan.start_date).toLocaleDateString('fr-FR')}</span>
                  <span>Fin: {new Date(activePlan.end_date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-medical-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activePlan.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">Progression: {activePlan.progress}%</div>
                {activePlan.subjects && Array.isArray(activePlan.subjects) && activePlan.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activePlan.subjects.map((subject: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {typeof subject === 'string' ? subject : subject.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Plan Form */}
        {showNewPlanForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nouveau plan d'étude</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <Input
                  placeholder="Titre du plan"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description du plan"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de début</label>
                    <Input
                      type="date"
                      value={newPlan.start_date}
                      onChange={(e) => setNewPlan({ ...newPlan, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de fin</label>
                    <Input
                      type="date"
                      value={newPlan.end_date}
                      onChange={(e) => setNewPlan({ ...newPlan, end_date: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Matières</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Ajouter une matière"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                    />
                    <Button type="button" onClick={addSubject}>Ajouter</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newPlan.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSubject(subject)}>
                        {subject} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newPlan.is_active}
                    onChange={(e) => setNewPlan({ ...newPlan, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active" className="text-sm">Définir comme plan actif</label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Créer le plan</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewPlanForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Plans List */}
        <div className="grid gap-4">
          {plans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun plan d'étude pour le moment.</p>
                <p className="text-sm text-gray-400 mt-2">Créez votre premier plan pour organiser vos études !</p>
              </CardContent>
            </Card>
          ) : (
            plans.map((plan) => (
              <Card key={plan.id} className={plan.is_active ? 'border-medical-teal' : ''}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{plan.title}</h3>
                        {plan.is_active && <Badge variant="default">Actif</Badge>}
                      </div>
                      <p className="text-gray-600 mb-3">{plan.description}</p>
                      <div className="flex gap-4 text-sm text-gray-600 mb-3">
                        <span>Début: {new Date(plan.start_date).toLocaleDateString('fr-FR')}</span>
                        <span>Fin: {new Date(plan.end_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-medical-teal h-2 rounded-full transition-all duration-300"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 mb-3">Progression: {plan.progress}%</div>
                      {plan.subjects && Array.isArray(plan.subjects) && plan.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {plan.subjects.map((subject: any, index: number) => (
                            <Badge key={index} variant="outline">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {typeof subject === 'string' ? subject : subject.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePlanActive(plan.id, plan.is_active)}
                      >
                        {plan.is_active ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPlanner;
