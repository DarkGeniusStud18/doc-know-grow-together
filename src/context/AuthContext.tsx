
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Contexte d'authentification optimisé - ACCÈS IMMÉDIAT sans vérifications excessives
 */

import React, { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth/user-service';
import { signUp, signIn, signOut as authSignOut } from '@/lib/auth/auth-service';
import { User, UserRole } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateCurrentUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signInAsDemo: (type: 'student' | 'professional') => Promise<{ error?: any }>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  logout: (redirectUrl?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateCurrentUser = useCallback((updatedUser: User) => {
    console.log('🔄 AuthContext: Mise à jour des données utilisateur', {
      userId: updatedUser.id,
      displayName: updatedUser.displayName
    });
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    console.log('🔄 AuthContext: Rafraîchissement rapide...');
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      
      if (freshUser) {
        console.log('✅ AuthContext: Utilisateur actualisé');
      }
    } catch (error) {
      console.error('❌ AuthContext: Erreur de rafraîchissement:', error);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ error?: any }> => {
    try {
      const user = await signIn(email, password);
      if (user) {
        await refreshUser();
        return {};
      } else {
        return { error: 'Échec de la connexion' };
      }
    } catch (error) {
      console.error('❌ AuthContext: Erreur de connexion:', error);
      return { error };
    }
  }, [refreshUser]);

  const signInAsDemo = useCallback(async (type: 'student' | 'professional'): Promise<{ error?: any }> => {
    try {
      const demoUser: User = {
        id: `demo-${type}-${Date.now()}`,
        email: `demo-${type}@medcollab.local`,
        displayName: type === 'student' ? 'Étudiant Démo' : 'Professionnel Démo',
        role: type,
        kycStatus: 'not_submitted',
        subscriptionStatus: 'trial',
        subscriptionExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      
      toast.success(`Connexion démo réussie en tant que ${type === 'student' ? 'étudiant' : 'professionnel'}`);
      return {};
    } catch (error) {
      console.error('❌ AuthContext: Erreur connexion démo:', error);
      return { error };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, role: UserRole, displayName: string) => {
    try {
      const allowedRole = (role === 'admin' || role === 'healthcare_professional') ? 'professional' : role;
      
      const result = await signUp({
        email,
        password,
        displayName,
        role: allowedRole as 'student' | 'professional'
      });
      
      return !!result && !('error' in result);
    } catch (error) {
      console.error('❌ AuthContext: Erreur d\'inscription:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async (redirectUrl: string = '/') => {
    await authSignOut(redirectUrl);
    setUser(null);
  }, []);

  const signOutHandler = useCallback(async () => {
    await logout();
  }, [logout]);

  // INITIALISATION ULTRA-RAPIDE - SUPPRESSION des vérifications excessives
  useEffect(() => {
    console.log('🚀 AuthContext: Initialisation rapide...');

    const loadInitialUser = async () => {
      try {
        // PAS de setLoading(true) ici - évite les loops de chargement
        console.log('🔍 AuthContext: Chargement immédiat...');
        
        // Vérification utilisateur démo FIRST
        const demoUserData = localStorage.getItem('demoUser');
        if (demoUserData) {
          try {
            const demoUser = JSON.parse(demoUserData);
            setUser(demoUser);
            setLoading(false); // IMPORTANT: stop loading immediately
            console.log('✅ AuthContext: Utilisateur démo chargé immédiatement');
            return;
          } catch (error) {
            localStorage.removeItem('demoUser');
          }
        }
        
        // Récupération utilisateur réel RAPIDE
        const currentUser = await getCurrentUser();
        
        setUser(currentUser);
        setLoading(false); // IMPORTANT: TOUJOURS arrêter le loading
        
        if (currentUser) {
          console.log('✅ AuthContext: Utilisateur chargé immédiatement');
        } else {
          console.log('ℹ️ AuthContext: Pas d\'utilisateur - accès immédiat aux pages publiques');
        }
      } catch (error) {
        console.error('❌ AuthContext: Erreur de chargement:', error);
        setLoading(false); // CRITICAL: stop loading even on error
      }
    };

    loadInitialUser();

    // Écouteur AUTH simplifié - PAS de refreshUser automatique
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 AuthContext: Événement auth:', event);

      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ AuthContext: Connexion détectée - refresh simple');
          // Refresh simple SANS boucle
          setTimeout(async () => {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
          }, 0);
          break;
          
        case 'SIGNED_OUT':
          console.log('🚪 AuthContext: Déconnexion détectée');
          localStorage.removeItem('demoUser');
          setUser(null);
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('🔄 AuthContext: Token rafraîchi - pas d\'action');
          // PAS de refresh utilisateur pour éviter les loops
          break;
          
        default:
          console.log(`ℹ️ AuthContext: Événement ignoré: ${event}`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // PAS de dépendances pour éviter les re-executions

  const contextValue = useMemo(() => ({
    user,
    loading,
    updateCurrentUser,
    refreshUser,
    signOut: signOutHandler,
    signInWithEmail,
    signInAsDemo,
    register,
    logout
  }), [user, loading, updateCurrentUser, refreshUser, signOutHandler, signInWithEmail, signInAsDemo, register, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
