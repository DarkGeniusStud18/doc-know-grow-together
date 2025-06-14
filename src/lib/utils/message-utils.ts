
/**
 * Utilitaires optimisés pour la gestion des messages de groupe
 * 
 * Fournit des fonctions robustes pour :
 * - Envoyer des messages avec validation et retry
 * - Mettre à jour et supprimer des messages avec autorisation
 * - Formater les dates de façon localisée
 * - Gérer les erreurs avec feedback utilisateur approprié
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Configuration pour les limites et validations des messages
 */
const MESSAGE_CONFIG = {
  maxLength: 2000,        // Longueur maximale d'un message
  minLength: 1,           // Longueur minimale (après trim)
  retryAttempts: 3,       // Nombre de tentatives en cas d'échec
  retryDelay: 1000        // Délai entre les tentatives (ms)
} as const;

/**
 * Messages d'erreur localisés pour une meilleure UX
 */
const ERROR_MESSAGES = {
  empty: 'Le message ne peut pas être vide',
  tooLong: `Le message ne peut pas dépasser ${MESSAGE_CONFIG.maxLength} caractères`,
  unauthorized: 'Vous n\'êtes pas autorisé à effectuer cette action',
  networkError: 'Erreur de connexion, veuillez réessayer',
  serverError: 'Erreur du serveur, veuillez réessayer plus tard',
  notFound: 'Message introuvable',
  generic: 'Une erreur inattendue s\'est produite'
} as const;

/**
 * Validation du contenu d'un message
 * @param content - Contenu du message à valider
 * @returns Objet de validation avec le résultat et les erreurs
 */
const validateMessageContent = (content: string): { isValid: boolean; error?: string } => {
  const trimmedContent = content.trim();
  
  if (trimmedContent.length < MESSAGE_CONFIG.minLength) {
    return { isValid: false, error: ERROR_MESSAGES.empty };
  }
  
  if (trimmedContent.length > MESSAGE_CONFIG.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.tooLong };
  }
  
  return { isValid: true };
};

/**
 * Fonction utilitaire pour implémenter le retry avec backoff exponentiel
 * @param fn - Fonction à exécuter avec retry
 * @param attempts - Nombre de tentatives restantes
 * @returns Résultat de la fonction ou erreur après épuisement des tentatives
 */
const withRetry = async <T>(
  fn: () => Promise<T>,
  attempts: number = MESSAGE_CONFIG.retryAttempts
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts > 1) {
      console.warn(`MessageUtils: Tentative échouée, ${attempts - 1} tentatives restantes`);
      
      // Délai progressif entre les tentatives
      const delay = MESSAGE_CONFIG.retryDelay * (MESSAGE_CONFIG.retryAttempts - attempts + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return withRetry(fn, attempts - 1);
    }
    throw error;
  }
};

/**
 * Envoie un nouveau message dans un groupe avec validation et gestion d'erreur
 * @param content - Contenu du message
 * @param userId - ID de l'utilisateur expéditeur
 * @param groupId - ID du groupe de destination
 * @returns Promise<boolean> - true si l'envoi a réussi, false sinon
 */
export const sendGroupMessage = async (
  content: string,
  userId: string,
  groupId: string
): Promise<boolean> => {
  console.log('MessageUtils: Tentative d\'envoi de message:', { 
    contentLength: content.length, 
    userId, 
    groupId 
  });

  try {
    // Validation du contenu
    const validation = validateMessageContent(content);
    if (!validation.isValid) {
      console.warn('MessageUtils: Validation du message échouée:', validation.error);
      toast.error('Message invalide', { description: validation.error });
      return false;
    }

    // Validation des paramètres requis
    if (!userId || !groupId) {
      console.error('MessageUtils: Paramètres manquants:', { userId: !!userId, groupId: !!groupId });
      toast.error('Erreur de configuration', { 
        description: 'Paramètres manquants pour l\'envoi du message' 
      });
      return false;
    }

    // Envoi du message avec retry automatique
    const { data, error } = await withRetry(async () => {
      return await supabase
        .rpc('insert_group_message', {
          p_content: content.trim(),
          p_user_id: userId,
          p_group_id: groupId
        });
    });

    if (error) {
      console.error('MessageUtils: Erreur lors de l\'envoi du message:', error);
      
      // Gestion spécifique des types d'erreur
      if (error.code === '23503') {
        toast.error('Erreur d\'autorisation', { 
          description: 'Vous n\'êtes pas membre de ce groupe' 
        });
      } else if (error.message?.includes('network')) {
        toast.error('Erreur de connexion', { 
          description: ERROR_MESSAGES.networkError 
        });
      } else {
        toast.error('Erreur d\'envoi', { 
          description: ERROR_MESSAGES.serverError 
        });
      }
      return false;
    }

    console.log('MessageUtils: Message envoyé avec succès, ID:', data);
    toast.success('Message envoyé');
    return true;

  } catch (error) {
    console.error('MessageUtils: Erreur inattendue lors de l\'envoi:', error);
    toast.error('Erreur inattendue', { description: ERROR_MESSAGES.generic });
    return false;
  }
};

/**
 * Met à jour le contenu d'un message existant avec autorisation
 * @param messageId - ID du message à modifier
 * @param newContent - Nouveau contenu du message
 * @param userId - ID de l'utilisateur qui modifie (doit être l'auteur)
 * @returns Promise<boolean> - true si la mise à jour a réussi, false sinon
 */
export const updateGroupMessage = async (
  messageId: string,
  newContent: string,
  userId: string
): Promise<boolean> => {
  console.log('MessageUtils: Tentative de mise à jour du message:', { messageId, userId });

  try {
    // Validation du nouveau contenu
    const validation = validateMessageContent(newContent);
    if (!validation.isValid) {
      console.warn('MessageUtils: Validation du nouveau contenu échouée:', validation.error);
      toast.error('Contenu invalide', { description: validation.error });
      return false;
    }

    // Validation des paramètres
    if (!messageId || !userId) {
      console.error('MessageUtils: Paramètres manquants pour la mise à jour');
      toast.error('Erreur de configuration');
      return false;
    }

    // Mise à jour avec vérification d'autorisation
    const { data: success, error } = await withRetry(async () => {
      return await supabase
        .rpc('update_group_message', {
          p_message_id: messageId,
          p_content: newContent.trim(),
          p_user_id: userId
        });
    });

    if (error) {
      console.error('MessageUtils: Erreur lors de la mise à jour:', error);
      
      if (error.code === '23503' || error.message?.includes('permission')) {
        toast.error('Modification non autorisée', { 
          description: 'Vous ne pouvez modifier que vos propres messages' 
        });
      } else {
        toast.error('Erreur de mise à jour', { description: ERROR_MESSAGES.serverError });
      }
      return false;
    }

    if (!success) {
      console.warn('MessageUtils: Mise à jour échouée - message non trouvé ou non autorisé');
      toast.error('Modification impossible', { 
        description: 'Message introuvable ou modification non autorisée' 
      });
      return false;
    }

    console.log('MessageUtils: Message mis à jour avec succès');
    toast.success('Message modifié');
    return true;

  } catch (error) {
    console.error('MessageUtils: Erreur inattendue lors de la mise à jour:', error);
    toast.error('Erreur inattendue', { description: ERROR_MESSAGES.generic });
    return false;
  }
};

/**
 * Supprime un message avec vérification d'autorisation
 * @param messageId - ID du message à supprimer
 * @param userId - ID de l'utilisateur qui supprime
 * @returns Promise<boolean> - true si la suppression a réussi, false sinon
 */
export const deleteGroupMessage = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  console.log('MessageUtils: Tentative de suppression du message:', { messageId, userId });

  try {
    // Validation des paramètres
    if (!messageId || !userId) {
      console.error('MessageUtils: Paramètres manquants pour la suppression');
      toast.error('Erreur de configuration');
      return false;
    }

    // Confirmation utilisateur pour les suppressions
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?');
    if (!confirmed) {
      console.log('MessageUtils: Suppression annulée par l\'utilisateur');
      return false;
    }

    // Suppression avec vérification d'autorisation
    const { data: success, error } = await withRetry(async () => {
      return await supabase
        .rpc('delete_group_message', {
          p_message_id: messageId,
          p_user_id: userId
        });
    });

    if (error) {
      console.error('MessageUtils: Erreur lors de la suppression:', error);
      
      if (error.code === '23503' || error.message?.includes('permission')) {
        toast.error('Suppression non autorisée', { 
          description: 'Vous ne pouvez supprimer que vos propres messages' 
        });
      } else {
        toast.error('Erreur de suppression', { description: ERROR_MESSAGES.serverError });
      }
      return false;
    }

    if (!success) {
      console.warn('MessageUtils: Suppression échouée - message non trouvé ou non autorisé');
      toast.error('Suppression impossible', { 
        description: 'Message introuvable ou suppression non autorisée' 
      });
      return false;
    }

    console.log('MessageUtils: Message supprimé avec succès');
    toast.success('Message supprimé');
    return true;

  } catch (error) {
    console.error('MessageUtils: Erreur inattendue lors de la suppression:', error);
    toast.error('Erreur inattendue', { description: ERROR_MESSAGES.generic });
    return false;
  }
};

/**
 * Formate une date de message de façon localisée et intelligente
 * @param dateString - Date au format ISO string
 * @returns Chaîne formatée selon l'ancienneté du message
 */
export const formatMessageDate = (dateString: string): string => {
  try {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    // Validation de la date
    if (isNaN(messageDate.getTime())) {
      console.warn('MessageUtils: Date invalide fournie:', dateString);
      return 'Date invalide';
    }

    // Formatage intelligent selon l'ancienneté
    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) { // Moins de 24h
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else if (diffInMinutes < 10080) { // Moins d'une semaine
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      // Plus d'une semaine : affichage de la date complète
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(messageDate);
    }
  } catch (error) {
    console.error('MessageUtils: Erreur lors du formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Fonction utilitaire pour obtenir des statistiques sur les messages
 * @param messages - Liste des messages à analyser
 * @returns Objet contenant les statistiques
 */
export const getMessageStats = (messages: Array<{ created_at: string; user_id: string }>) => {
  if (!messages.length) {
    return {
      totalMessages: 0,
      uniqueUsers: 0,
      messagesLast24h: 0,
      averageMessagesPerUser: 0
    };
  }

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const uniqueUsers = new Set(messages.map(msg => msg.user_id)).size;
  const messagesLast24h = messages.filter(msg => 
    new Date(msg.created_at) > yesterday
  ).length;
  
  return {
    totalMessages: messages.length,
    uniqueUsers,
    messagesLast24h,
    averageMessagesPerUser: uniqueUsers > 0 ? Math.round(messages.length / uniqueUsers) : 0
  };
};
