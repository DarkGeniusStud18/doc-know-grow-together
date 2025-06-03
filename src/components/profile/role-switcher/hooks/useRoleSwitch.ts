
/**
 * Hook for handling role switching logic
 */
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { SwitchCredentials } from '../types';

export const useRoleSwitch = () => {
  const { user, updateCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const switchRole = async (
    pinCode: string, 
    password: string, 
    credentials: SwitchCredentials | null
  ) => {
    if (!user) {
      console.error('Aucun utilisateur connecté');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Tentative de changement de rôle pour:', user.id);
      
      if (!credentials || pinCode !== credentials.pin_code || password !== credentials.password) {
        console.error('Identifiants incorrects');
        toast.error("Code PIN ou mot de passe incorrect");
        setIsLoading(false);
        return false;
      }
      
      const newRole = user.role === 'student' ? 'professional' : 'student';
      console.log('Changement de rôle:', user.role, '->', newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        throw error;
      }
      
      updateCurrentUser({
        ...user,
        role: newRole
      });
      
      const roleText = newRole === 'student' ? 'Étudiant' : 'Professionnel';
      toast.success(`Interface changée avec succès: ${roleText}`);
      
      console.log('Changement de rôle réussi');
      return true;
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
      toast.error("Erreur lors du changement d'interface");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { switchRole, isLoading };
};
