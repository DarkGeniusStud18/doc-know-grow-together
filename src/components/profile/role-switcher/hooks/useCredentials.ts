
/**
 * Hook for managing switch credentials - updated with proper error handling
 */
import { useState, useEffect } from 'react';
import { getSwitchCredentials, hasData } from '@/lib/supabase/query-helpers';
import { SwitchCredentials } from '../types';

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<SwitchCredentials | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        console.log('Récupération des identifiants de changement de rôle');
        
        const response = await getSwitchCredentials();
          
        if (response.error) {
          console.error('Erreur lors de la récupération des identifiants:', response.error);
          return;
        }
        
        if (hasData(response)) {
          console.log('Identifiants récupérés avec succès');
          setCredentials({
            pin_code: response.data.pin_code,
            password: response.data.password
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
