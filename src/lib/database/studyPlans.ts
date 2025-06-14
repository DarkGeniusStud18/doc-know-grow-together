
import { supabase } from '@/integrations/supabase/client';
import { StudyPlan } from '@/types/database';

export const studyPlanService = {
  async getStudyPlans(userId: string): Promise<StudyPlan[]> {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(plan => ({
      ...plan,
      subjects: Array.isArray(plan.subjects) ? plan.subjects : []
    }));
  },

  async getActiveStudyPlan(userId: string): Promise<StudyPlan | null> {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data ? {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    } : null;
  },

  async createStudyPlan(plan: Omit<StudyPlan, 'id' | 'created_at' | 'updated_at'>): Promise<StudyPlan> {
    // If this is being set as active, deactivate other plans first
    if (plan.is_active) {
      await supabase
        .from('study_plans')
        .update({ is_active: false })
        .eq('user_id', plan.user_id);
    }

    const { data, error } = await supabase
      .from('study_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    };
  },

  async updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    };
  },

  async deleteStudyPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
