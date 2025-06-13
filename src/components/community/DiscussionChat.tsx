
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

type ChatMessage = {
  id: string;
  user_id: string;
  topic_id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_image?: string;
  author_role?: string;
};

type DiscussionChatProps = {
  topicId: string;
  topicTitle: string;
};

const DiscussionChat: React.FC<DiscussionChatProps> = ({ topicId, topicTitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();
  }, [topicId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      
      const { data: messagesData, error } = await supabase
        .from('community_responses')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrich messages with author info
      const enrichedMessages = await Promise.all(
        (messagesData || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, profile_image, role')
            .eq('id', msg.user_id)
            .single();

          return {
            id: msg.id,
            user_id: msg.user_id,
            topic_id: msg.topic_id,
            content: msg.content,
            created_at: msg.created_at,
            author_name: profile?.display_name || 'Utilisateur',
            author_image: profile?.profile_image,
            author_role: profile?.role
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`discussion_${topicId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'community_responses',
          filter: `topic_id=eq.${topicId}`
        }, 
        async (payload) => {
          const newResponse = payload.new as any;
          
          // Get author info
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, profile_image, role')
            .eq('id', newResponse.user_id)
            .single();

          const enrichedMessage: ChatMessage = {
            id: newResponse.id,
            user_id: newResponse.user_id,
            topic_id: newResponse.topic_id,
            content: newResponse.content,
            created_at: newResponse.created_at,
            author_name: profile?.display_name || 'Utilisateur',
            author_image: profile?.profile_image,
            author_role: profile?.role
          };

          setMessages(prev => [...prev, enrichedMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) {
      return;
    }

    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('community_responses')
        .insert({
          topic_id: topicId,
          user_id: user.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          💬 Discussion: {topicTitle}
          <Badge variant="outline">{messages.length} messages</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Aucun message dans cette discussion</p>
              <p className="text-sm">Soyez le premier à écrire !</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.author_image || ''} alt={message.author_name} />
                  <AvatarFallback>
                    {message.author_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.author_name}</span>
                    {message.author_role === 'professional' && (
                      <Badge variant="secondary" className="text-xs">Médecin</Badge>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Textarea
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={!user || isSending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!user || !newMessage.trim() || isSending}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              Connectez-vous pour participer à la discussion
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionChat;
