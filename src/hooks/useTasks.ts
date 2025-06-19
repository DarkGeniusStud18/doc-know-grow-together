
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/lib/database/tasks';
import { Task, TaskCategory } from '@/types/database';
import { toast } from 'sonner';
import { useRealtimeSync } from './useRealtimeSync';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasks(user.id),
        taskService.getTaskCategories(user.id)
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  // Real-time synchronization
  useRealtimeSync('tasks', loadTasks);
  useRealtimeSync('task_categories', loadTasks);

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newTask = await taskService.createTask({ ...task, user_id: user.id });
      setTasks(prev => [newTask, ...prev]);
      toast.success('Tâche créée avec succès');
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast.success('Tâche mise à jour');
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Tâche supprimée');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erreur lors de la suppression de la tâche');
    }
  };

  const createCategory = async (category: Omit<TaskCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newCategory = await taskService.createTaskCategory({ ...category, user_id: user.id });
      setCategories(prev => [...prev, newCategory]);
      toast.success('Catégorie créée avec succès');
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Erreur lors de la création de la catégorie');
    }
  };

  return {
    tasks,
    categories,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    createCategory,
    refreshTasks: loadTasks
  };
};
