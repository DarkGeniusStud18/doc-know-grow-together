
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userPreferencesService } from '@/lib/database/userPreferences';
import { UserPreferences } from '@/types/database';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour la gestion complète des préférences utilisateur
 * 
 * Fonctionnalités :
 * - Chargement automatique des préférences depuis la base de données
 * - Création de préférences par défaut pour les nouveaux utilisateurs
 * - Mise à jour synchronisée avec la base de données
 * - Gestion des états de chargement et d'erreur
 * - Notifications utilisateur pour les opérations réussies/échouées
 * 
 * @returns Objet contenant les préférences et les fonctions de gestion
 */
export const useUserPreferences = () => {
  const { user } = useAuth();
  
  // États pour la gestion des préférences utilisateur
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Charge les préférences utilisateur depuis la base de données
   * Crée automatiquement des préférences par défaut si aucune n'existe
   * 
   * Gestion d'erreur robuste avec logs détaillés pour le débogage
   */
  const loadPreferences = useCallback(async () => {
    if (!user) {
      console.log('UserPreferences: Aucun utilisateur connecté - arrêt du chargement');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('UserPreferences: Début du chargement des préférences pour l\'utilisateur:', user.id);
      
      // Tentative de récupération des préférences existantes
      let userPrefs = await userPreferencesService.getUserPreferences(user.id);
      
      // Création automatique de préférences par défaut si nécessaire
      if (!userPrefs) {
        console.log('UserPreferences: Aucune préférence trouvée - création des préférences par défaut');
        
        // Configuration des préférences par défaut optimisées pour l'expérience utilisateur
        const defaultPreferences = {
          user_id: user.id,
          email_notifications: true,           // Notifications email activées par défaut
          push_notifications: true,            // Notifications push activées par défaut
          study_reminders: true,               // Rappels d'étude activés par défaut
          weekly_reports: true,                // Rapports hebdomadaires activés par défaut
          language: 'fr',                      // Français comme langue par défaut
          timezone: 'Europe/Paris'             // Fuseau horaire français par défaut
        };
        
        userPrefs = await userPreferencesService.createUserPreferences(defaultPreferences);
        console.log('UserPreferences: Préférences par défaut créées avec succès');
      }
      
      setPreferences(userPrefs);
      console.log('UserPreferences: Préférences chargées et appliquées avec succès');
      
    } catch (error) {
      console.error('UserPreferences: Erreur critique lors du chargement des préférences:', error);
      toast.error('Erreur lors du chargement de vos préférences. Veuillez actualiser la page.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Effet pour charger les préférences automatiquement au montage du composant
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  /**
   * Met à jour les préférences utilisateur dans la base de données
   * 
   * @param updates - Objet partiel contenant les champs à mettre à jour
   * @returns Promise avec les préférences mises à jour ou undefined en cas d'erreur
   */
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) {
      console.warn('UserPreferences: Tentative de mise à jour sans utilisateur connecté');
      toast.error('Vous devez être connecté pour modifier vos préférences');
      return;
    }

    try {
      console.log('UserPreferences: Début de la mise à jour des préférences:', updates);
      
      // Appel du service de mise à jour avec gestion d'erreur
      const updatedPreferences = await userPreferencesService.updateUserPreferences(user.id, updates);
      
      if (updatedPreferences) {
        setPreferences(updatedPreferences);
        toast.success('Vos préférences ont été mises à jour avec succès');
        console.log('UserPreferences: Mise à jour réussie et état local synchronisé');
        return updatedPreferences;
      } else {
        throw new Error('Aucune donnée retournée par le service de mise à jour');
      }
      
    } catch (error) {
      console.error('UserPreferences: Erreur lors de la mise à jour des préférences:', error);
      toast.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
      
      // Rechargement des préférences en cas d'erreur pour maintenir la cohérence
      await loadPreferences();
    }
  }, [user, loadPreferences]);

  /**
   * Force le rechargement des préférences depuis la base de données
   * Utile après des opérations externes ou pour la synchronisation
   */
  const refreshPreferences = useCallback(async () => {
    console.log('UserPreferences: Rechargement forcé des préférences demandé');
    await loadPreferences();
  }, [loadPreferences]);

  // Interface publique du hook avec toutes les fonctionnalités disponibles
  return {
    preferences,                    // Préférences actuelles de l'utilisateur
    isLoading,                     // État de chargement pour les interfaces
    updatePreferences,             // Fonction de mise à jour des préférences
    refreshPreferences            // Fonction de rechargement forcé
  };
};
