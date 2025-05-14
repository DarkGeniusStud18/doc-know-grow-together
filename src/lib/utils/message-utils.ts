
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { EnrichedGroupMessage, GroupMessage } from '@/lib/auth/utils/types/validation-types';

// Define interfaces for RPC function parameters
interface GetGroupMessagesParams {
  p_group_id: string;
}

interface InsertGroupMessageParams {
  p_content: string;
  p_user_id: string;
  p_group_id: string;
}

interface UpdateGroupMessageParams {
  p_message_id: string;
  p_content: string;
  p_user_id: string;
}

interface DeleteGroupMessageParams {
  p_message_id: string;
  p_user_id: string;
}

export const fetchGroupMessages = async (groupId: string): Promise<EnrichedGroupMessage[]> => {
  try {
    // Use custom RPC function to fetch messages
    const { data: messagesData, error: messagesError } = await supabase
      .rpc('get_group_messages' as any, { 
        p_group_id: groupId 
      } as GetGroupMessagesParams);
    
    if (messagesError) {
      throw messagesError;
    }
    
    // Fetch sender information for each message
    const enrichedMessages = await Promise.all((messagesData || []).map(async (message: GroupMessage) => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, profile_image')
        .eq('id', message.user_id)
        .single();
        
      return {
        ...message,
        sender_name: profileData?.display_name || 'Unknown User',
        sender_avatar: profileData?.profile_image || ''
      } as EnrichedGroupMessage;
    }));
    
    return enrichedMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Erreur lors du chargement des messages');
    return [];
  }
};

export const sendGroupMessage = async (
  content: string,
  userId: string,
  groupId: string
): Promise<boolean> => {
  try {
    // Use a custom RPC function
    const { error } = await supabase
      .rpc('insert_group_message' as any, {
        p_content: content,
        p_user_id: userId,
        p_group_id: groupId
      } as InsertGroupMessageParams);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Erreur lors de l\'envoi du message');
    return false;
  }
};

export const updateGroupMessage = async (
  messageId: string,
  content: string,
  userId: string
): Promise<boolean> => {
  try {
    // Use a custom RPC function
    const { error } = await supabase
      .rpc('update_group_message' as any, {
        p_message_id: messageId,
        p_content: content,
        p_user_id: userId
      } as UpdateGroupMessageParams);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating message:', error);
    toast.error('Erreur lors de la mise à jour du message');
    return false;
  }
};

export const deleteGroupMessage = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Use a custom RPC function
    const { error } = await supabase
      .rpc('delete_group_message' as any, {
        p_message_id: messageId,
        p_user_id: userId
      } as DeleteGroupMessageParams);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    toast.error('Erreur lors de la suppression du message');
    return false;
  }
};

export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
