
/**
 * Types pour les fonctions de validation
 */

/**
 * Type de retour pour la requête de vérification d'email utilisateur
 */
export interface EmailCheckResult {
  email: string;
}

/**
 * Type de réponse d'une requête Supabase pour la vérification d'email
 */
export interface EmailCheckResponse {
  data: EmailCheckResult[] | null;
  error: Error | null;
}
