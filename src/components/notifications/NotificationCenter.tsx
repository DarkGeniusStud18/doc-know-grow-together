/**
 * 🔔 Centre de Notifications - Push Notifications System
 * Gestion complète des notifications push (web, PWA, mobile)
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { 
  Bell, 
  MessageSquare, 
  Users, 
  Calendar, 
  BookOpen,
  Check,
  X,
  Settings,
  Trash2
} from 'lucide-react';

type NotificationType = 'message' | 'invitation' | 'reminder' | 'system' | 'group';

type PushNotification = {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  is_pushed: boolean;
  created_at: string;
  conversation_id?: string;
  message_id?: string;
  invitation_id?: string;
};

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔔 Configuration des notifications push
  const { state: pushState, registerForPushNotifications } = usePushNotifications({
    onTokenReceived: (token) => {
      console.log('🔔 Token push reçu:', token);
      // Sauvegarder le token dans la base de données
      saveDeviceToken(token);
    },
    onNotificationReceived: (notification) => {
      console.log('📩 Notification reçue:', notification);
      // Rafraîchir les notifications
      loadNotifications();
    },
    onError: (error) => {
      console.error('❌ Erreur push notifications:', error);
    }
  });

  // 📱 Chargement initial des notifications
  useEffect(() => {
    if (user) {
      loadNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  /**
   * 📚 Chargement des notifications utilisateur
   */
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('push_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications((data || []).map(n => ({
        ...n,
        type: n.type as NotificationType
      })));
      
      // Calculer le nombre de notifications non lues
      const unread = (data || []).filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📡 Configuration de l'abonnement en temps réel
   */
  const setupRealtimeSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'push_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as PushNotification;
          
          // Ajouter la notification à la liste
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Afficher un toast
          toast.info(newNotification.title, {
            description: newNotification.body
          });
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  /**
   * 💾 Sauvegarde du token de device
   */
  const saveDeviceToken = async (token: string) => {
    if (!user) return;

    try {
      // Note: Cette fonction nécessiterait une table device_tokens
      // Pour l'instant, on log simplement le token
      console.log('💾 Token à sauvegarder:', { user_id: user.id, token });
    } catch (error) {
      console.error('❌ Erreur sauvegarde token:', error);
    }
  };

  /**
   * ✅ Marquer une notification comme lue
   */
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('push_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('❌ Erreur marquage comme lu:', error);
    }
  };

  /**
   * 🗑️ Supprimer une notification
   */
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('push_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
    }
  };

  /**
   * ✅ Marquer toutes comme lues
   */
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('push_notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      console.error('❌ Erreur marquage global:', error);
    }
  };

  /**
   * 🎨 Icône selon le type de notification
   */
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'invitation':
        return <Users className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  /**
   * 🎨 Couleur selon le type de notification
   */
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return 'text-blue-500';
      case 'invitation':
        return 'text-green-500';
      case 'reminder':
        return 'text-orange-500';
      case 'system':
        return 'text-purple-500';
      case 'group':
        return 'text-teal-500';
      default:
        return 'text-gray-500';
    }
  };

  /**
   * 📅 Formatage de la date
   */
  const formatNotificationDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* 🎯 En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default">{unreadCount}</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!pushState.isRegistered && (
            <Button
              variant="outline"
              size="sm"
              onClick={registerForPushNotifications}
            >
              <Bell className="h-4 w-4 mr-2" />
              Activer les notifications
            </Button>
          )}
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* 📊 Statut des notifications push */}
      {pushState.permissionStatus && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${
                  pushState.isRegistered ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm">
                  Notifications push : {pushState.isRegistered ? 'Activées' : 'En attente'}
                </span>
              </div>
              
              {pushState.error && (
                <Badge variant="destructive" className="text-xs">
                  Erreur
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📋 Liste des notifications */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucune notification</p>
              <p>Vous êtes à jour !</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatNotificationDate(notification.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Marquer comme lu"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};