/**
 * 📋 Composant Liste des Conversations - Chat System
 * Affichage optimisé et responsive des conversations utilisateur
 */

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Globe } from 'lucide-react';

type ConversationType = 'direct' | 'study_group' | 'community';

type Conversation = {
  id: string;
  name: string;
  type: ConversationType;
  description?: string;
  avatar_url?: string;
  last_message_at: string;
  last_message?: string;
  unread_count?: number;
  participant_count?: number;
};

interface ChatConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
}

export const ChatConversationList: React.FC<ChatConversationListProps> = ({
  conversations,
  activeConversation,
  onConversationSelect
}) => {
  /**
   * 🎨 Rendu de l'icône selon le type de conversation
   */
  const renderConversationIcon = (type: ConversationType) => {
    switch (type) {
      case 'direct':
        return <MessageCircle className="h-6 w-6" />;
      case 'study_group':
        return <Users className="h-6 w-6" />;
      case 'community':
        return <Globe className="h-6 w-6" />;
      default:
        return <MessageCircle className="h-6 w-6" />;
    }
  };

  /**
   * 🏷️ Libellé du type de conversation
   */
  const getTypeLabel = (type: ConversationType) => {
    switch (type) {
      case 'direct':
        return 'Privé';
      case 'study_group':
        return 'Groupe';
      case 'community':
        return 'Communauté';
      default:
        return 'Chat';
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Aucune conversation</p>
        <p className="text-sm">Créez votre première conversation !</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onConversationSelect(conversation)}
          className={`p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors ${
            activeConversation?.id === conversation.id 
              ? 'bg-primary/10 border-l-4 border-l-primary' 
              : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={conversation.avatar_url} alt={conversation.name} />
              <AvatarFallback>
                {renderConversationIcon(conversation.type)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate text-sm">
                  {conversation.name}
                </h3>
                {conversation.unread_count && conversation.unread_count > 0 && (
                  <Badge variant="default" className="text-xs">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground truncate mb-2">
                {conversation.last_message || 'Aucun message'}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(conversation.type)}
                </Badge>
                {conversation.participant_count && (
                  <span className="text-xs text-muted-foreground">
                    {conversation.participant_count} membre{conversation.participant_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};