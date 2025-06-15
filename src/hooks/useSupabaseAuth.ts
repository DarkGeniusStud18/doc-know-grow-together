
import { useState, useEffect } from 'react';
import { supabase, isNativeEnvironment } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';
import { getCurrentUser } from '@/lib/auth/user-service';
import { handleNativeAuthSuccess, handleNativeAuthError, checkNetworkConnectivity } from '@/lib/auth/native-auth-helper';

export type { User as AuthUser }; // Re-export pour la compatibilité

/**
 * Hook d'authentification Supabase optimisé pour les environnements natifs et web
 * Gère la persistance de session, la connectivité réseau et les fonctionnalités natives
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fonction pour vérifier la session utilisateur
    const checkUserSession = async () => {
      setLoading(true);
      
      // Vérification de la connectivité en environnement natif
      if (isNativeEnvironment()) {
        const networkStatus = await checkNetworkConnectivity();
        setIsConnected(networkStatus);
        
        if (!networkStatus) {
          console.log('📵 Pas de connexion réseau - Chargement des données en cache');
          // Ici, vous pourriez charger des données utilisateur en cache
        }
      }
      
      const currentUser = await getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
        
        // Gestion du succès d'authentification avec feedback natif
        if (currentUser) {
          console.log('👤 Utilisateur authentifié:', currentUser.displayName);
        }
      }
    };

    checkUserSession();

    // Configuration de l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log(`🔐 Événement d'authentification Supabase: ${event}`);
      console.log(`📱 Environnement: ${isNativeEnvironment() ? 'natif' : 'web'}`);

      if (event === 'SIGNED_OUT') {
        // Nettoyage des données utilisateur démonstration
        if(localStorage.getItem('demoUser')) {
          localStorage.removeItem('demoUser');
          console.log('🧹 Utilisateur démonstration supprimé du localStorage');
        }
        
        // Nettoyage supplémentaire pour l'environnement natif
        if (isNativeEnvironment()) {
          try {
            const { Storage } = await import('@capacitor/storage');
            await Storage.remove({ key: 'demoUser' });
            console.log('🧹 Utilisateur démonstration supprimé du stockage natif');
          } catch (error) {
            console.log('⚠️ Erreur lors du nettoyage du stockage natif:', error);
          }
        }
        
        setUser(null);
        console.log('👋 Utilisateur déconnecté');
        
      } else if (session) {
        // Gestion des événements avec session active (SIGNED_IN, TOKEN_REFRESHED, etc.)
        console.log('🔄 Mise à jour de la session utilisateur');
        
        try {
          const currentUser = await getCurrentUser();
          if (isMounted) {
            setUser(currentUser);
            
            // Feedback natif pour les connexions réussies
            if (event === 'SIGNED_IN' && currentUser) {
              await handleNativeAuthSuccess(currentUser);
            }
          }
        } catch (error) {
          console.error('❌ Erreur lors de la récupération de l\'utilisateur après authentification:', error);
          await handleNativeAuthError(error, 'récupération utilisateur');
        }
      }
    });

    // Configuration de la surveillance réseau pour les environnements natifs
    let networkListener: any = null;
    if (isNativeEnvironment()) {
      import('@capacitor/network').then(({ Network }) => {
        networkListener = Network.addListener('networkStatusChange', (status) => {
          console.log(`🌐 Statut réseau changé: ${status.connected ? 'connecté' : 'déconnecté'}`);
          setIsConnected(status.connected);
          
          // Tentative de reconnexion automatique si la connexion revient
          if (status.connected && !user) {
            console.log('🔄 Connexion restaurée - Vérification de la session...');
            checkUserSession();
          }
        });
      }).catch(error => {
        console.log('🌐 Surveillance réseau non disponible:', error);
      });
    }

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      
      // Nettoyage de l'écouteur réseau natif
      if (networkListener) {
        networkListener.remove();
      }
    };
  }, []);

  return {
    user,
    loading,
    isConnected, // Ajout du statut de connectivité pour l'UI
  };
};
