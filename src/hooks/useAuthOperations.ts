
/**
 * Hook personnalisé pour les opérations d'authentification
 * Gère les actions de connexion, déconnexion et inscription avec validation complète
 */
import { useState } from 'react';
import { 
  signIn as serviceSignIn, 
  signOut as serviceSignOut,
  signUp as serviceSignUp
} from '@/lib/auth/auth-service';

/**
 * Hook pour les opérations d'authentification (connexion, déconnexion, inscription)
 * Séparé du hook principal pour une meilleure organisation du code
 * 
 * @returns Méthodes pour gérer l'authentification des utilisateurs avec gestion d'erreur
 */
export const useAuthOperations = () => {
  // État de chargement pour les opérations d'authentification
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Connexion avec email et mot de passe avec validation complète
   * Gère les erreurs et fournit des messages d'erreur appropriés
   * 
   * @param email - Adresse email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns Résultat de la connexion avec utilisateur ou erreur détaillée
   */
  const signInWithEmail = async (email: string, password: string) => {
    console.log('AuthOperations: Tentative de connexion pour:', email);
    setIsLoading(true);
    try {
      const user = await serviceSignIn(email, password);
      if (user) {
        console.log('AuthOperations: Connexion réussie pour l\'utilisateur:', user.id);
        return { user };
      }
      // The toast is handled inside signIn service
      return { error: 'Échec de la connexion' };
    } catch (error: any) {
      console.error('AuthOperations: Erreur lors de la connexion:', error);
      return { error: error.message || 'Erreur de connexion inattendue' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connexion en mode démo avec comptes prédéfinis
   * Permet de tester l'application sans créer de compte
   * 
   * @param type - Type de compte démo ('student' ou 'professional')
   * @returns Résultat de la connexion démo
   */
  const signInAsDemo = async (type: 'student' | 'professional') => {
    console.log('AuthOperations: Connexion en mode démo:', type);
    
    // Configuration des comptes de démonstration
    const demoCredentials = {
      student: {
        email: 'student@example.com',
        password: 'password'
      },
      professional: {
        email: 'doctor@example.com', 
        password: 'password'
      }
    };
    
    const { email, password } = demoCredentials[type];
    return await signInWithEmail(email, password);
  };

  /**
   * Inscription d'un nouvel utilisateur avec validation complète
   * Crée un compte et envoie un email de confirmation
   * 
   * @param email - Adresse email
   * @param password - Mot de passe
   * @param role - Rôle de l'utilisateur
   * @param displayName - Nom d'affichage
   * @returns Succès ou échec de l'inscription avec détails
   */
  const register = async (
    email: string, 
    password: string, 
    role: 'student' | 'professional', 
    displayName: string
  ) => {
    console.log('AuthOperations: Inscription d\'un nouvel utilisateur:', email, role);
    setIsLoading(true);
    try {
        const result = await serviceSignUp({ email, password, role, displayName });
        return !!result;
    } catch (error) {
      console.error('AuthOperations: Erreur d\'inscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnexion de l'utilisateur avec nettoyage de session
   * Efface toutes les données d'authentification locales
   * 
   * @returns Promise de déconnexion
   */
  const signOut = async () => {
    console.log('AuthOperations: Déconnexion de l\'utilisateur');
    setIsLoading(true);
    try {
      await serviceSignOut();
      console.log('AuthOperations: Déconnexion réussie');
    } catch (error) {
      console.error('AuthOperations: Erreur de déconnexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnexion avec redirection optionnelle
   * Permet de rediriger l'utilisateur après déconnexion
   * 
   * @param redirectPath - Chemin de redirection optionnel
   */
  const logout = (redirectPath?: string) => {
    console.log('AuthOperations: Déconnexion avec redirection vers:', redirectPath);
    
    signOut().then(() => {
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    }).catch((error) => {
      console.error('AuthOperations: Erreur lors de la déconnexion avec redirection:', error);
    });
  };

  return {
    signInWithEmail,
    signInAsDemo,
    register,
    signOut,
    logout,
    isLoading
  };
};
