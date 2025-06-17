
/**
 * Contexte d'authentification principal de MedCollab
 * 
 * Ce contexte gère l'état global d'authentification de l'application :
 * - Gestion de l'utilisateur connecté et de son profil
 * - Persistance de l'état de connexion
 * - Mise à jour automatique des informations utilisateur
 * - Support des comptes de démonstration pour les tests
 * - Optimisations de performance avec useMemo et useCallback
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth/user-service';
import { User } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';

/**
 * Interface du contexte d'authentification
 * Définit toutes les fonctionnalités disponibles pour les composants enfants
 */
interface AuthContextType {
  /** Utilisateur actuellement connecté (null si déconnecté) */
  user: User | null;
  /** Indicateur de chargement des données utilisateur */
  loading: boolean;
  /** Fonction pour mettre à jour les données de l'utilisateur actuel */
  updateCurrentUser: (updatedUser: User) => void;
  /** Fonction pour rafraîchir les données utilisateur depuis la base de données */
  refreshUser: () => Promise<void>;
  /** Fonction pour déconnecter l'utilisateur */
  signOut: () => Promise<void>;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fournisseur du contexte d'authentification
 * Composant racine qui encapsule toute l'application pour fournir l'état d'auth
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // États principaux du contexte
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fonction optimisée pour mettre à jour l'utilisateur actuel
   * Utilise useCallback pour éviter les re-rendus inutiles
   */
  const updateCurrentUser = useCallback((updatedUser: User) => {
    console.log('🔄 AuthContext: Mise à jour des données utilisateur', {
      userId: updatedUser.id,
      displayName: updatedUser.displayName
    });
    setUser(updatedUser);
  }, []);

  /**
   * Fonction pour rafraîchir les données utilisateur depuis la base
   * Utile après des modifications de profil ou changements de permissions
   */
  const refreshUser = useCallback(async () => {
    console.log('🔄 AuthContext: Rafraîchissement des données utilisateur...');
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      
      if (freshUser) {
        console.log('✅ AuthContext: Données utilisateur rafraîchies avec succès');
      } else {
        console.log('ℹ️ AuthContext: Aucun utilisateur connecté après rafraîchissement');
      }
    } catch (error) {
      console.error('❌ AuthContext: Erreur lors du rafraîchissement:', error);
      toast.error('Erreur de synchronisation', {
        description: 'Impossible de synchroniser vos données. Veuillez recharger la page.'
      });
    }
  }, []);

  /**
   * Fonction de déconnexion optimisée
   * Gère à la fois les comptes réels et de démonstration
   */
  const signOut = useCallback(async () => {
    console.log('🚪 AuthContext: Début de la procédure de déconnexion');
    
    try {
      // Gestion spéciale pour les comptes de démonstration
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        localStorage.removeItem('demoUser');
        console.log('👤 AuthContext: Compte de démonstration supprimé');
      }

      // Déconnexion Supabase pour les comptes réels
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthContext: Erreur Supabase lors de la déconnexion:', error);
        throw error;
      }

      // Réinitialisation de l'état local
      setUser(null);
      console.log('✅ AuthContext: Déconnexion réussie');
      
      toast.success('Déconnexion réussie', {
        description: 'À bientôt sur MedCollab !'
      });

      // Redirection vers la page d'accueil
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error: any) {
      console.error('💥 AuthContext: Erreur critique lors de la déconnexion:', error);
      toast.error('Erreur de déconnexion', {
        description: error.message || 'Une erreur inattendue est survenue'
      });
    }
  }, []);

  /**
   * Effet d'initialisation du contexte d'authentification
   * Se déclenche au montage du composant pour charger l'utilisateur
   */
  useEffect(() => {
    console.log('🚀 AuthContext: Initialisation du contexte d\'authentification');

    /**
     * Fonction interne pour charger l'utilisateur initial
     * Vérifie la session active et récupère les données de profil
     */
    const loadInitialUser = async () => {
      try {
        setLoading(true);
        console.log('🔍 AuthContext: Chargement de l\'utilisateur initial...');
        
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          console.log('✅ AuthContext: Utilisateur chargé avec succès:', {
            id: currentUser.id,
            name: currentUser.displayName,
            role: currentUser.role
          });
        } else {
          console.log('ℹ️ AuthContext: Aucun utilisateur connecté');
        }
      } catch (error) {
        console.error('❌ AuthContext: Erreur lors du chargement initial:', error);
        // Ne pas afficher de toast d'erreur au chargement initial pour éviter le spam
      } finally {
        setLoading(false);
        console.log('🏁 AuthContext: Chargement initial terminé');
      }
    };

    // Exécution du chargement initial
    loadInitialUser();

    /**
     * Écouteur des changements d'état d'authentification Supabase
     * Réagit aux connexions/déconnexions pour maintenir la synchronisation
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 AuthContext: Changement d\'état d\'authentification détecté:', {
        event,
        userId: session?.user?.id || 'aucun'
      });

      // Gestion des différents événements d'authentification
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ AuthContext: Connexion détectée');
          await refreshUser();
          break;
          
        case 'SIGNED_OUT':
          console.log('🚪 AuthContext: Déconnexion détectée');
          setUser(null);
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('🔄 AuthContext: Token rafraîchi');
          // Pas besoin de recharger l'utilisateur pour un simple refresh de token
          break;
          
        default:
          console.log(`ℹ️ AuthContext: Événement non géré: ${event}`);
      }
    });

    // Nettoyage de l'abonnement lors du démontage
    return () => {
      console.log('🧹 AuthContext: Nettoyage de l\'abonnement auth');
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  /**
   * Valeur memoïsée du contexte pour optimiser les performances
   * Évite les re-rendus inutiles des composants enfants
   */
  const contextValue = useMemo(() => ({
    user,
    loading,
    updateCurrentUser,
    refreshUser,
    signOut
  }), [user, loading, updateCurrentUser, refreshUser, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * Fournit une interface simple et sécurisée pour accéder aux données d'auth
 * 
 * @returns {AuthContextType} Les données et fonctions du contexte d'authentification
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, loading, signOut } = useAuth();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (!user) return <LoginForm />;
 * 
 * return <Dashboard user={user} onLogout={signOut} />;
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};

export default AuthContext;
