
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuration par défaut pour le stockage
let storage: any = typeof window !== 'undefined' ? localStorage : undefined;
let storageKey = 'medcollab-auth-token';

// Détection et configuration de Capacitor pour les environnements natifs
if (typeof window !== 'undefined') {
  const isCapacitor = (window as any).Capacitor && navigator.userAgent.includes('Capacitor');

  if (isCapacitor) {
    console.log('🚀 Détection de l\'environnement Capacitor - Configuration du stockage natif');
    
    // Utilisation du stockage Capacitor pour une meilleure persistance native
    import('@capacitor/storage').then(({ Storage }) => {
      storage = {
        getItem: async (key: string) => {
          try {
            const { value } = await Storage.get({ key });
            console.log(`📦 Capacitor Storage - Récupération de la clé: ${key}`);
            return value;
          } catch (error) {
            console.error('❌ Erreur lors de la récupération depuis Capacitor Storage:', error);
            return null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            await Storage.set({ key, value });
            console.log(`💾 Capacitor Storage - Sauvegarde de la clé: ${key}`);
          } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde dans Capacitor Storage:', error);
          }
        },
        removeItem: async (key: string) => {
          try {
            await Storage.remove({ key });
            console.log(`🗑️ Capacitor Storage - Suppression de la clé: ${key}`);
          } catch (error) {
            console.error('❌ Erreur lors de la suppression depuis Capacitor Storage:', error);
          }
        }
      };
    }).catch(err => {
      console.error('❌ Échec du chargement de Capacitor Storage:', err);
      console.log('🔄 Utilisation du localStorage comme fallback');
      // Fallback vers localStorage si Capacitor Storage échoue
      storage = localStorage;
    });

    // Clé de stockage spécifique pour l'environnement natif
    storageKey = 'supabase-session';
  }
}

// URLs de configuration Supabase
const SUPABASE_URL = 'https://yblwafdsidkuzgzfazpf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibHdhZmRzaWRrdXpnemZhenBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDU2MzIsImV4cCI6MjA2MjM4MTYzMn0.5GiBnyp-NAAZbOcenQYWkqPt-x0jvOcW4InS1U-u-Ns';

// Création du client Supabase avec configuration optimisée pour les environnements natifs et web
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // Configuration de persistance renforcée pour les applications natives et web
      persistSession: true,
      autoRefreshToken: true,
      storageKey: storageKey,
      storage: storage,
      detectSessionInUrl: true,
      flowType: isNativeEnvironment() ? 'pkce' : 'implicit', // PKCE pour mobile, implicit pour web
      debug: import.meta.env.DEV,
    },
    global: {
      headers: {
        'Cache-Control': 'no-cache',
        // Header spécifique pour identifier les requêtes depuis l'application native
        'X-Client-Platform': typeof window !== 'undefined' && (window as any).Capacitor ? 'capacitor' : 'web',
      },
    },
  }
);

// Configuration du logging pour le développement et le débogage
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Événement d\'authentification Supabase:', event);
    console.log(
      '📋 Session:',
      session
        ? {
            user: session.user?.id,
            expires_at: session.expires_at,
            access_token: session.access_token ? 'présent' : 'manquant',
            refresh_token: session.refresh_token ? 'présent' : 'manquant',
            platform: typeof window !== 'undefined' && (window as any).Capacitor ? 'native' : 'web'
          }
        : 'Aucune session'
    );
  });
}

// Fonction utilitaire pour vérifier l'environnement d'exécution
export const isNativeEnvironment = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).Capacitor;
};

// Fonction utilitaire pour obtenir des informations sur la plateforme
export const getPlatformInfo = () => {
  if (typeof window === 'undefined') return { platform: 'server', isNative: false };
  
  const isNative = !!(window as any).Capacitor;
  return {
    platform: isNative ? 'native' : 'web',
    isNative,
    userAgent: navigator.userAgent
  };
};
