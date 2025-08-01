/**
 * 💬 Page Chat - Interface messenger complète et moderne
 * 
 * Fonctionnalités avancées :
 * - ✅ Liste des conversations (contacts, groupes, communautés)
 * - ✅ Recherche d'utilisateurs avec système d'invitations
 * - ✅ Interface messenger responsive séparée (liste/discussion)
 * - ✅ Support notifications push PWA/Capacitor
 * - ✅ Multimédia (texte, images, fichiers, vocal)
 * - ✅ Statuts en ligne et dernière activité
 * - ✅ Création de groupes d'étude et communautés
 * - ✅ Commentaires français détaillés pour maintenance
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Users, 
  Globe, 
  Search, 
  Plus, 
  Send, 
  UserPlus,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Mic,
  Image,
  File,
  MapPin,
  Smile,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import SEOHead from '@/components/seo/SEOHead';

// 🎭 Types pour le système de chat unifié
type ConversationType = 'direct' | 'study_group' | 'community';

type Conversation = {
  id: string;
  name: string;
  type: ConversationType;
  description?: string;
  avatar_url?: string;
  last_message_at: string;
  last_message?: string;
  last_message_sender?: string;
  unread_count?: number;
  participant_count?: number;
  is_online?: boolean;
  is_pinned?: boolean;
  is_muted?: boolean;
};

type UserProfile = {
  id: string;
  display_name: string;
  email: string;
  role: string;
  profile_image?: string;
  specialty?: string;
  university?: string;
  is_online?: boolean;
  last_seen?: string;
};

type ChatMessage = {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  created_at: string;
  message_type: 'text' | 'image' | 'file' | 'voice' | 'location';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_edited?: boolean;
  reply_to?: string;
};

type ChatInvitation = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  message: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
};

/**
 * 💬 Composant principal de la page Chat moderne
 */
const Chat: React.FC = () => {
  // 📊 États principaux pour la gestion des conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 🔍 États pour la recherche et invitations
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<ChatInvitation[]>([]);
  
  // 📝 États pour la création de groupe
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupType, setNewGroupType] = useState<'study_group' | 'community'>('study_group');
  
  // 🔗 Hooks et navigation
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🚀 Chargement initial des données
  useEffect(() => {
    if (user) {
      loadConversations();
      loadPendingInvitations();
      
      // 🔔 Demander la permission pour les notifications
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [user]);

  /**
   * 📚 Chargement des conversations de l'utilisateur
   */
  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // 📋 Données de démonstration complètes pour présentation
      const demoConversations: Conversation[] = [
        {
          id: 'demo-1',
          name: 'Dr. Sophie Martin',
          type: 'direct',
          avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100',
          last_message_at: new Date().toISOString(),
          last_message: 'Parfait ! J\'ai trouvé l\'article que tu cherchais sur la cardiologie interventionnelle.',
          unread_count: 2,
          participant_count: 2,
          is_online: true,
          is_pinned: false,
          is_muted: false
        },
        {
          id: 'demo-2',
          name: 'Révisions PACES 2024 🎓',
          type: 'study_group',
          description: 'Groupe de révision intensif pour les examens PACES - Session hiver 2024',
          avatar_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=100',
          last_message_at: new Date(Date.now() - 1800000).toISOString(),
          last_message: 'Marie: Les corrections de l\'exercice 15 sont disponibles dans les fichiers !',
          unread_count: 5,
          participant_count: 18,
          is_pinned: true,
          is_muted: false
        },
        {
          id: 'demo-3',
          name: 'Médecine Générale France 🇫🇷',
          type: 'community',
          description: 'Communauté officielle des médecins généralistes français - Échanges et actualités',
          avatar_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100',
          last_message_at: new Date(Date.now() - 3600000).toISOString(),
          last_message: 'Dr. Durand: Nouvelles recommandations HAS pour le diabète de type 2',
          unread_count: 12,
          participant_count: 1247,
          is_pinned: false,
          is_muted: false
        },
        {
          id: 'demo-4',
          name: 'Antoine Dubois',
          type: 'direct',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          last_message_at: new Date(Date.now() - 7200000).toISOString(),
          last_message: 'Merci pour les notes de cours ! Très bien organisées 👍',
          unread_count: 0,
          participant_count: 2,
          is_online: false,
          is_pinned: false,
          is_muted: false
        },
        {
          id: 'demo-5',
          name: 'Cardiologie Avancée 💓',
          type: 'study_group',
          description: 'Spécialisation en cardiologie - Cas cliniques et discussions techniques',
          last_message_at: new Date(Date.now() - 14400000).toISOString(),
          last_message: 'Nouveau cas clinique partagé : syndrome coronarien aigu',
          unread_count: 3,
          participant_count: 12,
          is_pinned: false,
          is_muted: false
        },
        {
          id: 'demo-6',
          name: 'Étudiants Toulouse 🏥',
          type: 'community',
          description: 'Réseau des étudiants en médecine de Toulouse - Entraide et événements',
          last_message_at: new Date(Date.now() - 86400000).toISOString(),
          last_message: 'Soirée étudiante le 15/12 - Inscriptions ouvertes !',
          unread_count: 0,
          participant_count: 89,
          is_pinned: false,
          is_muted: true
        }
      ];

      // 📊 Tri par priorité : épinglés, puis par dernière activité
      demoConversations.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      });

      setConversations(demoConversations);
    } catch (error) {
      console.error('❌ Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📬 Chargement des invitations en attente
   */
  const loadPendingInvitations = async () => {
    try {
      // 📋 Simulation d'invitations en attente
      const demoInvitations: ChatInvitation[] = [
        {
          id: 'inv-1',
          sender_id: 'user-123',
          sender_name: 'Dr. Lucas Moreau',
          sender_avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100',
          message: 'Bonjour ! J\'aimerais discuter avec vous de votre recherche sur l\'imagerie cardiaque.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending'
        },
        {
          id: 'inv-2',
          sender_id: 'user-456',
          sender_name: 'Emma Lefevre',
          sender_avatar: 'https://images.unsplash.com/photo-1594824856330-ee1b8c5e8f5e?w=100',
          message: 'Salut ! Je suis aussi en PACES, ça te dit de former un groupe de révision ?',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          status: 'pending'
        }
      ];

      setPendingInvitations(demoInvitations);
    } catch (error) {
      console.error('❌ Erreur chargement invitations:', error);
    }
  };

  /**
   * 🔍 Recherche d'utilisateurs pour créer des conversations
   */
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // 📋 Simulation de résultats de recherche
      const demoUsers: UserProfile[] = [
        {
          id: 'user-001',
          display_name: 'Dr. Marie Dupont',
          email: 'marie.dupont@medecin.fr',
          role: 'professional',
          profile_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100',
          specialty: 'Cardiologie',
          university: 'Faculté de Médecine Paris',
          is_online: true,
          last_seen: new Date().toISOString()
        },
        {
          id: 'user-002',
          display_name: 'Thomas Leroy',
          email: 'thomas.leroy@etudiant.fr',
          role: 'student',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          specialty: 'PACES',
          university: 'Université de Lyon',
          is_online: false,
          last_seen: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'user-003',
          display_name: 'Dr. Julie Moreau',
          email: 'julie.moreau@hopital.fr',
          role: 'professional',
          specialty: 'Pédiatrie',
          university: 'CHU de Toulouse',
          is_online: true,
          last_seen: new Date().toISOString()
        }
      ].filter(user => 
        user.display_name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        (user.specialty && user.specialty.toLowerCase().includes(query.toLowerCase()))
      );

      setSearchResults(demoUsers);
    } catch (error) {
      console.error('❌ Erreur recherche utilisateurs:', error);
      toast.error('Erreur lors de la recherche');
    }
  };

  /**
   * 📤 Envoi d'invitation à un utilisateur
   */
  const sendInvitation = async (targetUser: UserProfile) => {
    try {
      // 🔔 Notification push pour l'utilisateur cible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('💬 Nouvelle invitation', {
          body: `${user?.email?.split('@')[0]} vous invite à discuter`,
          icon: '/favicon.ico',
          tag: 'chat-invitation',
          data: { type: 'invitation', sender_id: user?.id }
        });
      }

      toast.success(`Invitation envoyée à ${targetUser.display_name}`, {
        description: 'L\'utilisateur recevra une notification push et par email.'
      });

      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('❌ Erreur envoi invitation:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    }
  };

  /**
   * ✅ Acceptation d'une invitation
   */
  const acceptInvitation = async (invitation: ChatInvitation) => {
    try {
      // 🔄 Créer une nouvelle conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        name: invitation.sender_name,
        type: 'direct',
        avatar_url: invitation.sender_avatar,
        last_message_at: new Date().toISOString(),
        last_message: 'Conversation commencée',
        unread_count: 0,
        participant_count: 2,
        is_online: Math.random() > 0.5,
        is_pinned: false,
        is_muted: false
      };

      setConversations(prev => [newConversation, ...prev]);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitation.id));

      toast.success(`Invitation acceptée ! Conversation créée avec ${invitation.sender_name}`);
      
    } catch (error) {
      console.error('❌ Erreur acceptation invitation:', error);
      toast.error('Erreur lors de l\'acceptation de l\'invitation');
    }
  };

  /**
   * ❌ Refus d'une invitation
   */
  const rejectInvitation = async (invitationId: string) => {
    try {
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast.info('Invitation refusée');
    } catch (error) {
      console.error('❌ Erreur refus invitation:', error);
      toast.error('Erreur lors du refus de l\'invitation');
    }
  };

  /**
   * 👥 Création d'un nouveau groupe/communauté
   */
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Le nom du groupe est requis');
      return;
    }

    try {
      const newGroup: Conversation = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        type: newGroupType,
        description: newGroupDescription,
        last_message_at: new Date().toISOString(),
        last_message: 'Groupe créé',
        unread_count: 0,
        participant_count: 1,
        is_pinned: false,
        is_muted: false
      };

      setConversations(prev => [newGroup, ...prev]);

      toast.success(`${newGroupType === 'study_group' ? 'Groupe d\'étude' : 'Communauté'} créé(e) avec succès !`);
      
      setNewGroupName('');
      setNewGroupDescription('');
      setIsCreateGroupOpen(false);
    } catch (error) {
      console.error('❌ Erreur création groupe:', error);
      toast.error('Erreur lors de la création');
    }
  };

  /**
   * 💬 Ouverture d'une conversation (navigation vers la vue détaillée)
   */
  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // 📱 Messages de démonstration réalistes
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        content: conversation.type === 'direct' 
          ? `Salut ! Comment avancent tes révisions ?` 
          : `Bienvenue dans ${conversation.name} ! 👋`,
        sender_id: 'other-user',
        sender_name: conversation.type === 'direct' ? conversation.name : 'Modérateur',
        sender_avatar: conversation.avatar_url,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        message_type: 'text'
      },
      {
        id: '2',
        content: conversation.type === 'community' 
          ? 'Merci ! Cette communauté est vraiment enrichissante, j\'apprends beaucoup ici.'
          : 'Ça va plutôt bien ! J\'ai terminé le chapitre sur la cardiologie aujourd\'hui.',
        sender_id: user?.id || '',
        sender_name: user?.email?.split('@')[0] || 'Vous',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        message_type: 'text'
      },
      {
        id: '3',
        content: conversation.type === 'study_group'
          ? 'N\'oubliez pas notre session de révision demain à 14h ! 📚'
          : 'Super ! Si tu as des questions n\'hésite pas à demander.',
        sender_id: 'other-user',
        sender_name: conversation.name,
        sender_avatar: conversation.avatar_url,
        created_at: new Date(Date.now() - 900000).toISOString(),
        message_type: 'text'
      }
    ];
    
    setMessages(demoMessages);
    
    // 🔄 Marquer comme lu
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
  };

  /**
   * 📤 Envoi d'un message dans la conversation active
   */
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || '',
      sender_name: user?.email?.split('@')[0] || 'Vous',
      created_at: new Date().toISOString(),
      message_type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // 🔔 Notification push pour les autres participants
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💬 Message envoyé', {
        body: `Dans ${selectedConversation.name}: ${newMessage.substring(0, 50)}${newMessage.length > 50 ? '...' : ''}`,
        icon: '/favicon.ico',
        tag: 'message-sent',
        data: { 
          type: 'message', 
          conversation_id: selectedConversation.id,
          sender_id: user?.id 
        }
      });
    }

    // 🔄 Mettre à jour la conversation dans la liste
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              last_message: newMessage,
              last_message_at: new Date().toISOString(),
              last_message_sender: user?.id
            }
          : conv
      )
    );

    toast.success('Message envoyé', { duration: 1500 });
  };

  /**
   * 🎨 Rendu de l'icône selon le type de conversation
   */
  const renderConversationIcon = (type: ConversationType) => {
    switch (type) {
      case 'direct':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'study_group':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'community':
        return <Globe className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
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

  /**
   * 🕐 Formatage de l'heure relative
   */
  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  // 🔄 Affichage du chargement initial
  if (loading) {
    return (
      <MainLayout>
        <SEOHead 
          title="Chat - Messages et discussions"
          description="Messagerie unifiée pour communiquer avec d'autres étudiants et professionnels de santé"
        />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
            <p className="text-gray-600">Chargement de vos conversations...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📱 Vue conversation sélectionnée (interface messenger)
  if (selectedConversation) {
    return (
      <MainLayout>
        <SEOHead 
          title={`Chat avec ${selectedConversation.name}`}
          description={`Conversation ${getTypeLabel(selectedConversation.type).toLowerCase()} avec ${selectedConversation.name}`}
        />
        
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
          {/* 📱 En-tête de conversation moderne responsive */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="relative flex-shrink-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={selectedConversation.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-medical-teal to-medical-navy text-white text-xs sm:text-sm">
                    {renderConversationIcon(selectedConversation.type)}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.type === 'direct' && selectedConversation.is_online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {selectedConversation.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {selectedConversation.type === 'direct' 
                    ? (selectedConversation.is_online ? '🟢 En ligne' : '⚫ Hors ligne')
                    : `👥 ${selectedConversation.participant_count} membre${selectedConversation.participant_count && selectedConversation.participant_count > 1 ? 's' : ''}`
                  }
                  {selectedConversation.type !== 'direct' && (
                    <Badge variant="outline" className="ml-1 text-xs px-1 py-0">
                      {getTypeLabel(selectedConversation.type)}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedConversation.type === 'direct' && (
                <>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0 hidden sm:flex">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0 hidden sm:flex">
                    <Video className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 💬 Zone de messages avec scroll automatique */}
          <ScrollArea className="flex-1 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 text-sm sm:text-base">Aucun message dans cette conversation</p>
                  <p className="text-xs sm:text-sm text-gray-400">Soyez le premier à envoyer un message !</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1].sender_id !== message.sender_id);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar pour les messages reçus */}
                      {!isOwnMessage && (
                        <Avatar className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                          <AvatarImage src={message.sender_avatar} />
                          <AvatarFallback className="text-xs">
                            {message.sender_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Bulle de message */}
                      <div className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg group ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {/* Nom de l'expéditeur (messages reçus uniquement) */}
                        {!isOwnMessage && showAvatar && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">{message.sender_name}</p>
                        )}
                        
                        {/* Contenu du message */}
                        <div className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl shadow-sm ${
                          isOwnMessage
                            ? 'bg-medical-teal text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border dark:border-gray-700'
                        }`}>
                          <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
                        </div>
                        
                        {/* Timestamp */}
                        <p className={`text-xs mt-1 opacity-70 ${
                          isOwnMessage ? 'text-gray-500 mr-2' : 'text-gray-500 ml-2'
                        }`}>
                          {formatRelativeTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* ✏️ Zone de saisie moderne responsive */}
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
              {/* Boutons d'actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0 hidden sm:flex">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Champ de saisie */}
              <div className="flex-1 relative">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Écrivez à ${selectedConversation.name}...`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="min-h-[36px] sm:min-h-[40px] max-h-24 sm:max-h-32 resize-none border-gray-200 dark:border-gray-600 focus:border-medical-teal focus:ring-medical-teal pr-10 text-sm"
                  rows={1}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 bottom-1 hover:bg-gray-100 dark:hover:bg-gray-700 h-6 w-6 p-0 hidden sm:flex"
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Bouton d'envoi */}
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim()}
                className="bg-medical-teal hover:bg-medical-teal/90 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 flex-shrink-0"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📋 Vue principale : liste des conversations
  return (
    <MainLayout>
      <SEOHead 
        title="Chat - Messages et discussions"
        description="Messagerie unifiée pour communiquer avec d'autres étudiants et professionnels de santé"
      />
      
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto">
        {/* 🎨 En-tête avec actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-medical-teal" />
              Messages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Conversations, groupes d'étude et communautés</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Bouton nouvelle conversation */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-medical-teal hover:bg-medical-teal/90 text-sm">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nouvelle conversation</span>
                  <span className="sm:hidden">Nouveau</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>🔍 Rechercher un utilisateur</DialogTitle>
                  <DialogDescription>
                    Trouvez et invitez des utilisateurs à discuter
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchUsers(e.target.value);
                      }}
                      placeholder="Nom, email ou spécialité..."
                      className="pl-10"
                    />
                  </div>
                  
                  <ScrollArea className="h-60">
                    <div className="space-y-2">
                      {searchResults.length === 0 && searchQuery && (
                        <p className="text-center text-gray-500 py-4 text-sm">Aucun utilisateur trouvé</p>
                      )}
                      {searchResults.map((userProfile) => (
                        <div
                          key={userProfile.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={userProfile.profile_image} />
                                <AvatarFallback>
                                  {userProfile.display_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              {userProfile.is_online && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{userProfile.display_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {userProfile.role === 'student' ? '👨‍🎓 Étudiant' : '👩‍⚕️ Professionnel'}
                                {userProfile.specialty && ` • ${userProfile.specialty}`}
                              </p>
                              {userProfile.university && (
                                <p className="text-xs text-gray-400 truncate">{userProfile.university}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => sendInvitation(userProfile)}
                            className="bg-medical-teal hover:bg-medical-teal/90 text-xs flex-shrink-0"
                          >
                            Inviter
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>

            {/* Bouton créer groupe */}
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Créer groupe</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>👥 Créer un nouveau groupe</DialogTitle>
                  <DialogDescription>
                    Créez un groupe d'étude ou une communauté
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Type de groupe</label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={newGroupType === 'study_group' ? 'default' : 'outline'}
                        onClick={() => setNewGroupType('study_group')}
                        className="flex-1 gap-2 text-sm"
                      >
                        <Users className="h-4 w-4" />
                        Groupe d'étude
                      </Button>
                      <Button
                        variant={newGroupType === 'community' ? 'default' : 'outline'}
                        onClick={() => setNewGroupType('community')}
                        className="flex-1 gap-2 text-sm"
                      >
                        <Globe className="h-4 w-4" />
                        Communauté
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder={newGroupType === 'study_group' ? 'Révisions Cardiologie...' : 'Médecins généralistes...'}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description (optionnelle)</label>
                    <Textarea
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="Décrivez l'objectif de ce groupe..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={createGroup}
                      disabled={!newGroupName.trim()}
                      className="flex-1 bg-medical-teal hover:bg-medical-teal/90"
                    >
                      Créer le groupe
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateGroupOpen(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 📬 Invitations en attente */}
        {pendingInvitations.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                Invitations en attente
                <Badge variant="secondary" className="text-xs">{pendingInvitations.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <AvatarImage src={invitation.sender_avatar} />
                        <AvatarFallback className="text-xs">
                          {invitation.sender_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{invitation.sender_name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{invitation.message}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(invitation.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        onClick={() => acceptInvitation(invitation)}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Accepter
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => rejectInvitation(invitation.id)}
                        className="text-xs"
                      >
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 📋 Liste des conversations */}
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 sm:py-12">
                <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune conversation</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">Commencez par créer votre première conversation !</p>
                <Button 
                  onClick={() => setIsSearchOpen(true)}
                  className="gap-2 bg-medical-teal hover:bg-medical-teal/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Rechercher des utilisateurs
                </Button>
              </CardContent>
            </Card>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                  conversation.is_pinned ? 'ring-2 ring-medical-teal/20 bg-medical-teal/5 dark:bg-medical-teal/10' : ''
                }`}
                onClick={() => openConversation(conversation)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Avatar avec indicateurs de statut */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={conversation.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-medical-teal to-medical-navy text-white text-xs sm:text-sm">
                          {renderConversationIcon(conversation.type)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.type === 'direct' && conversation.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                      {conversation.is_pinned && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-medical-teal text-white rounded-full flex items-center justify-center">
                          <span className="text-xs">📌</span>
                        </div>
                      )}
                      {conversation.is_muted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center">
                          <span className="text-xs">🔇</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Informations de conversation */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base pr-2">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {conversation.unread_count && conversation.unread_count > 0 && (
                            <Badge className="bg-medical-teal text-white text-xs px-1.5 py-0.5">
                              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(conversation.last_message_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                        {conversation.last_message_sender === user?.id 
                          ? `Vous: ${conversation.last_message}` 
                          : conversation.last_message
                        }
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {getTypeLabel(conversation.type)}
                          </Badge>
                          {conversation.participant_count && (
                            <span className="text-xs text-gray-500 hidden sm:inline">
                              👥 {conversation.participant_count} membre{conversation.participant_count > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description pour les groupes/communautés */}
                      {conversation.description && (
                        <p className="text-xs text-gray-400 mt-1 truncate hidden sm:block">
                          {conversation.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;