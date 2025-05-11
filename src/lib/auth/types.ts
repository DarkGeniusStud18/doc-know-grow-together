
/**
 * Types et interfaces pour l'authentification et la gestion des utilisateurs
 */

// Rôles d'utilisateur disponibles
export type UserRole = 'student' | 'professional';

// Statuts de vérification KYC
export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

// Interface pour l'utilisateur
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  kycStatus: KycStatus;
  profileImage?: string;
  university?: string;
  specialty?: string;
  createdAt: Date;
}

// Interface pour le profil utilisateur
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
  profile_image_url?: string;
}
