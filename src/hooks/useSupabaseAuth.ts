
/**
 * Hook personnalisé pour la gestion de l'authentification Supabase
 * Version corrigée pour éviter les boucles infinies et les erreurs React
 */
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface étendue pour l'utilisateur authentifié avec données de profil
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
 * Hook pour gérer l'état d'authentification - version corrigée
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  /**
   * Charge le profil utilisateur depuis Supabase
   */
  const loadUserProfile = async (authUser: User): Promise<AuthUser | null> => {
    try {
      console.log('AuthHook: Chargement du profil pour:', authUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthHook: Erreur profil:', error);
        return null;
      }

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

      return authUserWithProfile;
    } catch (error) {
      console.error('AuthHook: Erreur dans loadUserProfile:', error);
      return null;
    }
  };

  // Initialisation unique
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    console.log('AuthHook: Initialisation unique');

    let mounted = true;

    const initAuth = async () => {
      try {
        // Timeout de sécurité
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn('AuthHook: Timeout d\'initialisation');
            setLoading(false);
            setInitialized(true);
          }
        }, 5000);

        // Récupération de la session initiale
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        clearTimeout(timeoutId);

        if (error) {
          console.error('AuthHook: Erreur session:', error);
          setLoading(false);
          setInitialized(true);
          return;
        }

        if (session?.user) {
          const userProfile = await loadUserProfile(session.user);
          if (mounted && userProfile) {
            setUser(userProfile);
          }
        }

        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('AuthHook: Erreur d\'initialisation:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    // Écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('AuthHook: Changement d\'état:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        const userProfile = await loadUserProfile(session.user);
        if (mounted) {
          setUser(userProfile);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    loadUserProfile
  };
};
