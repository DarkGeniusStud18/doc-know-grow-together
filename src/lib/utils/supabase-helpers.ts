
/**
 * Utilitaires pour Supabase
 * 
 * Fonctions d'aide à la gestion des requêtes Supabase
 * et à la manipulation des données de la base de données
 */

import { Database } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Type pour une réponse Supabase réussie
 */
export type SupabaseSuccessResponse<T> = {
  data: T;
  error: null;
}

/**
 * Type pour une réponse Supabase avec erreur
 */
export type SupabaseErrorResponse = {
  data: null;
  error: PostgrestError;
}

/**
 * Type union pour une réponse Supabase
 */
export type SupabaseResponse<T> = SupabaseSuccessResponse<T> | SupabaseErrorResponse;

/**
 * Vérifie si une réponse Supabase contient une erreur
 * @param response Réponse de Supabase à vérifier
 * @returns True si la réponse contient une erreur
 */
export function isSupabaseError<T>(response: SupabaseResponse<T>): response is SupabaseErrorResponse {
  return response.error !== null;
}

/**
 * Vérifie si un objet est une erreur Supabase
 * @param obj Objet à vérifier
 * @returns True si l'objet est une erreur Supabase
 */
export function isErrorObject(obj: any): boolean {
  return obj && typeof obj === 'object' && 'error' in obj && obj.error !== null;
}

/**
 * Extrait l'objet TypeScript approprié à partir des tables de la base de données
 * et l'adapte au format utilisé dans l'application
 */
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

/**
 * Type pour les insertions dans une table
 */
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

/**
 * Type pour les mises à jour dans une table
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

/**
 * Convertit un snake_case en camelCase
 */
export const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

/**
 * Convertit un objet avec des clés en snake_case vers camelCase
 */
export const snakeToCamelObject = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];
    
    // Conversion récursive pour les objets imbriqués
    if (value && typeof value === 'object' && !Array.isArray(value) && value !== null) {
      result[camelKey] = snakeToCamelObject(value);
    } else {
      result[camelKey] = value;
    }
  });
  
  return result;
};

/**
 * Formatage des dates pour l'affichage
 */
export const formatDate = (dateStr: string | Date): string => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(date);
};

/**
 * Formatage de la date avec l'heure pour l'affichage
 */
export const formatDateTime = (dateStr: string | Date): string => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
