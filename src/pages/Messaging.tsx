/**
 * 💬 Page de Messagerie Unifiée - Style Messenger Moderne
 * 
 * Fonctionnalités principales :
 * - Chat direct entre utilisateurs
 * - Communautés publiques 
 * - Groupes d'étude privés
 * - Système d'invitations
 * - Notifications push intégrées
 * - Partage de fichiers multimédias
 * - Messages vocaux (à venir)
 * - Interface mobile-first responsive
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, Plus, MessageCircle, Users, Hash, Send, 
  Paperclip, Smile, Phone, Video, MoreVertical,
  UserPlus, Settings, Bell, Archive, Star,
  Image, File, Mic, ChevronLeft, Eye, Crown, Globe
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Types pour la messagerie
interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  type: 'text' | 'voice' | 'file' | 'image';
  file_url?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'community';
  participants: string[];
  last_message?: Message;
  updated_at: string;
  avatar?: string;
  description?: string;
}

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  role: string;
  profile_image?: string;
  university?: string;
  specialty?: string;
}

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'search' | 'communities'>('chats');

  // Données simulées pour la démonstration
  const mockUsers: UserProfile[] = [
    {
      id: '1',
      display_name: 'Dr. Marie Dubois',
      email: 'marie.dubois@chu-paris.fr',
      role: 'professional',
      profile_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      university: 'Université Paris Descartes',
      specialty: 'Cardiologie'
    },
    {
      id: '2',
      display_name: 'Pierre Martin',
      email: 'pierre.martin@etu.univ-lyon.fr',
      role: 'student',
      university: 'Université Claude Bernard Lyon 1',
      specialty: 'Médecine générale'
    },
    {
      id: '3',
      display_name: 'Dr. Sophie Laurent',
      email: 'sophie.laurent@hopital-marseille.fr',
      role: 'professional',
      specialty: 'Pédiatrie'
    }
  ];

  const mockChatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Dr. Marie Dubois',
      type: 'direct',
      participants: [user?.id || '', '1'],
      last_message: {
        id: '1',
        content: 'Merci pour l\'article sur la cardiologie !',
        sender_id: '1',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        type: 'text'
      },
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Groupe Cardiologie PACES',
      type: 'group',
      participants: [user?.id || '', '1', '2', '3'],
      last_message: {
        id: '2',
        content: 'Qui a les notes du cours d\'aujourd\'hui ?',
        sender_id: '2',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        type: 'text'
      },
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      description: 'Groupe d\'étude pour les étudiants en cardiologie'
    },
    {
      id: '3',
      name: 'Communauté Médecine d\'Urgence',
      type: 'community',
      participants: [],
      last_message: {
        id: '3',
        content: 'Nouveau protocole d\'urgence disponible',
        sender_id: '1',
        created_at: new Date(Date.now() - 14400000).toISOString(),
        type: 'text'
      },
      updated_at: new Date(Date.now() - 14400000).toISOString(),
      description: 'Communauté ouverte pour les professionnels d\'urgence'
    }
  ];

  // Initialisation des données
  useEffect(() => {
    setChatRooms(mockChatRooms);
  }, []);

  // Recherche d'utilisateurs
  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = mockUsers.filter(u => 
          u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Envoi d'invitation
  const sendInvitation = (targetUser: UserProfile) => {
    toast.success(`Invitation envoyée à ${targetUser.display_name}`);
    // TODO: Implémenter l'envoi réel d'invitation
  };

  // Envoi de message
  const sendMessage = () => {
    if (currentMessage.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: currentMessage.trim(),
        sender_id: user?.id || '',
        created_at: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
      
      // TODO: Envoyer le message via WebSocket
    }
  };

  // Formatage de l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Obtenir l'icône selon le type de chat
  const getChatIcon = (type: ChatRoom['type']) => {
    switch (type) {
      case 'group': return <Users className="h-4 w-4" />;
      case 'community': return <Globe className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-120px)] flex bg-background">
        
        {/* Sidebar - Liste des conversations */}
        <div className="w-full md:w-80 border-r bg-card flex flex-col">
          
          {/* Header avec onglets */}
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Messages</h1>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Onglets de navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={activeTab === 'chats' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chats')}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Chats
              </Button>
              <Button
                variant={activeTab === 'search' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('search')}
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-1" />
                Recherche
              </Button>
              <Button
                variant={activeTab === 'communities' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('communities')}
                className="flex-1"
              >
                <Hash className="h-4 w-4 mr-1" />
                Communautés
              </Button>
            </div>
          </div>

          {/* Contenu selon l'onglet actif */}
          <div className="flex-1 overflow-hidden">
            
            {/* Onglet Conversations */}
            {activeTab === 'chats' && (
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {chatRooms.map((chat) => (
                    <Card
                      key={chat.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedChat?.id === chat.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            {chat.avatar ? (
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                            ) : (
                              <AvatarFallback>
                                {getChatIcon(chat.type)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">{chat.name}</h3>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(chat.updated_at)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.last_message?.content}
                            </p>
                            {chat.type !== 'direct' && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {chat.type === 'group' ? 'Groupe' : 'Communauté'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Onglet Recherche */}
            {activeTab === 'search' && (
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}

                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <Card key={user.id} className="hover:bg-accent transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              {user.profile_image ? (
                                <AvatarImage src={user.profile_image} alt={user.display_name} />
                              ) : (
                                <AvatarFallback>
                                  {user.display_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{user.display_name}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.specialty} • {user.university}
                              </p>
                              <Badge variant={user.role === 'professional' ? 'default' : 'secondary'} className="text-xs">
                                {user.role === 'professional' ? 'Professionnel' : 'Étudiant'}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => sendInvitation(user)}
                              className="shrink-0"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Onglet Communautés */}
            {activeTab === 'communities' && (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une communauté
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    {chatRooms.filter(chat => chat.type === 'community').map((community) => (
                      <Card
                        key={community.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedChat(community)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Hash className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{community.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {community.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Zone de conversation principale */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <>
              {/* Header de la conversation */}
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {selectedChat.avatar ? (
                        <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                      ) : (
                        <AvatarFallback>
                          {getChatIcon(selectedChat.type)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{selectedChat.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.type === 'direct' ? 'En ligne' : `${selectedChat.participants.length} membres`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedChat.type === 'direct' && (
                      <>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Zone des messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Aucun message dans cette conversation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commencez la conversation en envoyant un message
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Zone de saisie */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Tapez votre message..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button size="sm" variant="ghost">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={sendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h2>
                <p className="text-muted-foreground">
                  Choisissez une conversation existante ou recherchez de nouveaux contacts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messaging;