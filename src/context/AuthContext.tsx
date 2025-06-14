
/**
 * Contexte d'authentification simplifié pour éviter les boucles infinies
 */
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth, AuthUser } from '@/hooks/useSupabaseAuth';
import { useAuthOperations } from '@/hooks/useAuthOperations';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: (redirectPath?: string) => void;
  updateCurrentUser: (updates: Partial<AuthUser>) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string; user?: any }>;
  signInAsDemo: (type: 'student' | 'professional') => Promise<{ error?: string; user?: any }>;
  register: (email: string, password: string, role: 'student' | 'professional', displayName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider: Initialisation');
  
  const { user, loading } = useSupabaseAuth();
  const authOperations = useAuthOperations();

  const updateCurrentUser = (updates: Partial<AuthUser>) => {
    console.log('AuthProvider: updateCurrentUser (local only):', updates);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    updateCurrentUser,
    ...authOperations
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};
