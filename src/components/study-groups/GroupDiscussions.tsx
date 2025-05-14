
import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGroupChat } from '@/hooks/useGroupChat';
import MessageItem from './components/MessageItem';
import MessageInput from './components/MessageInput';

type GroupDiscussionsProps = {
  groupId: string;
  userRole: string;
};

const GroupDiscussions: React.FC<GroupDiscussionsProps> = ({ groupId, userRole }) => {
  const { user } = useAuth();
  const { messages, isLoading, reloadMessages } = useGroupChat(groupId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const canModerate = userRole === 'admin' || userRole === 'moderator';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion du groupe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[600px]">
          <div className="flex-grow overflow-y-auto mb-4 p-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    currentUserId={user?.id}
                    canModerate={canModerate}
                    onMessageUpdate={reloadMessages}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-2">Aucun message dans cette discussion</p>
                <p className="text-sm text-gray-400">Soyez le premier à écrire !</p>
              </div>
            )}
          </div>
          
          <MessageInput 
            userId={user?.id} 
            groupId={groupId} 
            onMessageSent={reloadMessages}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDiscussions;
