
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
    return data || [];
  },

  async getActiveStudyPlan(userId: string): Promise<StudyPlan | null> {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createStudyPlan(plan: Omit<StudyPlan, 'id' | 'created_at' | 'updated_at'>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStudyPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
