
/**
 * Types et interfaces pour le système d'authentification de MedCollab
 * 
 * Ce fichier centralise toutes les définitions de types liées à l'authentification,
 * la gestion des utilisateurs et les permissions. Il assure la cohérence des types
 * à travers toute l'application et facilite la maintenance.
 */

/**
 * Énumération des rôles utilisateur disponibles dans l'application
 * Détermine les permissions et l'accès aux fonctionnalités
 */
export type UserRole = 
  | 'student'      // Étudiant en médecine - accès aux ressources éducatives
  | 'professional' // Professionnel de santé - accès étendu + création de contenu
  | 'admin';       // Administrateur - accès complet à la gestion

/**
 * Statuts de vérification KYC (Know Your Customer)
 * Processus de vérification d'identité pour les professionnels de santé
 */
export type KycStatus = 
  | 'not_submitted' // Aucun document soumis
  | 'pending'       // Documents en cours de vérification
  | 'verified'      // Identité vérifiée avec succès
  | 'rejected';     // Documents refusés - nouvelle soumission requise

/**
 * Types de documents acceptés pour la vérification KYC
 * Chaque type correspond à un processus de validation spécifique
 */
export type KycDocumentType = 
  | 'medical_degree'    // Diplôme de médecine
  | 'medical_license'   // Licence d'exercice
  | 'student_card'      // Carte étudiante
  | 'identity_document' // Pièce d'identité officielle
  | 'hospital_badge';   // Badge hospitalier

/**
 * Statuts des abonnements utilisateur
 * Détermine l'accès aux fonctionnalités premium
 */
export type SubscriptionStatus = 
  | 'free'    // Compte gratuit - fonctionnalités de base
  | 'premium' // Abonnement payant - accès complet
  | 'trial';  // Période d'essai - accès temporaire premium

/**
 * Interface principale représentant un utilisateur de l'application
 * Structure complète des données utilisateur avec toutes les métadonnées
 */
export interface User {
  /** Identifiant unique de l'utilisateur (UUID) */
  id: string;
  
  /** Adresse email de l'utilisateur (utilisée pour la connexion) */
  email: string;
  
  /** Nom d'affichage public de l'utilisateur */
  displayName: string;
  
  /** Rôle de l'utilisateur déterminant ses permissions */
  role: UserRole;
  
  /** Statut de vérification KYC pour les professionnels */
  kycStatus: KycStatus;
  
  /** URL de l'image de profil (optionnel) */
  profileImage?: string;
  
  /** Université d'appartenance (pour les étudiants) */
  university?: string;
  
  /** Spécialité médicale (pour les professionnels) */
  specialty?: string;
  
  /** Statut d'abonnement actuel */
  subscriptionStatus: SubscriptionStatus;
  
  /** Date d'expiration de l'abonnement (null = permanent) */
  subscriptionExpiry?: Date | null;
  
  /** Date de création du compte */
  createdAt: Date;
  
  /** Date de dernière mise à jour du profil */
  updatedAt: Date;
}

/**
 * Interface pour les données de création d'un nouvel utilisateur
 * Contient les informations minimales requises lors de l'inscription
 */
export interface CreateUserData {
  /** Adresse email (sera validée) */
  email: string;
  
  /** Mot de passe (sera chiffré) */
  password: string;
  
  /** Nom d'affichage choisi par l'utilisateur */
  displayName: string;
  
  /** Rôle sélectionné lors de l'inscription */
  role: UserRole;
  
  /** Université (requis pour les étudiants) */
  university?: string;
  
  /** Spécialité (optionnel pour les professionnels) */
  specialty?: string;
}

/**
 * Interface pour les données de mise à jour du profil utilisateur
 * Toutes les propriétés sont optionnelles pour permettre des mises à jour partielles
 */
export interface UpdateUserData {
  /** Nouveau nom d'affichage */
  displayName?: string;
  
  /** Nouvelle image de profil */
  profileImage?: string;
  
  /** Nouvelle université */
  university?: string;
  
  /** Nouvelle spécialité */
  specialty?: string;
  
  /** Mise à jour du statut KYC (admin uniquement) */
  kycStatus?: KycStatus;
  
  /** Mise à jour du statut d'abonnement */
  subscriptionStatus?: SubscriptionStatus;
  
  /** Nouvelle date d'expiration d'abonnement */
  subscriptionExpiry?: Date | null;
}

/**
 * Interface pour les informations d'abonnement détaillées
 * Utilisée pour l'affichage et la gestion des abonnements
 */
export interface SubscriptionInfo {
  /** Statut actuel de l'abonnement */
  status: SubscriptionStatus;
  
  /** Date d'expiration (null pour les abonnements permanents) */
  expiryDate?: Date | null;
  
  /** Indique si l'abonnement est actif et valide */
  isActive: boolean;
  
  /** Nombre de jours restants (null si permanent) */
  daysRemaining?: number | null;
  
  /** Indique si l'abonnement expire bientôt (< 7 jours) */
  isExpiringSoon: boolean;
}

/**
 * Interface pour les documents KYC soumis par les utilisateurs
 * Gère le processus de vérification d'identité
 */
export interface KycDocument {
  /** Identifiant unique du document */
  id: string;
  
  /** ID de l'utilisateur propriétaire */
  userId: string;
  
  /** Type de document soumis */
  documentType: KycDocumentType;
  
  /** URL sécurisée du fichier uploadé */
  documentUrl: string;
  
  /** Statut de traitement du document */
  status: KycStatus;
  
  /** Date de soumission */
  createdAt: Date;
  
  /** Date de traitement (si applicable) */
  processedAt?: Date;
  
  /** Commentaires du modérateur (si rejeté) */
  moderatorNotes?: string;
}

/**
 * Interface pour les résultats de validation de données
 * Utilisée dans les formulaires et processus de validation
 */
export interface ValidationResult {
  /** Indique si les données sont valides */
  isValid: boolean;
  
  /** Liste des erreurs de validation */
  errors: string[];
  
  /** Avertissements (non bloquants) */
  warnings?: string[];
}

/**
 * Interface pour les statistiques utilisateur
 * Données agrégées pour les tableaux de bord et rapports
 */
export interface UserStats {
  /** Nombre total de sessions d'étude */
  totalStudySessions: number;
  
  /** Temps total d'étude (en minutes) */
  totalStudyTime: number;
  
  /** Nombre d'examens passés */
  totalExams: number;
  
  /** Score moyen aux examens */
  averageExamScore: number;
  
  /** Nombre de ressources créées */
  resourcesCreated: number;
  
  /** Nombre de contributions communautaires */
  communityContributions: number;
  
  /** Date de dernière activité */
  lastActivityDate: Date;
}

/**
 * Fonction utilitaire pour vérifier si des données sont valides
 * Évite les erreurs de type lors de la manipulation des données utilisateur
 * 
 * @param data - Données à valider
 * @returns true si les données contiennent les propriétés requises
 */
export const isValidData = (data: any): data is Record<string, any> => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

/**
 * Fonction utilitaire pour vérifier si un rôle nécessite une vérification KYC
 * Les professionnels doivent être vérifiés pour accéder aux fonctionnalités avancées
 * 
 * @param role - Rôle à vérifier
 * @returns true si le rôle nécessite une vérification KYC
 */
export const requiresKycVerification = (role: UserRole): boolean => {
  return role === 'professional';
};

/**
 * Fonction utilitaire pour vérifier si un utilisateur a accès aux fonctionnalités premium
 * Vérifie le statut d'abonnement et la date d'expiration
 * 
 * @param user - Utilisateur à vérifier
 * @returns true si l'utilisateur a un accès premium valide
 */
export const hasPremiumAccess = (user: User): boolean => {
  if (user.subscriptionStatus === 'free') return false;
  if (user.subscriptionStatus === 'premium') {
    // Vérifier la date d'expiration si elle existe
    if (user.subscriptionExpiry) {
      return new Date() < user.subscriptionExpiry;
    }
    return true; // Abonnement premium permanent
  }
  if (user.subscriptionStatus === 'trial') {
    // Vérifier si la période d'essai est encore valide
    return user.subscriptionExpiry ? new Date() < user.subscriptionExpiry : false;
  }
  return false;
};

/**
 * Fonction utilitaire pour obtenir le nom d'affichage d'un rôle en français
 * Utilisée dans l'interface utilisateur pour l'affichage
 * 
 * @param role - Rôle à traduire
 * @returns Nom du rôle en français
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    student: 'Étudiant',
    professional: 'Professionnel de santé',
    admin: 'Administrateur'
  };
  return roleNames[role];
};

/**
 * Fonction utilitaire pour obtenir le nom d'affichage d'un statut KYC en français
 * 
 * @param status - Statut KYC à traduire
 * @returns Nom du statut en français
 */
export const getKycStatusDisplayName = (status: KycStatus): string => {
  const statusNames: Record<KycStatus, string> = {
    not_submitted: 'Non soumis',
    pending: 'En cours de vérification',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  };
  return statusNames[status];
};

/**
 * Fonction utilitaire pour calculer les informations d'abonnement
 * 
 * @param user - Utilisateur pour lequel calculer les infos d'abonnement
 * @returns Informations détaillées sur l'abonnement
 */
export const getSubscriptionInfo = (user: User): SubscriptionInfo => {
  const now = new Date();
  const expiryDate = user.subscriptionExpiry;
  
  let isActive = false;
  let daysRemaining: number | null = null;
  let isExpiringSoon = false;
  
  if (user.subscriptionStatus === 'premium') {
    if (!expiryDate) {
      // Abonnement premium permanent
      isActive = true;
    } else {
      isActive = now < expiryDate;
      if (isActive) {
        daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysRemaining <= 7;
      }
    }
  } else if (user.subscriptionStatus === 'trial' && expiryDate) {
    isActive = now < expiryDate;
    if (isActive) {
      daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      isExpiringSoon = daysRemaining <= 3; // Plus court pour les essais
    }
  }
  
  return {
    status: user.subscriptionStatus,
    expiryDate,
    isActive,
    daysRemaining,
    isExpiringSoon
  };
};
