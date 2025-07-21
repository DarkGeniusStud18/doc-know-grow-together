/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 🚪 Section de déconnexion pour le menu secondaire mobile - Version optimisée
 * 
 * ✅ Améliorations apportées :
 * - Déconnexion réelle et fonctionnelle
 * - Confirmation utilisateur sécurisée
 * - Design cohérent avec le thème
 * - Commentaires français détaillés
 * - Gestion d'erreurs robuste
 */

import React from 'react';
import { LogOut, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface LogoutSectionProps {
  onItemClick: (item: any) => void;
}

/**
 * 🚪 Section de déconnexion avec confirmation et navigation sécurisée
 * 
 * Fonctionnalités optimisées :
 * - Déconnexion réelle avec gestion d'état
 * - Confirmation utilisateur avant déconnexion
 * - Feedback visuel et notifications
 * - Design sécurisé et accessible
 * - Gestion d'erreurs complète
 */
export const LogoutSection: React.FC<LogoutSectionProps> = ({ onItemClick }) => {
  const { signOut } = useAuth();
  
  console.log('🚪 LogoutSection: Rendu de la section de déconnexion');

  /**
   * 🔐 Gestionnaire de déconnexion avec confirmation
   * Procédure sécurisée avec feedback utilisateur
   */
  const handleLogout = async () => {
    console.log('🚪 LogoutSection: Tentative de déconnexion');
    
    try {
      // ⚠️ Confirmation utilisateur avant déconnexion
      const confirmed = window.confirm(
        '🔐 Êtes-vous sûr de vouloir vous déconnecter ?\n\nVous devrez vous reconnecter pour accéder à vos données.'
      );
      
      if (!confirmed) {
        console.log('🚫 Déconnexion annulée par l\'utilisateur');
        return;
      }
      
      // 📱 Vibration tactile pour feedback (si supportée)
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
      
      // 🔄 Notification de déconnexion en cours
      toast.info('🔄 Déconnexion en cours...', {
        duration: 2000
      });
      
      // 🚪 Fermeture du menu avant déconnexion
      const closeItem = {
        id: 'logout-close',
        label: 'Fermer avant déconnexion',
        href: 'close'
      };
      onItemClick(closeItem);
      
      // ⏳ Délai pour permettre la fermeture du menu
      setTimeout(async () => {
        try {
          // 🔐 Déconnexion réelle
          await signOut();
          
          // ✅ Notification de succès
          toast.success('✅ Déconnexion réussie !', {
            description: 'Vous avez été déconnecté avec succès. À bientôt !',
            duration: 3000
          });
          
          console.log('✅ Déconnexion réussie');
          
        } catch (signOutError) {
          console.error('❌ Erreur lors de la déconnexion:', signOutError);
          
          // ❌ Notification d'erreur
          toast.error('❌ Erreur lors de la déconnexion', {
            description: 'Une erreur est survenue. Veuillez réessayer.',
            duration: 5000
          });
        }
      }, 300);
      
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la déconnexion:', error);
      
      // ❌ Notification d'erreur générale
      toast.error('❌ Erreur inattendue', {
        description: 'Une erreur inattendue est survenue lors de la déconnexion.',
        duration: 5000
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 🏷️ Titre de section avec design sécurisé */}
      <div className="flex items-center space-x-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        <h2 className="text-lg font-semibold text-red-600 px-4 py-2 bg-red-50 rounded-full border border-red-200 flex items-center space-x-2">
          <Shield size={16} />
          <span>🔐 Sécurité</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
      </div>
      
      {/* 🚪 Bouton de déconnexion avec design sécurisé */}
      <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
        {/* ⚠️ Message d'avertissement */}
        <div className="flex items-center space-x-2 mb-3 text-red-600">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">Zone de déconnexion sécurisée</span>
        </div>
        
        {/* 🚪 Bouton de déconnexion principal */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
          aria-label="Se déconnecter de l'application"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-200" />
          <span>🚪 Se déconnecter</span>
        </Button>
        
        {/* 📋 Information supplémentaire */}
        <p className="text-xs text-red-500 mt-2 text-center">
          Vous devrez vous reconnecter pour accéder à vos données
        </p>
      </div>
    </div>
  );
};
