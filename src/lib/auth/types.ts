
/**
 * Types et interfaces pour l'authentification et la gestion des utilisateurs
 * Définitions adaptées à la nouvelle structure de la base de données Supabase
 */

// Rôles d'utilisateur disponibles
export type UserRole = 'student' | 'professional';

// Statuts de vérification KYC
export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

// Type pour le statut d'abonnement
export type SubscriptionStatus = 'free' | 'premium';

// Interface pour l'utilisateur dans le contexte de l'application
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  kycStatus: KycStatus;
  profileImage?: string;
  university?: string;
  specialty?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
}

// Interface pour le profil utilisateur tel que retourné par l'API
export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  role: UserRole;
  kyc_status: KycStatus;
  created_at: string;
  updated_at: string;
  university?: string;
  specialty?: string;
  profile_image?: string;
  subscription_status?: SubscriptionStatus;
  subscription_expiry?: string;
}

// Interface pour la table des profils Supabase
export interface ProfilesTable {
  id: string;
  email?: string;
  display_name: string;
  role: UserRole;
  kyc_status: KycStatus;
  university?: string;
  specialty?: string;
  profile_image?: string;
  subscription_status: SubscriptionStatus;
  subscription_expiry?: string;
  created_at: string;
  updated_at: string;
}

// Interface pour la table des membres de groupes d'étude
export interface StudyGroupMembersTable {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

// Interface pour les identifiants de changement de rôle
export interface SwitchCredentialsTable {
  id: string;
  pin_code: string;
  password: string;
  created_at: string;
  updated_at: string;
}

// Types pour les mises à jour Supabase
export type ProfilesUpdate = Partial<Omit<ProfilesTable, 'id'>>;
export type StudyGroupMembersInsert = Omit<StudyGroupMembersTable, 'id' | 'joined_at'>;
export type StudyGroupMembersUpdate = Partial<Omit<StudyGroupMembersTable, 'id' | 'group_id' | 'user_id' | 'joined_at'>>;

// Types pour les réponses d'API avec gestion d'erreurs
export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: {
    message: string;
    details?: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Fonction utilitaire pour déterminer si une réponse API contient une erreur
export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.error !== null;
}

// Fonction utilitaire pour vérifier si un objet est une erreur Supabase
export function isSupabaseResponseError(obj: any): boolean {
  return obj && typeof obj === 'object' && 'error' in obj && obj.error === true;
}
