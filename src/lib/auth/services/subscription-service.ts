
/**
 * Service pour gérer les abonnements premium des utilisateurs
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User } from "../types";

/**
 * Active l'abonnement premium pour un utilisateur
 * @param userId ID de l'utilisateur
 * @param durationMonths Durée de l'abonnement en mois
 * @returns Succès ou échec de l'activation
 */
export const activateSubscription = async (
  userId: string,
  durationMonths: number = 1
): Promise<boolean> => {
  try {
    // Calcul de la date d'expiration
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    
    // Mettre à jour le statut d'abonnement de l'utilisateur
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("Abonnement premium activé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'activation de l'abonnement:", error);
    toast.error("Erreur lors de l'activation de l'abonnement");
    return false;
  }
};

/**
 * Vérifie si un utilisateur a un abonnement premium actif
 * @param userId ID de l'utilisateur
 * @returns true si l'utilisateur a un abonnement premium actif
 */
export const checkPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    // Obtenir les informations d'abonnement de l'utilisateur
    const { data, error } = await supabase
      .rpc('has_premium_access', { user_id: userId });
    
    if (error) throw error;
    
    return data || false;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'abonnement:", error);
    return false;
  }
};

/**
 * Annule l'abonnement premium d'un utilisateur
 * (conserve l'accès jusqu'à la date d'expiration)
 * @param userId ID de l'utilisateur
 * @returns Succès ou échec de l'annulation
 */
export const cancelSubscription = async (userId: string): Promise<boolean> => {
  try {
    // Passer le statut à "free" mais conserver la date d'expiration
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("Abonnement annulé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'abonnement:", error);
    toast.error("Erreur lors de l'annulation de l'abonnement");
    return false;
  }
};

/**
 * Récupère les détails de l'abonnement d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Informations sur l'abonnement ou null si erreur
 */
export const getSubscriptionDetails = async (userId: string): Promise<{
  status: string;
  expiryDate: Date | null;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expiry')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      status: data.subscription_status,
      expiryDate: data.subscription_expiry ? new Date(data.subscription_expiry) : null
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des détails d'abonnement:", error);
    return null;
  }
};
