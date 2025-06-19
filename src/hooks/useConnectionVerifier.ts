
/**
 * Hook pour vérifier les connexions de base de données
 * Fournit une interface simple pour tester la connectivité
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dbConnectionVerifier } from '@/lib/database/connectionVerifier';

export const useConnectionVerifier = () => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any[]>([]);

  /**
   * Lance une vérification complète des connexions
   */
  const verifyAllConnections = useCallback(async () => {
    if (isVerifying) return;

    setIsVerifying(true);
    console.log('useConnectionVerifier: Début de la vérification complète');

    try {
      const success = await dbConnectionVerifier.verifyAllConnections(user?.id);
      const results = dbConnectionVerifier.getTestResults();
      
      setVerificationResults(results);
      
      console.log('useConnectionVerifier: Vérification terminée', {
        success,
        totalTests: results.length,
        successCount: results.filter(r => r.status === 'success').length,
        errorCount: results.filter(r => r.status === 'error').length
      });

      return success;
    } catch (error) {
      console.error('useConnectionVerifier: Erreur lors de la vérification:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user?.id, isVerifying]);

  /**
   * Teste une table spécifique
   */
  const testTable = useCallback(async (tableName: string) => {
    return await dbConnectionVerifier.testSpecificConnection(tableName, user?.id);
  }, [user?.id]);

  /**
   * Réinitialise les résultats de vérification
   */
  const resetResults = useCallback(() => {
    setVerificationResults([]);
  }, []);

  return {
    isVerifying,
    verificationResults,
    verifyAllConnections,
    testTable,
    resetResults,
    hasErrors: verificationResults.some(r => r.status === 'error'),
    successCount: verificationResults.filter(r => r.status === 'success').length,
    errorCount: verificationResults.filter(r => r.status === 'error').length
  };
};
