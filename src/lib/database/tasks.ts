
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskCategory } from '@/types/database';

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(task => ({
      ...task,
      priority: task.priority as 'low' | 'medium' | 'high',
      status: task.status as 'pending' | 'in_progress' | 'completed'
    }));
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      priority: data.priority as 'low' | 'medium' | 'high',
      status: data.status as 'pending' | 'in_progress' | 'completed'
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      priority: data.priority as 'low' | 'medium' | 'high',
      status: data.status as 'pending' | 'in_progress' | 'completed'
    };
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTaskCategories(userId: string): Promise<TaskCategory[]> {
    const { data, error } = await supabase
      .from('task_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createTaskCategory(category: Omit<TaskCategory, 'id' | 'created_at' | 'updated_at'>): Promise<TaskCategory> {
    const { data, error } = await supabase
      .from('task_categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
