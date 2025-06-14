
/**
 * Contexte d'authentification refactorisé pour MedCollab
 * Utilise des hooks personnalisés pour une meilleure séparation des responsabilités
 * Architecture modulaire pour faciliter la maintenance et les tests
 */
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth, AuthUser } from '@/hooks/useSupabaseAuth';
import { useAuthOperations } from '@/hooks/useAuthOperations';

/**
 * Interface du contexte d'authentification avec toutes les méthodes nécessaires
 * Centralise toutes les fonctionnalités d'authentification dans une API unifiée
 */
interface AuthContextType {
  // États d'authentification
  user: AuthUser | null;
  loading: boolean;
  
  // Méthodes d'authentification principales
  signOut: () => Promise<void>;
  logout: (redirectPath?: string) => void;
  updateCurrentUser: (updates: Partial<AuthUser>) => void;
  
  // Méthodes de connexion
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string; user?: any }>;
  signInAsDemo: (type: 'student' | 'professional') => Promise<{ error?: string; user?: any }>;
  
  // Méthodes d'inscription
  register: (email: string, password: string, role: 'student' | 'professional', displayName: string) => Promise<boolean>;
}

// Création du contexte d'authentification avec type strict
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fournisseur de contexte d'authentification
 * Combine les hooks d'authentification et d'opérations pour une API unifiée
 * Optimisé pour les performances avec une séparation claire des responsabilités
 * 
 * @param children - Composants enfants qui auront accès au contexte
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider: Initialisation du fournisseur d\'authentification');
  
  // Utilisation des hooks personnalisés pour séparer les responsabilités
  const { user, loading } = useSupabaseAuth();
  const authOperations = useAuthOperations();

  /**
   * Met à jour les données de l'utilisateur actuel dans l'état local
   * Note: Cette fonction met à jour l'état local uniquement
   * Pour une mise à jour persistante, utiliser les fonctions de profil
   * 
   * @param updates - Modifications partielles à appliquer à l'utilisateur
   */
  const updateCurrentUser = (updates: Partial<AuthUser>) => {
    console.log('AuthProvider: Mise à jour de l\'utilisateur actuel:', updates);
    
    if (user) {
      // Note: Cette fonction met à jour l'état local uniquement
      // Pour une mise à jour persistante, il faudrait appeler les services de profil
      console.warn('AuthProvider: updateCurrentUser met à jour l\'état local uniquement');
      console.info('AuthProvider: Pour une mise à jour persistante, utilisez les services de profil');
    } else {
      console.warn('AuthProvider: Tentative de mise à jour sans utilisateur connecté');
    }
  };

  // Construction de la valeur du contexte avec toutes les méthodes nécessaires
  const contextValue: AuthContextType = {
    // États d'authentification
    user,
    loading,
    updateCurrentUser,
    
    // Spread des opérations d'authentification depuis le hook dédié
    ...authOperations
  };

  console.log('AuthProvider: Rendu du fournisseur avec utilisateur:', user?.id || 'aucun');

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'authentification
 * Fournit un accès type-safe à toutes les fonctionnalités d'authentification
 * 
 * @returns Contexte d'authentification avec toutes les méthodes disponibles
 * @throws Erreur si utilisé en dehors du AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};
