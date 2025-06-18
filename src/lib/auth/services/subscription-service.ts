
/**
 * Service de gestion des abonnements utilisateur
 * Fournit des fonctionnalités pour vérifier et gérer les statuts d'abonnement
 */

import { supabase } from '@/integrations/supabase/client';
import { User, SubscriptionStatus } from '../types';
import { toast } from '@/components/ui/sonner';

/**
 * Vérifie si un utilisateur a un statut premium actif
 * @param userId - ID de l'utilisateur à vérifier
 * @returns true si l'utilisateur a un accès premium valide
 */
export const checkPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expiry')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la vérification du statut premium:', error);
      return false;
    }

    if (!data) return false;

    const { subscription_status, subscription_expiry } = data;
    
    // Vérifier si l'abonnement est premium ou en période d'essai
    if (subscription_status === 'free') return false;
    
    // Si pas de date d'expiration, considérer comme permanent
    if (!subscription_expiry) return subscription_status === 'premium';
    
    // Vérifier si l'abonnement n'a pas expiré
    const expiryDate = new Date(subscription_expiry);
    const now = new Date();
    
    return subscription_status === 'premium' && expiryDate > now;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut premium:', error);
    return false;
  }
};

/**
 * Récupère les détails d'abonnement d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Détails de l'abonnement ou null si erreur
 */
export const getSubscriptionDetails = async (userId: string): Promise<{
  status: SubscriptionStatus;
  expiryDate: Date | null;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expiry')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des détails d\'abonnement:', error);
      return null;
    }

    if (!data) return null;

    return {
      status: data.subscription_status as SubscriptionStatus,
      expiryDate: data.subscription_expiry ? new Date(data.subscription_expiry) : null
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails d\'abonnement:', error);
    return null;
  }
};

/**
 * Active un abonnement premium pour un utilisateur
 * @param userId - ID de l'utilisateur
 * @param durationMonths - Durée en mois de l'abonnement
 * @returns true si l'activation a réussi
 */
export const activateSubscription = async (
  userId: string, 
  durationMonths: number
): Promise<boolean> => {
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_expiry: expiryDate.toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de l\'activation de l\'abonnement:', error);
      toast.error('Erreur lors de l\'activation de l\'abonnement');
      return false;
    }

    console.log('Abonnement activé avec succès pour l\'utilisateur:', userId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'abonnement:', error);
    toast.error('Erreur lors de l\'activation de l\'abonnement');
    return false;
  }
};

/**
 * Annule un abonnement utilisateur
 * @param userId - ID de l'utilisateur
 * @returns true si l'annulation a réussi
 */
export const cancelSubscription = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'free',
        subscription_expiry: null
      })
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
      return false;
    }

    toast.success('Abonnement annulé avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    toast.error('Erreur lors de l\'annulation de l\'abonnement');
    return false;
  }
};
