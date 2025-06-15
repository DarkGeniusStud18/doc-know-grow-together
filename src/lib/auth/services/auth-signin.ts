
/**
 * Optimized service for user login management
 * 
 * This service orchestrates the authentication process via Supabase, supporting demo accounts,
 * robust validation, advanced error handling, and detailed logging for debugging.
 */

import { toast } from "@/components/ui/sonner";
import { User } from "../types";
import { validateCredentials } from "./signin/validation";
import { handleDemoLogin } from "./signin/demo-handler";
import { handleSupabaseLogin } from "./signin/supabase-handler";

/**
 * Main optimized user login function
 * Manages demo and real accounts with validation and logging
 * @param email - User's email address
 * @param password - User's password
 * @returns The logged-in user or null if login fails
 */
export const signIn = async (email: string, password: string): Promise<User | null> => {
  console.log('AuthSignin: Début de la tentative de connexion');
  
  // Preliminary validation of credentials
  const validation = validateCredentials(email, password);
  if (!validation.isValid) {
    console.warn('AuthSignin: Validation des identifiants échouée:', validation.errors);
    toast.error('Identifiants invalides', {
      description: validation.errors.join(', ')
    });
    return null;
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  console.log('AuthSignin: Tentative de connexion pour:', normalizedEmail);
  
  try {
    // Detection and handling of demo accounts
    const isDemoAccount = (normalizedEmail === 'student@example.com' || normalizedEmail === 'doctor@example.com') 
                         && password === 'password';
    
    if (isDemoAccount) {
      return await handleDemoLogin(normalizedEmail);
    }
    
    // Handling of Supabase logins for real accounts
    return await handleSupabaseLogin(normalizedEmail, password);
    
  } catch (error) {
    console.error('AuthSignin: Erreur critique lors de la connexion:', error);
    toast.error('Erreur critique de connexion', { 
      description: 'Une erreur système est survenue. Veuillez contacter le support technique.'
    });
    return null;
  }
};
