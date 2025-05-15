
import { supabase } from '@/integrations/supabase/client';
import { EnrichedGroupMessage } from '@/lib/auth/utils/types/validation-types';

/**
 * Récupère les messages d'un groupe d'étude
 * @param groupId Identifiant du groupe
 * @returns Messages du groupe avec les informations des expéditeurs
 */
export const fetchGroupMessages = async (groupId: string): Promise<EnrichedGroupMessage[]> => {
  try {
    // Appel de la fonction RPC pour récupérer les messages
    const { data: messagesData, error: messagesError } = await supabase
      .rpc('get_group_messages', { p_group_id: groupId });
    
    if (messagesError) throw messagesError;
    
    if (!messagesData || messagesData.length === 0) {
      return [];
    }
    
    // Récupérer les informations des utilisateurs pour ces messages
    const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, profile_image')
      .in('id', userIds);
      
    if (profilesError) throw profilesError;
    
    // Mapper les profils par ID pour un accès facile
    const profilesById: Record<string, any> = {};
    profilesData?.forEach(profile => {
      profilesById[profile.id] = profile;
    });
    
    // Enrichir les messages avec les informations des expéditeurs
    const enrichedMessages = messagesData.map(message => {
      const profile = profilesById[message.user_id] || {};
      
      return {
        ...message,
        sender_name: profile.display_name || 'Utilisateur inconnu',
        sender_avatar: profile.profile_image || null
      } as EnrichedGroupMessage;
    });
    
    return enrichedMessages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

/**
 * Envoie un nouveau message dans un groupe
 * @param content Contenu du message
 * @param userId ID de l'utilisateur
 * @param groupId ID du groupe
 * @returns ID du message créé ou null en cas d'erreur
 */
export const sendGroupMessage = async (
  content: string,
  userId: string,
  groupId: string
): Promise<string | null> => {
  try {
    // Utiliser la fonction RPC pour insérer le message
    const { data, error } = await supabase
      .rpc('insert_group_message', {
        p_content: content,
        p_user_id: userId,
        p_group_id: groupId
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return null;
  }
};

/**
 * Met à jour un message existant
 * @param messageId ID du message
 * @param content Nouveau contenu
 * @param userId ID de l'utilisateur (pour vérification)
 * @returns Succès ou échec de la mise à jour
 */
export const updateGroupMessage = async (
  messageId: string,
  content: string,
  userId: string
): Promise<boolean> => {
  try {
    // Utiliser la fonction RPC pour mettre à jour le message
    const { data, error } = await supabase
      .rpc('update_group_message', {
        p_message_id: messageId,
        p_content: content,
        p_user_id: userId
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    return false;
  }
};

/**
 * Supprime un message
 * @param messageId ID du message
 * @param userId ID de l'utilisateur (pour vérification)
 * @returns Succès ou échec de la suppression
 */
export const deleteGroupMessage = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Utiliser la fonction RPC pour supprimer le message
    const { data, error } = await supabase
      .rpc('delete_group_message', {
        p_message_id: messageId,
        p_user_id: userId
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    return false;
  }
};
