
/**
 * Types et interfaces pour l'authentification et la gestion des utilisateurs
 * Définitions adaptées à la nouvelle structure de la base de données Supabase
 */

import { Database } from '@/integrations/supabase/types';

// Rôles d'utilisateur disponibles dans l'application
export type UserRole = 'student' | 'professional';

// Statuts de vérification KYC (Know Your Customer)
export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

// Type pour le statut d'abonnement de l'utilisateur
export type SubscriptionStatus = 'free' | 'premium';

// Types Supabase pour les tables
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type StudyGroupMembersRow = Database['public']['Tables']['study_group_members']['Row'];
export type StudyGroupMembersInsert = Database['public']['Tables']['study_group_members']['Insert'];
export type StudyGroupMembersUpdate = Database['public']['Tables']['study_group_members']['Update'];
export type SwitchCredentialsRow = Database['public']['Tables']['switch_credentials']['Row'];

// Interface pour l'utilisateur dans le contexte de l'application
export interface User {
  /** Identifiant unique de l'utilisateur */
  id: string;
  /** Adresse email de l'utilisateur */
  email: string;
  /** Nom d'affichage de l'utilisateur */
  displayName: string;
  /** Rôle de l'utilisateur (étudiant ou professionnel) */
  role: UserRole;
  /** Statut de vérification KYC */
  kycStatus: KycStatus;
  /** URL de l'image de profil (optionnelle) */
  profileImage?: string;
  /** Université de l'utilisateur (pour les étudiants) */
  university?: string;
  /** Spécialité de l'utilisateur (pour les professionnels) */
  specialty?: string;
  /** Statut d'abonnement (gratuit ou premium) */
  subscriptionStatus?: SubscriptionStatus;
  /** Date d'expiration de l'abonnement */
  subscriptionExpiry?: Date | null;
  /** Date de création du compte */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt?: Date;
}

// Interface pour le profil utilisateur tel que retourné par l'API Supabase
export interface UserProfile {
  /** Identifiant unique du profil */
  id: string;
  /** Nom d'affichage de l'utilisateur */
  display_name: string;
  /** Adresse email de l'utilisateur */
  email: string;
  /** Rôle de l'utilisateur */
  role: UserRole;
  /** Statut de vérification KYC */
  kyc_status: KycStatus;
  /** Date de création (format ISO string) */
  created_at: string;
  /** Date de mise à jour (format ISO string) */
  updated_at: string;
  /** Université (optionnelle) */
  university?: string;
  /** Spécialité (optionnelle) */
  specialty?: string;
  /** URL de l'image de profil (optionnelle) */
  profile_image?: string;
  /** Statut d'abonnement */
  subscription_status?: SubscriptionStatus;
  /** Date d'expiration de l'abonnement (format ISO string) */
  subscription_expiry?: string;
}

// Interface pour les identifiants de changement de rôle
export interface SwitchCredentials {
  /** Code PIN pour le changement de rôle */
  pin_code: string;
  /** Mot de passe pour le changement de rôle */
  password: string;
}

// Types pour les réponses d'API avec gestion d'erreurs
export interface ApiSuccessResponse<T> {
  /** Données retournées en cas de succès */
  data: T;
  /** Null en cas de succès */
  error: null;
}

export interface ApiErrorResponse {
  /** Null en cas d'erreur */
  data: null;
  /** Détails de l'erreur */
  error: {
    /** Message d'erreur principal */
    message: string;
    /** Détails supplémentaires (optionnels) */
    details?: string;
    /** Code d'erreur (optionnel) */
    code?: string;
  };
}

// Type union pour les réponses d'API
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Fonction utilitaire pour déterminer si une réponse API contient une erreur
 * @param response - La réponse à vérifier
 * @returns true si la réponse contient une erreur
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.error !== null;
}

/**
 * Fonction utilitaire pour vérifier si un objet est une erreur Supabase
 * @param obj - L'objet à vérifier
 * @returns true si l'objet est une erreur Supabase
 */
export function isSupabaseError(obj: any): boolean {
  return obj && typeof obj === 'object' && 'error' in obj && obj.error !== null;
}

/**
 * Fonction utilitaire pour vérifier si une réponse contient des données valides
 * @param data - Les données à vérifier
 * @returns true si les données sont valides (pas une erreur)
 */
export function isValidData<T>(data: T | any): data is T {
  return data && typeof data === 'object' && !('error' in data);
}
