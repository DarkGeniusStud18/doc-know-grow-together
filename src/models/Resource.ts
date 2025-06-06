
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DbContentType = Database['public']['Enums']['content_type'];

export type ContentType = DbContentType;

export interface Resource {
  id: string;
  title: string;
  description: string;
  content_type: ContentType;
  category: string;
  author?: string;
  language: string;
  url: string;
  thumbnail?: string;
  featured: boolean;
  requires_verification: boolean;
  is_premium: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  created_by?: string;
}

export async function getResources(
  filters: {
    category?: string;
    content_type?: string;
    featured?: boolean;
    language?: string;
    searchQuery?: string;
  } = {}
): Promise<Resource[]> {
  try {
    let query = supabase.from('resources').select('*');
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.content_type && filters.content_type !== 'all') {
      query = query.eq('content_type', filters.content_type as ContentType);
    }
    
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    
    if (filters.language) {
      query = query.eq('language', filters.language);
    }
    
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching resources:', error);
      throw new Error('Failed to fetch resources');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getResources:', error);
    return [];
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching resource:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getResourceById:', error);
    return null;
  }
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource | null> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating resource:', error);
      throw new Error('Failed to create resource');
    }
    
    return data || null;
  } catch (error) {
    console.error('Error in createResource:', error);
    return null;
  }
}

export async function updateResource(id: string, updates: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>): Promise<Resource | null> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource');
    }
    
    return data || null;
  } catch (error) {
    console.error('Error in updateResource:', error);
    return null;
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource');
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteResource:', error);
    return false;
  }
}
