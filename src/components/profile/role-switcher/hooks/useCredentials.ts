
/**
 * Hook for managing switch credentials - updated with proper error handling
 */
import { useState, useEffect } from 'react';
import { getSwitchCredentials } from '@/lib/supabase/query-helpers';
import { isValidSwitchCredentials, hasData, hasError } from '@/lib/utils/type-guards';
import { SwitchCredentials } from '../types';

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<SwitchCredentials | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        console.log('Récupération des identifiants de changement de rôle');
        
        const response = await getSwitchCredentials();
          
        if (hasError(response)) {
          console.error('Erreur lors de la récupération des identifiants:', response.error);
          return;
        }
        
        if (hasData(response) && isValidSwitchCredentials(response.data)) {
          console.log('Identifiants récupérés avec succès');
          setCredentials({
            pin_code: response.data.pin_code,
            password: response.data.password
          });
        } else {
          console.log('Aucun identifiant configuré ou données invalides');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des identifiants:', error);
      }
    };
    
    fetchCredentials();
  }, []);

  return credentials;
};
