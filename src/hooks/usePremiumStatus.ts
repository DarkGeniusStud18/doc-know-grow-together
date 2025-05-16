import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkPremiumStatus } from '@/lib/auth/services/subscription-service';

/**
 * Hook to check if the current user has premium access
 * @returns Object containing isPremium status and loading state
 */
export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Create a cache key based on the user ID
  const cacheKey = `premium_status_${user?.id || 'no_user'}`;

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        // Try to get cached status first (valid for 5 minutes)
        const cachedStatus = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        // If we have a cached value and it's less than 5 minutes old, use it
        if (cachedStatus && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
          
          if (now - timestamp < fiveMinutes) {
            setIsPremium(cachedStatus === 'true');
            setIsLoading(false);
            return;
          }
        }
        
        // Otherwise, fetch from API
        const hasPremium = await checkPremiumStatus(user.id);
        setIsPremium(hasPremium);
        
        // Cache the result for 5 minutes
        localStorage.setItem(cacheKey, String(hasPremium));
        localStorage.setItem(`${cacheKey}_timestamp`, String(Date.now()));
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [user, cacheKey]);

  return { isPremium, isLoading };
};
