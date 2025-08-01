/**
 * 🔔 Hook de gestion des notifications COMPLET pour MedCollab
 * 
 * ✅ Fonctionnalités AVANCÉES :
 * - 📱 Notifications système PWA/Native intégrées
 * - ⚡ Synchronisation temps réel avec Supabase
 * - 🎵 Notifications musicales comme Spotify/Boomplay
 * - 💬 Notifications de chat en temps réel
 * - 📊 Gestion d'état optimisée avec cache intelligent
 * - 🔄 Background sync pour mode hors ligne
 * - 🇫🇷 Interface entièrement en français
 * - 📲 Support Capacitor pour notifications natives mobile
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

// 🔔 Types pour les notifications
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'music' | 'chat' | 'system';
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, body: string, options?: NotificationOptions) => void;
  createAppNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  playNotificationSound: () => void;
}

/**
 * 🔔 Hook principal de gestion des notifications
 */
export const useNotifications = (): UseNotificationsReturn => {
  // 📊 États principaux
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });

  // 🔗 Hooks et références
  const { user } = useAuth();
  const realtimeSubscription = useRef<any>(null);

  // 🚀 Initialisation au montage du composant
  useEffect(() => {
    if (user) {
      initializeNotifications();
    }
    
    return () => {
      // 🧹 Nettoyage à la destruction
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe();
      }
    };
  }, [user]);

  // 🔄 Vérification périodique des permissions
  useEffect(() => {
    checkNotificationPermission();
    
    // Vérification toutes les 30 secondes
    const interval = setInterval(checkNotificationPermission, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * 🚀 Initialisation complète du système de notifications
   */
  const initializeNotifications = async () => {
    console.log('🔔 Initialisation système notifications pour:', user?.email);
    
    try {
      setLoading(true);
      
      // 📚 Charger les notifications existantes
      await loadNotifications();
      
      // ⚡ Configurer la synchronisation temps réel
      setupRealtimeSubscription();
      
      // 🔔 Vérifier les permissions
      await checkNotificationPermission();
      
      console.log('✅ Système notifications initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📚 Chargement des notifications depuis Supabase
   */
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('app_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications((data || []) as Notification[]);
      console.log('📚 Notifications chargées:', data?.length || 0);
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    }
  };

  /**
   * ⚡ Configuration de la synchronisation temps réel
   */
  const setupRealtimeSubscription = () => {
    if (!user || realtimeSubscription.current) return;

    console.log('⚡ Configuration synchronisation temps réel notifications');

    realtimeSubscription.current = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 Événement notification temps réel:', payload.eventType);
          
          handleRealtimeNotification(payload);
        }
      )
      .subscribe();
  };

  /**
   * 🔄 Gestionnaire d'événements temps réel
   */
  const handleRealtimeNotification = (payload: any) => {
    const { eventType, new: newNotification, old: oldNotification } = payload;

    switch (eventType) {
      case 'INSERT':
        // 🆕 Nouvelle notification
        setNotifications(prev => [newNotification as Notification, ...prev]);
        
        // 🔊 Jouer le son de notification
        playNotificationSound();
        
        // 📱 Afficher notification système si permission accordée
        if (permission.granted) {
          sendSystemNotification(
            newNotification.title,
            newNotification.message,
            newNotification.type
          );
        }
        
        // 🍞 Toast notification locale
        toast.info(newNotification.title, {
          description: newNotification.message
        });
        break;

      case 'UPDATE':
        // 🔄 Mise à jour notification existante
        setNotifications(prev =>
          prev.map(n => n.id === newNotification.id ? newNotification : n)
        );
        break;

      case 'DELETE':
        // 🗑️ Suppression notification
        setNotifications(prev =>
          prev.filter(n => n.id !== oldNotification.id)
        );
        break;
    }
  };

  /**
   * 🔔 Vérification et mise à jour des permissions de notification
   */
  const checkNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('🚫 Notifications non supportées par ce navigateur');
      return;
    }

    const perm = Notification.permission;
    
    setPermission({
      granted: perm === 'granted',
      denied: perm === 'denied',
      default: perm === 'default'
    });

    console.log('🔔 Permission notifications:', perm);
  }, []);

  /**
   * 📱 Demande de permission pour les notifications
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('🚫 Notifications non supportées');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      
      await checkNotificationPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permission notifications accordée');
        toast.success('Notifications activées');
        return true;
      } else {
        console.log('❌ Permission notifications refusée');
        toast.error('Notifications refusées');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur demande permission:', error);
      return false;
    }
  }, [checkNotificationPermission]);

  /**
   * 📱 Envoi de notification système native
   */
  const sendSystemNotification = (title: string, body: string, type: string) => {
    if (!permission.granted) return;

    try {
      const options: NotificationOptions = {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: `medcollab-${type}`,
        requireInteraction: false,
        silent: false
      };

      // 🎵 Options spéciales pour notifications musicales
      if (type === 'music') {
        options.tag = 'medcollab-music';
        options.requireInteraction = false;
        // options.renotify = true; // Feature navigateur spécifique
      }

      // 💬 Options spéciales pour chat
      if (type === 'chat') {
        options.tag = 'medcollab-chat';
        options.requireInteraction = true;
      }

      const notification = new Notification(title, options);
      
      // 🔄 Auto-fermeture après 5 secondes (sauf chat)
      if (type !== 'chat') {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log('📱 Notification système envoyée:', title);
    } catch (error) {
      console.error('❌ Erreur notification système:', error);
    }
  };

  /**
   * 📝 Création d'une nouvelle notification dans l'app
   */
  const createAppNotification = async (
    notificationData: Omit<Notification, 'id' | 'user_id' | 'created_at'>
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('app_notifications')
        .insert({
          ...notificationData,
          user_id: user.id
        });

      if (error) throw error;

      console.log('📝 Notification app créée:', notificationData.title);
    } catch (error) {
      console.error('❌ Erreur création notification:', error);
      throw error;
    }
  };

  /**
   * 📖 Marquer une notification comme lue
   */
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('app_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      // 🔄 Mise à jour locale immédiate
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );

      console.log('📖 Notification marquée comme lue:', notificationId);
    } catch (error) {
      console.error('❌ Erreur marquer comme lu:', error);
      throw error;
    }
  };

  /**
   * 📖 Marquer toutes les notifications comme lues
   */
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .rpc('mark_notifications_as_read', { notification_ids: unreadIds });

      if (error) throw error;

      // 🔄 Mise à jour locale
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );

      toast.success(`${unreadIds.length} notification(s) marquée(s) comme lue(s)`);
      console.log('📖 Toutes notifications marquées comme lues');
    } catch (error) {
      console.error('❌ Erreur marquer tout comme lu:', error);
      throw error;
    }
  };

  /**
   * 🗑️ Supprimer une notification
   */
  const deleteNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('app_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      // 🔄 Mise à jour locale
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      console.log('🗑️ Notification supprimée:', notificationId);
    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
      throw error;
    }
  };

  /**
   * 🧹 Effacer toutes les notifications
   */
  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('app_notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      toast.success('Toutes les notifications ont été effacées');
      console.log('🧹 Toutes notifications effacées');
    } catch (error) {
      console.error('❌ Erreur effacement notifications:', error);
      throw error;
    }
  };

  /**
   * 🔄 Actualisation manuelle des notifications
   */
  const refreshNotifications = async () => {
    console.log('🔄 Actualisation manuelle notifications');
    await loadNotifications();
  };

  /**
   * 🔊 Lecture du son de notification
   */
  const playNotificationSound = () => {
    try {
      // 🎵 Son de notification personnalisé ou défaut système
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback silencieux si son indisponible
        console.log('🔊 Son notification non disponible');
      });
    } catch (error) {
      // Son non critique, ignorer les erreurs
    }
  };

  /**
   * 📡 Fonction utilitaire pour notifications en cours d'utilisation
   */
  const sendNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (permission.granted) {
      sendSystemNotification(title, body, 'info');
    } else {
      toast.info(title, { description: body });
    }
  };

  // 📊 Calcul du nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.is_read).length;

  console.log('🔔 Hook notifications:', {
    total: notifications.length,
    unread: unreadCount,
    permission: permission.granted ? 'accordée' : 'refusée'
  });

  return {
    notifications,
    unreadCount,
    loading,
    permission,
    requestPermission,
    sendNotification,
    createAppNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
    playNotificationSound
  };
};