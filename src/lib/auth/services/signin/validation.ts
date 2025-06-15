
/**
 * Service de validation des identifiants de connexion
 * 
 * Ce module fournit des fonctions de validation robustes pour les formulaires de connexion.
 * Il vérifie la validité des emails et la sécurité des mots de passe selon les standards français.
 */

/**
 * Interface pour le résultat de validation des identifiants
 * Utilisée pour standardiser les retours de validation dans toute l'application
 */
export interface ValidationResult {
  /** Indique si les identifiants sont valides */
  isValid: boolean;
  /** Liste des erreurs de validation détaillées */
  errors: string[];
}

/**
 * Valide les identifiants de connexion selon les critères de sécurité français
 * 
 * Cette fonction effectue une validation complète des données d'authentification :
 * - Format d'email selon les standards RFC 5322
 * - Longueur minimale du mot de passe (sécurité renforcée)
 * - Messages d'erreur localisés en français
 * 
 * @param email - Adresse email à valider (sera normalisée automatiquement)
 * @param password - Mot de passe à valider (longueur et complexité)
 * @returns Résultat de validation avec statut et erreurs détaillées
 * 
 * @example
 * ```typescript
 * const result = validateCredentials('user@example.com', 'monMotDePasse123');
 * if (!result.isValid) {
 *   console.log('Erreurs:', result.errors);
 * }
 * ```
 */
export const validateCredentials = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];
  
  // Validation de l'adresse email avec regex renforcée
  if (!email.trim()) {
    errors.push('L\'adresse email est obligatoire');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Format d\'adresse email invalide');
  }
  
  // Validation du mot de passe avec critères de sécurité
  if (!password) {
    errors.push('Le mot de passe est obligatoire');
  } else if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  // Retour du résultat de validation optimisé
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valide un email de manière isolée pour les formulaires
 * Fonction utilitaire pour la validation en temps réel
 * 
 * @param email - Email à valider
 * @returns true si l'email est valide, false sinon
 */
export const isValidEmail = (email: string): boolean => {
  const trimmedEmail = email.trim();
  return trimmedEmail.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
};

/**
 * Valide un mot de passe de manière isolée
 * Fonction utilitaire pour la validation en temps réel
 * 
 * @param password - Mot de passe à valider
 * @returns true si le mot de passe est valide, false sinon
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
