
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock } from 'lucide-react';
import { EnrichedGroupMessage } from '@/lib/auth/utils/types/validation-types';
import { formatMessageDate, updateGroupMessage, deleteGroupMessage } from '@/lib/utils/message-utils';

interface MessageItemProps {
  message: EnrichedGroupMessage;
  currentUserId: string | undefined;
  canModerate: boolean;
  onMessageUpdate: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  currentUserId, 
  canModerate,
  onMessageUpdate
}) => {
  const [editingMessage, setEditingMessage] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(message.content);
  const isCurrentUserMessage = message.user_id === currentUserId;

  const handleUpdateMessage = async () => {
    if (!editContent.trim() || !currentUserId) return;
    
    const success = await updateGroupMessage(message.id, editContent, currentUserId);
    if (success) {
      setEditingMessage(false);
      onMessageUpdate();
    }
  };

  const handleDeleteMessage = async () => {
    if (!currentUserId) return;
    
    const success = await deleteGroupMessage(message.id, currentUserId);
    if (success) {
      onMessageUpdate();
    }
  };

  return (
    <div className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`flex max-w-[80%] ${
          isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <Avatar className={`h-8 w-8 ${isCurrentUserMessage ? 'ml-2' : 'mr-2'}`}>
          <AvatarImage src={message.sender_avatar} />
          <AvatarFallback className="bg-medical-teal text-white text-xs">
            {message.sender_name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div 
            className={`rounded-lg p-3 text-sm ${
              isCurrentUserMessage 
                ? 'bg-medical-teal text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {editingMessage ? (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded border p-2 text-gray-800"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setEditingMessage(false)}
                    className="h-7 text-xs"
                  >
                    Annuler
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleUpdateMessage}
                    className="h-7 text-xs"
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              message.content
            )}
          </div>
          
          <div 
            className={`text-xs text-gray-500 mt-1 flex items-center gap-2 ${
              isCurrentUserMessage ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              {formatMessageDate(message.created_at)}
            </span>
            
            {isCurrentUserMessage && !editingMessage && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingMessage(true);
                    setEditContent(message.content);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={12} />
                </button>
                <button 
                  onClick={handleDeleteMessage}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
            
            {!isCurrentUserMessage && canModerate && (
              <button 
                onClick={handleDeleteMessage}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
