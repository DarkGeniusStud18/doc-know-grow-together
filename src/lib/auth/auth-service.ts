
// Service principal d'authentification - Exporte toutes les fonctionnalités d'auth

// Import des services individuels
import { signUp } from './services/auth-signup';
import { signIn } from './services/auth-signin';
import { signOut } from './services/auth-signout';
import { createUserProfile } from './services/profile-service';

// Ré-export des services pour maintenir la compatibilité avec le code existant
export {
  signUp,
  signIn,
  signOut,
  createUserProfile
};
