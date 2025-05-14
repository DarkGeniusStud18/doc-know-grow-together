
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnrichedGroupMessage } from '@/lib/auth/utils/types/validation-types';
import { fetchGroupMessages } from '@/lib/utils/message-utils';

export const useGroupChat = (groupId: string) => {
  const [messages, setMessages] = useState<EnrichedGroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = async () => {
    setIsLoading(true);
    const messagesData = await fetchGroupMessages(groupId);
    setMessages(messagesData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!groupId) return;
    
    loadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('group_messages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`
        }, 
        async (payload) => {
          // Handle different types of events
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as any;
            
            // Fetch sender info
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name, profile_image')
              .eq('id', newMessage.user_id)
              .single();
              
            const enrichedMessage = {
              ...newMessage,
              sender_name: profileData?.display_name || 'Unknown User',
              sender_avatar: profileData?.profile_image || ''
            } as EnrichedGroupMessage;
            
            setMessages(prevMessages => [...prevMessages, enrichedMessage]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as any;
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === updatedMessage.id ? { ...msg, content: updatedMessage.content, updated_at: updatedMessage.created_at } : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as any;
            setMessages(prevMessages => 
              prevMessages.filter(msg => msg.id !== deletedMessage.id)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  return { messages, isLoading, reloadMessages: loadMessages };
};
