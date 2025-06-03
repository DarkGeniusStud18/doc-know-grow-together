
/**
 * Hook for managing switch credentials
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SwitchCredentials } from '../types';

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<SwitchCredentials | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        console.log('Récupération des identifiants de changement de rôle');
        
        const { data, error } = await supabase
          .from('switch_credentials')
          .select('pin_code, password')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error('Erreur lors de la récupération des identifiants:', error);
          return;
        }
        
        if (data) {
          console.log('Identifiants récupérés avec succès');
          setCredentials({
            pin_code: data.pin_code,
            password: data.password
          });
        } else {
          console.log('Aucun identifiant configuré');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des identifiants:', error);
      }
    };
    
    fetchCredentials();
  }, []);

  return credentials;
};
