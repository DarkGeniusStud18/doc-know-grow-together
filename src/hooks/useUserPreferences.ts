
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userPreferencesService } from '@/lib/database/userPreferences';
import { UserPreferences } from '@/types/database';
import { toast } from 'sonner';

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let prefs = await userPreferencesService.getUserPreferences(user.id);
      
      // Create default preferences if none exist
      if (!prefs) {
        prefs = await userPreferencesService.createUserPreferences({
          user_id: user.id,
          email_notifications: true,
          push_notifications: true,
          study_reminders: true,
          weekly_reports: true,
          language: 'fr',
          timezone: 'Europe/Paris'
        });
      }
      
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const updatedPreferences = await userPreferencesService.updateUserPreferences(user.id, updates);
      setPreferences(updatedPreferences);
      toast.success('Préférences mises à jour');
      return updatedPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Erreur lors de la mise à jour des préférences');
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    refreshPreferences: loadPreferences
  };
};
