
// Utilitaires de validation des utilisateurs

/**
 * Vérifie si un utilisateur a fourni un email valide
 * @param user Objet utilisateur à vérifier
 * @returns true si l'email est valide, false sinon
 */
export function hasValidEmail(user: any): boolean {
  if (!user) return false;
  
  // Vérifier si la propriété email existe sur l'objet user
  if (!user || typeof user !== 'object' || !('email' in user)) {
    return false;
  }
  
  const email = user.email;
  
  // Vérifier si l'email est une chaîne non vide
  if (typeof email !== 'string' || !email) {
    return false;
  }
  
  // Validation simple du format d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Vérifie si un mot de passe respecte les critères de sécurité
 * @param password Mot de passe à vérifier
 * @returns Objet indiquant la validité et les règles respectées
 */
export function validatePassword(password: string): { 
  isValid: boolean; 
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
} {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasDigit;
  
  return {
    isValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasDigit,
    hasSpecialChar
  };
}

/**
 * Vérifie si un utilisateur a complété son profil
 * @param user Objet utilisateur à vérifier
 * @returns true si le profil est complet, false sinon
 */
export function hasCompletedProfile(user: any): boolean {
  if (!user) return false;
  
  // Vérifications de base
  if (!user.displayName) return false;
  
  // Vérifications spécifiques au rôle
  if (user.role === 'student') {
    return Boolean(user.university);
  } else if (user.role === 'professional') {
    return Boolean(user.specialty);
  }
  
  return true;
}

/**
 * Génère un message convivial pour l'utilisateur
 * @param user Objet utilisateur
 * @returns Message personnalisé en français
 */
export function generateWelcomeMessage(user: any): string {
  if (!user) return "Bienvenue sur MedCollab !";
  
  const timeOfDay = new Date().getHours();
  let greeting = "";
  
  if (timeOfDay < 12) {
    greeting = "Bonjour";
  } else if (timeOfDay < 18) {
    greeting = "Bon après-midi";
  } else {
    greeting = "Bonsoir";
  }
  
  return `${greeting}, ${user.displayName || 'cher utilisateur'} !`;
}

