
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { sendGroupMessage } from '@/lib/utils/message-utils';

interface MessageInputProps {
  userId: string | undefined;
  groupId: string;
  onMessageSent: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ userId, groupId, onMessageSent }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    
    const success = await sendGroupMessage(newMessage, userId, groupId);
    if (success) {
      setNewMessage('');
      onMessageSent();
    }
  };

  return (
    <div className="relative">
      <textarea
        className="w-full border rounded-md py-2 px-4 pr-12 resize-none"
        placeholder="Écrivez votre message..."
        rows={2}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button 
        className="absolute bottom-2 right-2 h-8 w-8 p-0"
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
      >
        <Send size={16} />
      </Button>
    </div>
  );
};

export default MessageInput;
