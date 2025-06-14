
import { supabase } from '@/integrations/supabase/client';
import { Presentation, PresentationSlide } from '@/types/database';

export const presentationService = {
  async getPresentations(userId: string): Promise<Presentation[]> {
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createPresentation(presentation: Omit<Presentation, 'id' | 'created_at' | 'updated_at'>): Promise<Presentation> {
    const { data, error } = await supabase
      .from('presentations')
      .insert([presentation])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePresentation(id: string, updates: Partial<Presentation>): Promise<Presentation> {
    const { data, error } = await supabase
      .from('presentations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePresentation(id: string): Promise<void> {
    const { error } = await supabase
      .from('presentations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPresentationSlides(presentationId: string): Promise<PresentationSlide[]> {
    const { data, error } = await supabase
      .from('presentation_slides')
      .select('*')
      .eq('presentation_id', presentationId)
      .order('slide_order');

    if (error) throw error;
    return data || [];
  },

  async createSlide(slide: Omit<PresentationSlide, 'id' | 'created_at' | 'updated_at'>): Promise<PresentationSlide> {
    const { data, error } = await supabase
      .from('presentation_slides')
      .insert([slide])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSlide(id: string, updates: Partial<PresentationSlide>): Promise<PresentationSlide> {
    const { data, error } = await supabase
      .from('presentation_slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSlide(id: string): Promise<void> {
    const { error } = await supabase
      .from('presentation_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
