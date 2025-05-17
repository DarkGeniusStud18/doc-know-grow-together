
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
  profile_image?: string;
}

// Interface pour les types de la base de données Supabase
export interface ProfilesTable {
  id: string;
  email?: string;
  display_name: string;
  role: UserRole;
  kyc_status: KycStatus;
  university?: string;
  specialty?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  subscription_status?: string;
  subscription_expiry?: string;
}

export interface StudyGroupMembersTable {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface SwitchCredentialsTable {
  id: string;
  pin_code: string;
  password: string;
  created_at: string;
  updated_at: string;
}

// Types pour les mises à jour Supabase
export type ProfilesUpdate = Partial<ProfilesTable>;
export type StudyGroupMembersInsert = Omit<StudyGroupMembersTable, 'id' | 'joined_at'>;
export type StudyGroupMembersUpdate = Partial<StudyGroupMembersTable>;
