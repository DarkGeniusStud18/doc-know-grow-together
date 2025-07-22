/**
 * 🔔 Hook personnalisé pour la gestion des notifications push
 * 
 * Fonctionnalités :
 * - Enregistrement pour les notifications push
 * - Gestion des permissions
 * - Support Capacitor.js pour mobile et web
 * - Callbacks personnalisables pour les événements
 */

import { useEffect, useState, useCallback } from 'react';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from '@/hooks/use-toast';

interface PushNotificationState {
  isRegistered: boolean;
  token: string | null;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'default' | null;
}

interface PushNotificationCallbacks {
  onTokenReceived?: (token: string) => void;
  onNotificationReceived?: (notification: PushNotificationSchema) => void;
  onNotificationOpened?: (action: ActionPerformed) => void;
  onError?: (error: string) => void;
}

/**
 * 🔔 Hook pour la gestion des notifications push
 * Compatible web et mobile (Capacitor.js)
 */
export const usePushNotifications = (callbacks?: PushNotificationCallbacks) => {
  const [state, setState] = useState<PushNotificationState>({
    isRegistered: false,
    token: null,
    error: null,
    permissionStatus: null
  });

  /**
   * 📝 Demande de permission pour les notifications
   */
  const requestPermission = useCallback(async () => {
    try {
      console.log('🔔 Demande de permission pour les notifications push...');
      
      if (Capacitor.isNativePlatform()) {
        // Sur mobile native (iOS/Android)
        const permission = await PushNotifications.requestPermissions();
        
        if (permission.receive === 'granted') {
          setState(prev => ({ ...prev, permissionStatus: 'granted' }));
          return true;
        } else {
          setState(prev => ({ 
            ...prev, 
            permissionStatus: 'denied',
            error: 'Permission refusée pour les notifications' 
          }));
          return false;
        }
      } else {
        // Sur web
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setState(prev => ({ 
            ...prev, 
            permissionStatus: permission === 'default' ? 'prompt' : permission as 'granted' | 'denied' | 'prompt'
          }));
          return permission === 'granted';
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Les notifications ne sont pas supportées' 
          }));
          return false;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur demande permission:', errorMessage);
      setState(prev => ({ ...prev, error: errorMessage }));
      callbacks?.onError?.(errorMessage);
      return false;
    }
  }, [callbacks]);

  /**
   * 📱 Enregistrement pour les notifications push
   */
  const registerForPushNotifications = useCallback(async () => {
    try {
      console.log('📱 Enregistrement pour les notifications push...');
      
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Permission requise pour les notifications');
      }
      
      if (Capacitor.isNativePlatform()) {
        // Enregistrement sur mobile
        await PushNotifications.register();
        
        // Écoute du token
        const tokenListener = await PushNotifications.addListener('registration', (token: Token) => {
          console.log('✅ Token push reçu:', token.value);
          setState(prev => ({ 
            ...prev, 
            isRegistered: true, 
            token: token.value,
            error: null 
          }));
          callbacks?.onTokenReceived?.(token.value);
          
          toast({
            title: "🔔 Notifications activées",
            description: "Vous recevrez désormais des notifications push.",
          });
        });

        // Écoute des erreurs d'enregistrement
        const errorListener = await PushNotifications.addListener('registrationError', (error: any) => {
          console.error('❌ Erreur enregistrement push:', error);
          const errorMessage = error.error || 'Erreur enregistrement';
          setState(prev => ({ ...prev, error: errorMessage }));
          callbacks?.onError?.(errorMessage);
        });

        return { tokenListener, errorListener };
      } else {
        // Sur web, utilisation des Service Workers
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY // À configurer
          });
          
          const token = JSON.stringify(subscription);
          setState(prev => ({ 
            ...prev, 
            isRegistered: true, 
            token,
            error: null 
          }));
          callbacks?.onTokenReceived?.(token);
          
          toast({
            title: "🔔 Notifications web activées",
            description: "Vous recevrez des notifications dans votre navigateur.",
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur enregistrement';
      console.error('❌ Erreur enregistrement push:', errorMessage);
      setState(prev => ({ ...prev, error: errorMessage }));
      callbacks?.onError?.(errorMessage);
      
      toast({
        title: "❌ Erreur notifications",
        description: "Impossible d'activer les notifications push.",
        variant: "destructive"
      });
    }
  }, [requestPermission, callbacks]);

  /**
   * 🔕 Désenregistrement des notifications
   */
  const unregisterFromPushNotifications = useCallback(async () => {
    try {
      console.log('🔕 Désenregistrement des notifications...');
      
      if (Capacitor.isNativePlatform()) {
        await PushNotifications.removeAllListeners();
      } else if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        isRegistered: false, 
        token: null 
      }));
      
      toast({
        title: "🔕 Notifications désactivées",
        description: "Vous ne recevrez plus de notifications push.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur désenregistrement';
      console.error('❌ Erreur désenregistrement:', errorMessage);
      callbacks?.onError?.(errorMessage);
    }
  }, [callbacks]);

  /**
   * ⚡ Configuration des écouteurs d'événements
   */
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Écoute des notifications reçues
      const notificationListener = PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('📩 Notification reçue:', notification);
          callbacks?.onNotificationReceived?.(notification);
          
          // Affichage d'un toast pour les notifications reçues
          toast({
            title: notification.title || "Nouvelle notification",
            description: notification.body || "Vous avez reçu une nouvelle notification.",
          });
        }
      );

      // Écoute des actions sur les notifications
      const actionListener = PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action: ActionPerformed) => {
          console.log('👆 Action notification:', action);
          callbacks?.onNotificationOpened?.(action);
        }
      );

      return () => {
        notificationListener.then(listener => listener?.remove());
        actionListener.then(listener => listener?.remove());
      };
    }
  }, [callbacks]);

  /**
   * 🔍 Vérification du statut initial
   */
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const permission = await PushNotifications.checkPermissions();
          setState(prev => ({ 
            ...prev, 
            permissionStatus: permission.receive as 'granted' | 'denied' | 'prompt'
          }));
        } catch (error) {
          console.log('Info: Impossible de vérifier les permissions initiales');
        }
      } else if ('Notification' in window) {
        const permission = Notification.permission;
        setState(prev => ({ 
          ...prev, 
          permissionStatus: permission === 'default' ? 'prompt' : permission as 'granted' | 'denied' | 'prompt'
        }));
      }
    };

    checkInitialStatus();
  }, []);

  return {
    state,
    registerForPushNotifications,
    unregisterFromPushNotifications,
    requestPermission
  };
};