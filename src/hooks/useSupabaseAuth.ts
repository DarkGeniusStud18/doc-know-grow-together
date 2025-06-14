
/**
 * Hook personnalisé pour la gestion de l'authentification Supabase
 * Sépare la logique d'authentification du contexte principal pour améliorer la maintenabilité
 */
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface étendue pour l'utilisateur authentifié avec données de profil
 * Combine les données Supabase Auth avec les informations de profil personnalisées
 */
export interface AuthUser extends User {
  displayName: string;
  profileImage?: string;
  role: 'student' | 'professional';
  kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  university?: string;
  specialty?: string;
  createdAt: Date;
  email: string;
}

/**
 * Hook pour gérer l'état d'authentification et les opérations utilisateur
 * Centralise toute la logique d'authentification et de gestion des profils
 * 
 * @returns Objet contenant l'utilisateur, l'état de chargement et les méthodes d'authentification
 */
export const useSupabaseAuth = () => {
  // États pour la gestion de l'authentification
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Charge le profil utilisateur depuis Supabase avec gestion d'erreur robuste
   * Combine les données d'authentification avec les informations de profil
   * 
   * @param authUser - Utilisateur authentifié depuis Supabase Auth
   */
  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('AuthHook: Chargement du profil pour l\'utilisateur:', authUser.id);
      
      // Récupération du profil utilisateur avec gestion des erreurs
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Gestion des erreurs - ignore l'erreur si le profil n'existe pas encore
      if (error && error.code !== 'PGRST116') {
        console.error('AuthHook: Erreur lors du chargement du profil:', error);
        return;
      }

      // Construction de l'objet utilisateur avec profil complet et données par défaut
      const authUserWithProfile: AuthUser = {
        ...authUser,
        email: authUser.email || '',
        displayName: profile?.display_name || authUser.email?.split('@')[0] || 'Utilisateur',
        profileImage: profile?.profile_image,
        role: profile?.role || 'student',
        kycStatus: profile?.kyc_status || 'not_submitted',
        university: profile?.university,
        specialty: profile?.specialty,
        createdAt: profile?.created_at ? new Date(profile.created_at) : new Date()
      };

      console.log('AuthHook: Profil utilisateur chargé avec succès');
      setUser(authUserWithProfile);
    } catch (error) {
      console.error('AuthHook: Erreur dans loadUserProfile:', error);
    }
  };

  // Initialisation et écoute des changements d'authentification
  useEffect(() => {
    if (initialized) return;

    console.log('AuthHook: Initialisation du hook d\'authentification');

    // Timeout de sécurité pour éviter les chargements infinis
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn('AuthHook: Timeout de chargement atteint, arrêt du loading');
      setLoading(false);
    }, 5000); // 5 secondes maximum

    /**
     * Récupération de la session initiale avec gestion d'erreur
     * Vérifie s'il y a déjà une session active au chargement
     */
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthHook: Erreur lors de la récupération de la session:', error);
          setLoading(false);
          return;
        }

        // Chargement du profil si une session existe
        if (session?.user) {
          await loadUserProfile(session.user);
        }
        
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('AuthHook: Erreur dans getInitialSession:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();

    // Configuration de l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthHook: Changement d\'état d\'authentification:', event);
      
      // Clear timeout when auth state changes
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Gestion des différents événements d'authentification
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        await loadUserProfile(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthHook: Déconnexion de l\'utilisateur');
        setUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Don't reload profile on token refresh, just update the user state if needed
        console.log('AuthHook: Token rafraîchi');
      }
      
      setInitialized(true);
    });

    // Fonction de nettoyage pour éviter les fuites mémoire
    return () => {
      console.log('AuthHook: Nettoyage de l\'abonnement d\'authentification');
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [initialized]);

  return {
    user,
    loading,
    loadUserProfile
  };
};
