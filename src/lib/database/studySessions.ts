
import { supabase } from '@/integrations/supabase/client';
import { StudySession, StudySessionNote } from '@/types/database';

export const studySessionService = {
  async getStudySessions(userId: string): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createStudySession(session: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([session])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSessionNotes(sessionId: string): Promise<StudySessionNote[]> {
    const { data, error } = await supabase
      .from('study_session_notes')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async addSessionNote(note: Omit<StudySessionNote, 'id' | 'created_at' | 'updated_at'>): Promise<StudySessionNote> {
    const { data, error } = await supabase
      .from('study_session_notes')
      .insert([note])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserStats(userId: string, period: 'day' | 'week' | 'month' = 'week') {
    const { data, error } = await supabase
      .rpc('get_user_study_stats', {
        p_user_id: userId,
        p_period: period
      });

    if (error) throw error;
    return data?.[0] || { total_hours: 0, avg_session_duration: 0, most_studied_subject: 'N/A', sessions_count: 0 };
  }
};
