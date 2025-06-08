
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '@/types/database';

export const userPreferencesService = {
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUserPreferences(preferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert([preferences])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
