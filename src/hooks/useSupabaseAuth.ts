
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Charge le profil utilisateur depuis Supabase
   */
  const loadUserProfile = async (authUser: User): Promise<AuthUser | null> => {
    try {
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

  useEffect(() => {
    let isMounted = true;
    let authSubscription: any = null;

    const fetchSession = async () => {
      setLoading(true);

      // Get current authenticated session
      const { data: { session } } = await supabase.auth.getSession();

      let userProfile: AuthUser | null = null;
      if (session?.user) {
        userProfile = await loadUserProfile(session.user);
      }

      if (isMounted) {
        setUser(userProfile);
        setLoading(false);
      }
    };

    fetchSession();

    // Auth state listeners
    authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        loadUserProfile(session.user).then(data => {
          if (isMounted) {
            setUser(data);
            setLoading(false);
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authSubscription?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  return {
    user,
    loading,
    loadUserProfile
  };
};
