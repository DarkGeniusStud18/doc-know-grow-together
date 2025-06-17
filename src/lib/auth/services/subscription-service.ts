
/**
 * Service de gestion des abonnements pour MedCollab
 * 
 * Ce service gère toutes les opérations liées aux abonnements utilisateur :
 * - Récupération des détails d'abonnement
 * - Validation des permissions premium
 * - Calcul des dates d'expiration
 * - Gestion des périodes d'essai
 * - Optimisations de performance avec cache local
 */

import { supabase } from "@/integrations/supabase/client";
import { SubscriptionInfo, User, SubscriptionStatus } from "../types";
import { toast } from "@/components/ui/sonner";

/**
 * Interface pour les détails d'abonnement récupérés de la base de données
 * Structure normalisée des données de subscription
 */
interface SubscriptionDetails {
  /** Statut actuel de l'abonnement */
  status: SubscriptionStatus;
  /** Date d'expiration (null = permanent) */
  expiryDate: Date | null;
  /** Indique si l'abonnement est actuellement actif */
  isActive: boolean;
  /** Nombre de jours restants avant expiration */
  daysRemaining: number | null;
  /** Indique si l'abonnement expire dans les 7 prochains jours */
  isExpiringSoon: boolean;
}

/**
 * Cache local pour les détails d'abonnement
 * Évite les requêtes répétées à la base de données
 */
const subscriptionCache = new Map<string, {
  data: SubscriptionDetails;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}>();

/**
 * Durée de validité du cache (5 minutes)
 * Balance entre performance et fraîcheur des données
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Récupère les détails d'abonnement pour un utilisateur
 * Implémente un système de cache pour optimiser les performances
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise<SubscriptionDetails | null> Détails de l'abonnement ou null si erreur
 * 
 * @example
 * ```typescript
 * const subscription = await getSubscriptionDetails(user.id);
 * if (subscription?.isActive) {
 *   // Accorder l'accès premium
 * }
 * ```
 */
export const getSubscriptionDetails = async (userId: string): Promise<SubscriptionDetails | null> => {
  console.log('🔍 SubscriptionService: Récupération des détails d\'abonnement pour:', userId);

  try {
    // Vérification du cache local
    const cached = subscriptionCache.get(userId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < cached.ttl) {
      console.log('⚡ SubscriptionService: Données récupérées depuis le cache');
      return cached.data;
    }

    // Requête à la base de données
    console.log('📡 SubscriptionService: Requête base de données...');
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expiry')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ SubscriptionService: Erreur lors de la récupération:', error);
      throw error;
    }

    if (!profile) {
      console.warn('⚠️ SubscriptionService: Profil utilisateur non trouvé');
      return null;
    }

    // Calcul des détails d'abonnement
    const subscriptionDetails = calculateSubscriptionDetails(
      profile.subscription_status,
      profile.subscription_expiry
    );

    // Mise à jour du cache
    subscriptionCache.set(userId, {
      data: subscriptionDetails,
      timestamp: now,
      ttl: CACHE_TTL
    });

    console.log('✅ SubscriptionService: Détails récupérés avec succès:', {
      status: subscriptionDetails.status,
      isActive: subscriptionDetails.isActive,
      daysRemaining: subscriptionDetails.daysRemaining
    });

    return subscriptionDetails;

  } catch (error) {
    console.error('💥 SubscriptionService: Erreur critique:', error);
    
    // Toast d'erreur pour informer l'utilisateur
    toast.error('Erreur d\'abonnement', {
      description: 'Impossible de vérifier votre statut d\'abonnement',
      duration: 5000
    });

    return null;
  }
};

/**
 * Calcule les détails d'un abonnement basé sur le statut et la date d'expiration
 * Fonction pure pour faciliter les tests et la maintenance
 * 
 * @param status - Statut de l'abonnement
 * @param expiryDate - Date d'expiration (string ISO ou null)
 * @returns SubscriptionDetails Détails calculés de l'abonnement
 */
const calculateSubscriptionDetails = (
  status: SubscriptionStatus, 
  expiryDate: string | null
): SubscriptionDetails => {
  const now = new Date();
  const expiry = expiryDate ? new Date(expiryDate) : null;
  
  let isActive = false;
  let daysRemaining: number | null = null;
  let isExpiringSoon = false;

  // Logique de calcul selon le type d'abonnement
  switch (status) {
    case 'premium':
      if (!expiry) {
        // Abonnement premium permanent
        isActive = true;
      } else {
        isActive = now < expiry;
        if (isActive) {
          daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          isExpiringSoon = daysRemaining <= 7;
        }
      }
      break;

    case 'trial':
      if (expiry) {
        isActive = now < expiry;
        if (isActive) {
          daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          isExpiringSoon = daysRemaining <= 3; // Alerte plus précoce pour les essais
        }
      }
      break;

    case 'free':
    default:
      // Abonnement gratuit - pas de logique d'expiration
      isActive = false;
      break;
  }

  return {
    status,
    expiryDate: expiry,
    isActive,
    daysRemaining,
    isExpiringSoon
  };
};

/**
 * Vérifie si un utilisateur a accès aux fonctionnalités premium
 * Version optimisée avec cache pour des vérifications fréquentes
 * 
 * @param userId - ID de l'utilisateur à vérifier
 * @returns Promise<boolean> true si l'utilisateur a un accès premium valide
 * 
 * @example
 * ```typescript
 * const canAccessPremium = await checkPremiumAccess(user.id);
 * if (canAccessPremium) {
 *   showPremiumContent();
 * } else {
 *   showUpgradePrompt();
 * }
 * ```
 */
export const checkPremiumAccess = async (userId: string): Promise<boolean> => {
  console.log('🔐 SubscriptionService: Vérification accès premium pour:', userId);

  try {
    const details = await getSubscriptionDetails(userId);
    const hasAccess = details?.isActive ?? false;
    
    console.log('🎯 SubscriptionService: Résultat vérification premium:', hasAccess);
    return hasAccess;

  } catch (error) {
    console.error('❌ SubscriptionService: Erreur vérification premium:', error);
    // En cas d'erreur, refuser l'accès par sécurité
    return false;
  }
};

/**
 * Met à jour le statut d'abonnement d'un utilisateur
 * Invalide le cache pour forcer la récupération des nouvelles données
 * 
 * @param userId - ID de l'utilisateur
 * @param newStatus - Nouveau statut d'abonnement
 * @param expiryDate - Nouvelle date d'expiration (optionnel)
 * @returns Promise<boolean> true si la mise à jour a réussi
 * 
 * @example
 * ```typescript
 * const success = await updateSubscriptionStatus(
 *   user.id, 
 *   'premium', 
 *   new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // +1 an
 * );
 * ```
 */
export const updateSubscriptionStatus = async (
  userId: string,
  newStatus: SubscriptionStatus,
  expiryDate?: Date | null
): Promise<boolean> => {
  console.log('🔄 SubscriptionService: Mise à jour statut abonnement:', {
    userId,
    newStatus,
    expiryDate: expiryDate?.toISOString()
  });

  try {
    const updateData: any = {
      subscription_status: newStatus,
      updated_at: new Date().toISOString()
    };

    // Ajouter la date d'expiration si fournie
    if (expiryDate !== undefined) {
      updateData.subscription_expiry = expiryDate?.toISOString() || null;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('❌ SubscriptionService: Erreur mise à jour BDD:', error);
      throw error;
    }

    // Invalidation du cache pour forcer la récupération des nouvelles données
    subscriptionCache.delete(userId);
    console.log('🗑️ SubscriptionService: Cache invalidé pour:', userId);

    console.log('✅ SubscriptionService: Statut d\'abonnement mis à jour avec succès');
    
    toast.success('Abonnement mis à jour', {
      description: 'Votre statut d\'abonnement a été actualisé'
    });

    return true;

  } catch (error: any) {
    console.error('💥 SubscriptionService: Erreur critique mise à jour:', error);
    
    toast.error('Erreur de mise à jour', {
      description: error.message || 'Impossible de mettre à jour votre abonnement'
    });

    return false;
  }
};

/**
 * Démarre une période d'essai pour un utilisateur
 * Configure automatiquement la date d'expiration et le statut
 * 
 * @param userId - ID de l'utilisateur
 * @param trialDays - Durée de l'essai en jours (défaut: 14)
 * @returns Promise<boolean> true si l'essai a été activé
 * 
 * @example
 * ```typescript
 * const trialStarted = await startTrialSubscription(user.id, 30); // 30 jours d'essai
 * if (trialStarted) {
 *   showTrialWelcomeMessage();
 * }
 * ```
 */
export const startTrialSubscription = async (
  userId: string,
  trialDays: number = 14
): Promise<boolean> => {
  console.log('🎁 SubscriptionService: Démarrage période d\'essai:', {
    userId,
    trialDays
  });

  // Calcul de la date d'expiration
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + trialDays);

  const success = await updateSubscriptionStatus(userId, 'trial', expiryDate);

  if (success) {
    console.log('✅ SubscriptionService: Période d\'essai activée jusqu\'au:', expiryDate.toISOString());
    
    toast.success('Essai gratuit activé !', {
      description: `Profitez de ${trialDays} jours d'accès premium gratuit`,
      duration: 8000
    });
  }

  return success;
};

/**
 * Vérifie et nettoie les abonnements expirés
 * Fonction utilitaire pour la maintenance automatique
 * 
 * @param userId - ID de l'utilisateur à vérifier
 * @returns Promise<boolean> true si l'abonnement était expiré et a été nettoyé
 */
export const cleanupExpiredSubscription = async (userId: string): Promise<boolean> => {
  console.log('🧹 SubscriptionService: Vérification abonnements expirés pour:', userId);

  try {
    const details = await getSubscriptionDetails(userId);
    
    if (!details) return false;

    // Vérifier si l'abonnement est expiré
    if ((details.status === 'premium' || details.status === 'trial') && 
        details.expiryDate && 
        new Date() >= details.expiryDate) {
      
      console.log('⏰ SubscriptionService: Abonnement expiré détecté, conversion en gratuit');
      
      const cleaned = await updateSubscriptionStatus(userId, 'free', null);
      
      if (cleaned) {
        toast.warning('Abonnement expiré', {
          description: 'Votre abonnement premium a expiré. Renouvelez pour continuer à profiter des fonctionnalités premium.',
          duration: 10000
        });
      }

      return cleaned;
    }

    return false;

  } catch (error) {
    console.error('❌ SubscriptionService: Erreur nettoyage abonnement expiré:', error);
    return false;
  }
};

/**
 * Obtient un résumé des statistiques d'abonnement pour l'admin
 * Utile pour les tableaux de bord administrateur
 * 
 * @returns Promise<object> Statistiques globales des abonnements
 */
export const getSubscriptionStats = async () => {
  console.log('📊 SubscriptionService: Récupération statistiques abonnements');

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .not('subscription_status', 'is', null);

    if (error) throw error;

    // Calcul des statistiques
    const stats = data.reduce((acc, profile) => {
      const status = profile.subscription_status;
      acc[status] = (acc[status] || 0) + 1;
      acc.total += 1;
      return acc;
    }, { free: 0, premium: 0, trial: 0, total: 0 });

    console.log('✅ SubscriptionService: Statistiques calculées:', stats);
    return stats;

  } catch (error) {
    console.error('❌ SubscriptionService: Erreur calcul statistiques:', error);
    return null;
  }
};

/**
 * Invalide manuellement le cache pour un utilisateur
 * Utile après des modifications externes du statut d'abonnement
 * 
 * @param userId - ID de l'utilisateur pour lequel invalider le cache
 */
export const invalidateSubscriptionCache = (userId: string): void => {
  subscriptionCache.delete(userId);
  console.log('🗑️ SubscriptionService: Cache invalidé manuellement pour:', userId);
};

/**
 * Vide complètement le cache des abonnements
 * Utile pour le débogage ou les opérations de maintenance
 */
export const clearAllSubscriptionCache = (): void => {
  subscriptionCache.clear();
  console.log('🗑️ SubscriptionService: Cache complet vidé');
};
