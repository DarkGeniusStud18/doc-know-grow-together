
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
    
    // Transform the data to match our StudyPlan interface
    return (data || []).map(plan => ({
      ...plan,
      subjects: Array.isArray(plan.subjects) ? plan.subjects : []
    })) as StudyPlan[];
  },

  async getActiveStudyPlan(userId: string): Promise<StudyPlan | null> {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    // Transform the data to match our StudyPlan interface
    return {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    } as StudyPlan;
  },

  async createStudyPlan(plan: Omit<StudyPlan, 'id' | 'created_at' | 'updated_at'>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    
    // Transform the data to match our StudyPlan interface
    return {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    } as StudyPlan;
  },

  async updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform the data to match our StudyPlan interface
    return {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : []
    } as StudyPlan;
  },

  async deleteStudyPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
