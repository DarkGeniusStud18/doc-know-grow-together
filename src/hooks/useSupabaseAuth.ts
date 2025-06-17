
import { useState, useEffect } from 'react';
import { supabase, isNativeEnvironment } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';
import { getCurrentUser } from '@/lib/auth/user-service';
import { handleNativeAuthSuccess, handleNativeAuthError, checkNetworkConnectivity } from '@/lib/auth/native-auth-helper';

export type { User as AuthUser }; // Re-export pour la compatibilité

/**
 * Hook d'authentification Supabase optimisé pour un accès immédiat
 * Supprime les vérifications inutiles pour améliorer l'UX
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fonction pour vérifier la session utilisateur - VERSION OPTIMISÉE
    const checkUserSession = async () => {
      console.log('🔍 AuthOptimized: Vérification rapide de session...');
      
      // Vérification de la connectivité en environnement natif seulement
      if (isNativeEnvironment()) {
        const networkStatus = await checkNetworkConnectivity();
        setIsConnected(networkStatus);
        
        if (!networkStatus) {
          console.log('📵 Pas de connexion réseau - Chargement des données en cache');
          // Ici, vous pourriez charger des données utilisateur en cache
        }
      }
      
      // Récupération IMMÉDIATE de l'utilisateur sans délai
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
          
          // Log simplifié pour éviter le spam
          if (currentUser) {
            console.log('✅ AuthOptimized: Utilisateur connecté');
          } else {
            console.log('ℹ️ AuthOptimized: Aucun utilisateur');
          }
        }
      } catch (error) {
        console.error('❌ AuthOptimized: Erreur session:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Exécution immédiate - PAS de délai
    checkUserSession();

    // Configuration de l'écouteur d'événements d'authentification - VERSION SIMPLIFIÉE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log(`🔐 AuthOptimized: ${event}`);

      if (event === 'SIGNED_OUT') {
        // Nettoyage rapide
        if(localStorage.getItem('demoUser')) {
          localStorage.removeItem('demoUser');
        }
        
        if (isNativeEnvironment()) {
          try {
            const { Preferences } = await import('@capacitor/preferences');
            await Preferences.remove({ key: 'demoUser' });
          } catch (error) {
            // Ignorer les erreurs de nettoyage natif
          }
        }
        
        setUser(null);
        console.log('👋 AuthOptimized: Déconnexion');
        
      } else if (session) {
        // Mise à jour IMMÉDIATE pour les événements avec session
        console.log('🔄 AuthOptimized: Mise à jour session');
        
        try {
          const currentUser = await getCurrentUser();
          if (isMounted) {
            setUser(currentUser);
            
            // Feedback natif UNIQUEMENT pour les nouvelles connexions
            if (event === 'SIGNED_IN' && currentUser && isNativeEnvironment()) {
              await handleNativeAuthSuccess(currentUser);
            }
          }
        } catch (error) {
          console.error('❌ AuthOptimized: Erreur récupération utilisateur:', error);
          if (isNativeEnvironment()) {
            await handleNativeAuthError(error, 'récupération utilisateur');
          }
        }
      }
    });

    // Configuration de la surveillance réseau pour les environnements natifs seulement
    let networkListener: any = null;
    if (isNativeEnvironment()) {
      import('@capacitor/network').then(({ Network }) => {
        networkListener = Network.addListener('networkStatusChange', (status) => {
          setIsConnected(status.connected);
          
          // Reconnexion SANS vérification excessive
          if (status.connected && !user) {
            console.log('🔄 AuthOptimized: Reconnexion rapide...');
            checkUserSession();
          }
        });
      }).catch(() => {
        // Surveillance réseau non disponible - ignorer silencieusement
      });
    }

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      
      if (networkListener) {
        networkListener.remove();
      }
    };
  }, []);

  return {
    user,
    loading,
    isConnected,
  };
};
