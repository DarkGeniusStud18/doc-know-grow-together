
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { checkPremiumStatus } from '@/lib/auth/services/subscription-service';

/**
 * Hook pour vérifier et gérer le statut premium de l'utilisateur
 * Utilise un système de cache pour optimiser les performances
 * 
 * @returns Objet contenant le statut premium et l'état de chargement
 */
export const usePremiumStatus = () => {
  const { user } = useAuth();
  
  // États pour la gestion du statut premium
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Clé de cache basée sur l'ID utilisateur
  const cacheKey = `premium_status_${user?.id || 'no_user'}`;
  const cacheTimestampKey = `${cacheKey}_timestamp`;

  /**
   * Vérifie si le cache est valide (moins de 5 minutes)
   * @returns true si le cache est valide, false sinon
   */
  const isCacheValid = useCallback((): boolean => {
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    if (!cachedTimestamp) return false;

    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes en millisecondes
    
    return (now - timestamp) < fiveMinutes;
  }, [cacheTimestampKey]);

  /**
   * Met en cache le statut premium
   * @param status - Statut premium à mettre en cache
   */
  const cacheStatus = useCallback((status: boolean): void => {
    localStorage.setItem(cacheKey, String(status));
    localStorage.setItem(cacheTimestampKey, String(Date.now()));
    console.log('PremiumStatus: Statut mis en cache:', status);
  }, [cacheKey, cacheTimestampKey]);

  /**
   * Récupère le statut depuis le cache
   * @returns Statut premium ou null si pas en cache
   */
  const getCachedStatus = useCallback((): boolean | null => {
    const cachedStatus = localStorage.getItem(cacheKey);
    return cachedStatus ? cachedStatus === 'true' : null;
  }, [cacheKey]);

  useEffect(() => {
    /**
     * Vérifie le statut premium de l'utilisateur
     * Utilise le cache si disponible et valide
     */
    const checkStatus = async () => {
      if (!user) {
        console.log('PremiumStatus: Pas d\'utilisateur connecté');
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        // Vérification du cache en premier
        if (isCacheValid()) {
          const cachedStatus = getCachedStatus();
          if (cachedStatus !== null) {
            console.log('PremiumStatus: Utilisation du cache:', cachedStatus);
            setIsPremium(cachedStatus);
            setIsLoading(false);
            return;
          }
        }
        
        // Récupération depuis l'API si pas de cache valide
        console.log('PremiumStatus: Vérification du statut depuis l\'API');
        const hasPremium = await checkPremiumStatus(user.id);
        
        setIsPremium(hasPremium);
        cacheStatus(hasPremium);
        
        console.log('PremiumStatus: Statut vérifié:', hasPremium);
      } catch (error) {
        console.error('PremiumStatus: Erreur lors de la vérification:', error);
        setIsPremium(false);
        
        // En cas d'erreur, utiliser le cache si disponible
        const cachedStatus = getCachedStatus();
        if (cachedStatus !== null) {
          setIsPremium(cachedStatus);
          console.log('PremiumStatus: Utilisation du cache de secours:', cachedStatus);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [user, isCacheValid, getCachedStatus, cacheStatus]);

  return { isPremium, isLoading };
};
