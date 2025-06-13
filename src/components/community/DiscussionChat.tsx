
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, MessageCircle, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_image?: string;
  author_role?: string;
}

interface DiscussionChatProps {
  topicId: string;
  topicTitle: string;
}

const DiscussionChat: React.FC<DiscussionChatProps> = ({ topicId, topicTitle }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch chat messages - using community_responses as chat messages for now
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chatMessages', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_responses')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Enrich with author data
      const enrichedMessages = await Promise.all(data.map(async (message) => {
        const { data: authorData } = await supabase
          .from('profiles')
          .select('display_name, profile_image, role')
          .eq('id', message.user_id)
          .single();
          
        return {
          id: message.id,
          topic_id: message.topic_id,
          user_id: message.user_id,
          content: message.content,
          created_at: message.created_at,
          author_name: authorData?.display_name || 'Utilisateur',
          author_image: authorData?.profile_image,
          author_role: authorData?.role
        } as ChatMessage;
      }));
      
      return enrichedMessages;
    },
    enabled: !!topicId,
    refetchInterval: 3000 // Poll every 3 seconds for new messages
  });

  // Send message mutation - using community_responses table
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Non authentifié');
      
      const { data, error } = await supabase
        .from('community_responses')
        .insert({
          topic_id: topicId,
          user_id: user.id,
          content
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['chatMessages', topicId] });
      scrollToBottom();
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${topicId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_responses',
          filter: `topic_id=eq.${topicId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chatMessages', topicId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer des messages');
      return;
    }
    
    sendMessageMutation.mutate(newMessage);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-medical-blue" />
          Chat en Direct
          <Badge variant="outline" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            {Math.floor(Math.random() * 12) + 3} en ligne
          </Badge>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Container */}
        <div className="h-80 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-sm text-gray-500">Chargement des messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Aucun message dans ce chat</p>
              <p className="text-xs">Soyez le premier à démarrer la conversation !</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.author_image || '/placeholder.svg'} />
                  <AvatarFallback className="text-xs">
                    {message.author_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.author_name}</span>
                    {message.author_role === 'professional' && (
                      <Badge variant="secondary" className="text-xs">Médecin</Badge>
                    )}
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getMessageTime(message.created_at)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm border text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={!user || sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {!user && (
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Vous devez être connecté pour participer au chat
            </p>
          </div>
        )}

        {isTyping && (
          <div className="text-xs text-gray-500 italic">
            Quelqu'un est en train d'écrire...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscussionChat;
