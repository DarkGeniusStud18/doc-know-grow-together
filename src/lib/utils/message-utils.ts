
// Utilitaires pour les messages et les discussions
import { supabase } from '@/integrations/supabase/client';
import { EnrichedGroupMessage } from '@/lib/auth/utils/types/validation-types';
import { toast } from '@/components/ui/sonner';

/**
 * Formate la date d'un message pour l'affichage
 * @param date Date à formater
 * @returns Date formatée en français
 */
export function formatMessageDate(date: string | Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  // Aujourd'hui
  if (messageDate.toDateString() === now.toDateString()) {
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }
  
  // Hier
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Hier à ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(messageDate)}`;
  }
  
  // Cette semaine
  if (diffDays < 7) {
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return `${weekdays[messageDate.getDay()]} à ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(messageDate)}`;
  }
  
  // Plus ancien
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(messageDate);
}

/**
 * Formate le statut de lecture d'un message
 * @param isRead État de lecture du message
 * @returns Texte formaté pour l'état de lecture
 */
export function formatReadStatus(isRead: boolean): string {
  return isRead ? "Lu" : "Non lu";
}

/**
 * Formate le nom d'un groupe de discussion
 * @param name Nom du groupe
 * @param isPrivate Si le groupe est privé
 * @returns Nom formaté avec indicateur de confidentialité
 */
export function formatGroupName(name: string, isPrivate: boolean): string {
  return isPrivate ? `${name} (Privé)` : name;
}

/**
 * Envoie un message à un groupe de discussion
 * @param content Contenu du message
 * @param userId ID de l'utilisateur qui envoie le message
 * @param groupId ID du groupe destinataire
 * @returns true si l'envoi a réussi, false sinon
 */
export async function sendGroupMessage(content: string, userId: string, groupId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('group_messages')
      .insert({
        content,
        user_id: userId,
        group_id: groupId
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    toast.error('Échec de l\'envoi du message', { 
      description: 'Veuillez réessayer ultérieurement.' 
    });
    return false;
  }
}

/**
 * Met à jour un message existant
 * @param messageId ID du message à mettre à jour
 * @param content Nouveau contenu du message
 * @param userId ID de l'utilisateur qui fait la mise à jour
 * @returns true si la mise à jour a réussi, false sinon
 */
export async function updateGroupMessage(messageId: string, content: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('group_messages')
      .update({ content })
      .eq('id', messageId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    toast.error('Échec de la mise à jour du message');
    return false;
  }
}

/**
 * Supprime un message existant
 * @param messageId ID du message à supprimer
 * @param userId ID de l'utilisateur qui demande la suppression
 * @returns true si la suppression a réussi, false sinon
 */
export async function deleteGroupMessage(messageId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('group_messages')
      .delete()
      .eq('id', messageId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    toast.error('Échec de la suppression du message');
    return false;
  }
}

/**
 * Récupère les messages d'un groupe avec information sur l'expéditeur
 * @param groupId ID du groupe
 * @returns Liste de messages enrichis
 */
export async function fetchGroupMessages(groupId: string): Promise<EnrichedGroupMessage[]> {
  try {
    // Récupérer les messages du groupe
    const { data: messages, error } = await supabase
      .from('group_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    if (!messages || messages.length === 0) return [];
    
    // Récupérer les profils des expéditeurs
    const userIds = [...new Set(messages.map(msg => msg.user_id))];
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, profile_image')
      .in('id', userIds);
    
    if (profileError) throw profileError;
    
    // Enrichir les messages avec les informations des expéditeurs
    const enrichedMessages = messages.map(message => {
      const sender = profiles?.find(profile => profile.id === message.user_id);
      return {
        ...message,
        sender_name: sender?.display_name || 'Utilisateur inconnu',
        sender_avatar: sender?.profile_image || ''
      };
    });
    
    return enrichedMessages;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
}
