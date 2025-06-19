/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Hook personnalisé optimisé pour la gestion des chats de groupe
 * 
 * Fournit une interface complète pour :
 * - Charger et synchroniser les messages en temps réel
 * - Gérer le cache local pour les performances
 * - Optimiser les requêtes et réduire la latence
 * - Gestion d'erreur robuste avec retry automatique
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EnrichedGroupMessage } from '@/lib/auth/utils/types/validation-types';
import { useRealtimeSync } from './useRealtimeSync';
import { toast } from '@/components/ui/sonner';

/**
 * Configuration pour le retry automatique
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 seconde
  maxDelay: 5000   // 5 secondes maximum
};

/**
 * Hook principal pour la gestion des chats de groupe
 * Optimisé avec cache local et synchronisation temps réel
 * 
 * @param groupId - Identifiant du groupe de discussion
 * @returns Objet contenant les messages et fonctions de gestion
 */
export const useGroupChat = (groupId: string) => {
  const { user } = useAuth();
  
  // États locaux pour la gestion des messages
  const [messages, setMessages] = useState<EnrichedGroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Références pour éviter les fuites mémoire et optimiser les performances
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const lastLoadTime = useRef<number>(0);
  const cacheRef = useRef<Map<string, EnrichedGroupMessage[]>>(new Map());

  /**
   * Fonction utilitaire pour implémenter le retry avec backoff exponentiel
   * @param fn - Fonction à exécuter avec retry
   * @param retryCount - Nombre de tentatives déjà effectuées
   */
  const withRetry = useCallback(async <T>(
    fn: () => Promise<T>, 
    retryCount: number = 0
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retryCount < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
          RETRY_CONFIG.maxDelay
        );
        
        console.warn(`GroupChat: Tentative ${retryCount + 1}/${RETRY_CONFIG.maxRetries} échouée, retry dans ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retryCount + 1);
      }
      throw error;
    }
  }, []);

  /**
   * Charge les messages du groupe avec optimisations de performance
   * Utilise le cache et évite les requêtes redondantes
   */
  const loadMessages = useCallback(async () => {
    if (!groupId || !user) {
      console.log('GroupChat: Paramètres manquants pour le chargement', { groupId, user: !!user });
      setIsLoading(false);
      return;
    }

    // Éviter les requêtes trop fréquentes (debouncing)
    const now = Date.now();
    if (now - lastLoadTime.current < 1000) {
      console.log('GroupChat: Requête ignorée - trop récente');
      return;
    }
    lastLoadTime.current = now;

    // Vérifier le cache en premier
    const cachedMessages = cacheRef.current.get(groupId);
    if (cachedMessages && !isLoading) {
      console.log('GroupChat: Utilisation du cache pour le groupe:', groupId);
      setMessages(cachedMessages);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('GroupChat: Chargement des messages pour le groupe:', groupId);

      // Exécution de la requête avec retry automatique
      const { data, error: queryError } = await withRetry(async () => {
        return await supabase
          .from('group_messages')
          .select(`
            id,
            content,
            created_at,
            updated_at,
            user_id,
            group_id,
            profiles!group_messages_user_id_fkey (
              display_name,
              profile_image
            )
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });
      });

      if (queryError) {
        console.error('GroupChat: Erreur lors du chargement des messages:', queryError);
        throw queryError;
      }

      // Transformation et enrichissement des données
      const enrichedMessages: EnrichedGroupMessage[] = (data || []).map(message => ({
        id: message.id,
        content: message.content,
        created_at: message.created_at,
        updated_at: message.updated_at,
        user_id: message.user_id,
        group_id: message.group_id,
        sender_name: message.profiles?.display_name || 'Utilisateur inconnu',
        sender_avatar: message.profiles?.profile_image || null
      }));

      // Mise à jour du cache et de l'état
      cacheRef.current.set(groupId, enrichedMessages);
      setMessages(enrichedMessages);
      
      console.log('GroupChat: Messages chargés avec succès:', enrichedMessages.length);
      
    } catch (error) {
      console.error('GroupChat: Erreur fatale lors du chargement:', error);
      setError('Impossible de charger les messages du groupe');
      toast.error('Erreur de chargement', {
        description: 'Impossible de charger les messages du groupe'
      });
    } finally {
      setIsLoading(false);
    }
  }, [groupId, user, withRetry, isLoading]);

  /**
   * Rechargement optimisé des messages avec invalidation de cache
   */
  const reloadMessages = useCallback(async () => {
    console.log('GroupChat: Rechargement forcé des messages');
    
    // Invalidation du cache pour forcer le rechargement
    cacheRef.current.delete(groupId);
    lastLoadTime.current = 0;
    
    await loadMessages();
  }, [groupId, loadMessages]);

  /**
   * Ajoute un nouveau message à la liste locale de façon optimiste
   * Améliore la perception de performance
   * 
   * @param newMessage - Nouveau message à ajouter
   */
  const addMessageOptimistically = useCallback((newMessage: EnrichedGroupMessage) => {
    console.log('GroupChat: Ajout optimiste d\'un message');
    
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      // Mise à jour du cache
      cacheRef.current.set(groupId, updatedMessages);
      return updatedMessages;
    });
  }, [groupId]);

  /**
   * Met à jour un message existant dans la liste locale
   * 
   * @param messageId - ID du message à mettre à jour
   * @param updates - Champs à mettre à jour
   */
  const updateMessageOptimistically = useCallback((
    messageId: string, 
    updates: Partial<EnrichedGroupMessage>
  ) => {
    console.log('GroupChat: Mise à jour optimiste du message:', messageId);
    
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
      // Mise à jour du cache
      cacheRef.current.set(groupId, updatedMessages);
      return updatedMessages;
    });
  }, [groupId]);

  /**
   * Supprime un message de la liste locale de façon optimiste
   * 
   * @param messageId - ID du message à supprimer
   */
  const removeMessageOptimistically = useCallback((messageId: string) => {
    console.log('GroupChat: Suppression optimiste du message:', messageId);
    
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.filter(msg => msg.id !== messageId);
      // Mise à jour du cache
      cacheRef.current.set(groupId, updatedMessages);
      return updatedMessages;
    });
  }, [groupId]);

  // Chargement initial des messages
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Synchronisation en temps réel pour les mises à jour automatiques
  useRealtimeSync('group_messages', reloadMessages);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      // Conservation du cache pour une utilisation future
      console.log('GroupChat: Nettoyage du hook pour le groupe:', groupId);
    };
  }, [groupId]);

  return {
    // États de données
    messages,
    isLoading,
    error,
    
    // Actions disponibles
    reloadMessages,
    addMessageOptimistically,
    updateMessageOptimistically,
    removeMessageOptimistically,
    
    // Informations utiles
    messageCount: messages.length,
    hasMessages: messages.length > 0
  };
};

export default useGroupChat;
