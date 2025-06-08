
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studyPlanService } from '@/lib/database/studyPlans';
import { StudyPlan } from '@/types/database';
import { toast } from 'sonner';

export const useStudyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlans = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [plansData, activePlanData] = await Promise.all([
        studyPlanService.getStudyPlans(user.id),
        studyPlanService.getActiveStudyPlan(user.id)
      ]);
      setPlans(plansData);
      setActivePlan(activePlanData);
    } catch (error) {
      console.error('Error loading study plans:', error);
      toast.error('Erreur lors du chargement des plans d\'étude');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [user]);

  const createPlan = async (plan: Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newPlan = await studyPlanService.createStudyPlan({ ...plan, user_id: user.id });
      setPlans(prev => [newPlan, ...prev]);
      if (plan.is_active) {
        setActivePlan(newPlan);
      }
      toast.success('Plan d\'étude créé avec succès');
      return newPlan;
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast.error('Erreur lors de la création du plan d\'étude');
    }
  };

  const updatePlan = async (id: string, updates: Partial<StudyPlan>) => {
    try {
      const updatedPlan = await studyPlanService.updateStudyPlan(id, updates);
      setPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan));
      if (activePlan?.id === id) {
        setActivePlan(updatedPlan);
      }
      toast.success('Plan d\'étude mis à jour');
      return updatedPlan;
    } catch (error) {
      console.error('Error updating study plan:', error);
      toast.error('Erreur lors de la mise à jour du plan d\'étude');
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await studyPlanService.deleteStudyPlan(id);
      setPlans(prev => prev.filter(plan => plan.id !== id));
      if (activePlan?.id === id) {
        setActivePlan(null);
      }
      toast.success('Plan d\'étude supprimé');
    } catch (error) {
      console.error('Error deleting study plan:', error);
      toast.error('Erreur lors de la suppression du plan d\'étude');
    }
  };

  return {
    plans,
    activePlan,
    isLoading,
    createPlan,
    updatePlan,
    deletePlan,
    refreshPlans: loadPlans
  };
};
