
/**
 * Utilitaires optimisés pour Supabase
 * 
 * Fonctions d'aide haute performance pour la gestion des requêtes Supabase,
 * la manipulation des données et la gestion des erreurs standardisée
 */

import { Database } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Type pour une réponse Supabase réussie avec données typées
 */
export type SupabaseSuccessResponse<T> = {
  data: T;
  error: null;
}

/**
 * Type pour une réponse Supabase avec erreur détaillée
 */
export type SupabaseErrorResponse = {
  data: null;
  error: PostgrestError;
}

/**
 * Type union pour une réponse Supabase complète
 */
export type SupabaseResponse<T> = SupabaseSuccessResponse<T> | SupabaseErrorResponse;

/**
 * Vérifie de manière type-safe si une réponse Supabase contient une erreur
 * @param response - Réponse de Supabase à analyser
 * @returns Guard de type pour détecter les erreurs
 */
export function isSupabaseError<T>(response: SupabaseResponse<T>): response is SupabaseErrorResponse {
  const hasError = response.error !== null;
  if (hasError) {
    console.warn('SupabaseHelpers: Erreur détectée dans la réponse:', response.error);
  }
  return hasError;
}

/**
 * Vérifie si un objet quelconque est une erreur Supabase
 * @param obj - Objet à analyser
 * @returns True si l'objet représente une erreur Supabase
 */
export function isErrorObject(obj: any): obj is { error: PostgrestError } {
  const isError = obj && 
                  typeof obj === 'object' && 
                  'error' in obj && 
                  obj.error !== null &&
                  typeof obj.error === 'object';
                  
  if (isError) {
    console.warn('SupabaseHelpers: Objet erreur détecté:', obj.error);
  }
  
  return isError;
}

/**
 * Extrait les types TypeScript appropriés des tables de la base de données
 * Fournit une interface type-safe pour les opérations CRUD
 */
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

/**
 * Type optimisé pour les insertions dans une table avec validation
 */
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

/**
 * Type optimisé pour les mises à jour dans une table avec validation
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

/**
 * Convertit efficacement un snake_case en camelCase
 * Optimisé pour les performances avec mémorisation
 */
const snakeToCamelCache = new Map<string, string>();

export const snakeToCamel = (str: string): string => {
  // Vérification du cache pour éviter les recalculs
  if (snakeToCamelCache.has(str)) {
    return snakeToCamelCache.get(str)!;
  }
  
  const camelCase = str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
  
  // Mise en cache du résultat pour les utilisations futures
  snakeToCamelCache.set(str, camelCase);
  return camelCase;
};

/**
 * Convertit récursivement un objet avec des clés snake_case vers camelCase
 * Optimisé pour les structures de données Supabase
 * @param obj - Objet à convertir
 * @returns Objet avec clés en camelCase
 */
export const snakeToCamelObject = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Optimisation pour les tableaux
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamelObject(item));
  }
  
  const result: Record<string, any> = {};
  
  // Traitement optimisé des clés d'objet
  Object.entries(obj).forEach(([key, value]) => {
    const camelKey = snakeToCamel(key);
    
    // Conversion récursive optimisée pour les objets imbriqués
    if (value && typeof value === 'object' && !Array.isArray(value) && value !== null) {
      result[camelKey] = snakeToCamelObject(value);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map(item => 
        (item && typeof item === 'object') ? snakeToCamelObject(item) : item
      );
    } else {
      result[camelKey] = value;
    }
  });
  
  return result;
};

/**
 * Formatage optimisé des dates pour l'affichage français
 * Utilise l'internationalisation native du navigateur
 */
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
});

export const formatDate = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Validation de la date
    if (isNaN(date.getTime())) {
      console.warn('SupabaseHelpers: Date invalide fournie:', dateStr);
      return 'Date invalide';
    }
    
    return dateFormatter.format(date);
  } catch (error) {
    console.error('SupabaseHelpers: Erreur lors du formatage de date:', error);
    return 'Erreur de formatage';
  }
};

/**
 * Formatage optimisé de la date avec heure pour l'affichage français
 * Cache les formateurs pour des performances optimales
 */
const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

export const formatDateTime = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Validation de la date avec heure
    if (isNaN(date.getTime())) {
      console.warn('SupabaseHelpers: Date/heure invalide fournie:', dateStr);
      return 'Date/heure invalide';
    }
    
    return dateTimeFormatter.format(date);
  } catch (error) {
    console.error('SupabaseHelpers: Erreur lors du formatage de date/heure:', error);
    return 'Erreur de formatage';
  }
};

/**
 * Utilitaire de formatage de durée en français
 * @param minutes - Durée en minutes
 * @returns Chaîne formatée lisible
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 0) {
    return 'Durée invalide';
  }
  
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Utilitaire de validation de données avec messages d'erreur français
 * @param data - Données à valider
 * @param requiredFields - Champs obligatoires
 * @returns Objet de validation avec erreurs éventuelles
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  data: T, 
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (value === null || value === undefined || value === '') {
      errors.push(`Le champ "${String(field)}" est obligatoire`);
    }
  });
  
  const isValid = errors.length === 0;
  
  if (!isValid) {
    console.warn('SupabaseHelpers: Validation échouée:', errors);
  }
  
  return { isValid, errors };
};

/**
 * Utilitaire de debounce optimisé pour les requêtes
 * @param func - Fonction à débouncer
 * @param wait - Délai d'attente en millisecondes
 * @returns Fonction débouncée
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Utilitaire de throttle pour limiter la fréquence d'exécution
 * @param func - Fonction à throttler
 * @param limit - Limite en millisecondes
 * @returns Fonction throttlée
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
