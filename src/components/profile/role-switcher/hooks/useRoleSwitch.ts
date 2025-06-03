
/**
 * Hook for role switching logic - updated with proper error handling
 */
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/supabase/query-helpers';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/lib/auth/types';

export const useRoleSwitch = () => {
  const { user, updateCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const switchRole = async (newRole: UserRole): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      console.log(`Changement de rôle vers: ${newRole}`);
      
      const { error } = await updateProfile(user.id, { role: newRole });
      
      if (error) {
        console.error('Erreur lors du changement de rôle:', error);
        throw error;
      }
      
      // Update local user state
      updateCurrentUser({
        ...user,
        role: newRole
      });
      
      console.log('Rôle changé avec succès');
      toast.success(`Interface changée vers: ${newRole === 'student' ? 'Étudiant' : 'Professionnel'}`);
      return true;
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
      toast.error('Erreur lors du changement de rôle');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    switchRole,
    isLoading
  };
};
