
/**
 * Interface for the result of credential validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates login credentials
 * @param email - Email address to validate
 * @param password - Password to validate
 * @returns Validation result with any errors
 */
export const validateCredentials = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];
  
  // Email validation
  if (!email.trim()) {
    errors.push('L\'adresse email est obligatoire');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format d\'adresse email invalide');
  }
  
  // Password validation
  if (!password) {
    errors.push('Le mot de passe est obligatoire');
  } else if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
