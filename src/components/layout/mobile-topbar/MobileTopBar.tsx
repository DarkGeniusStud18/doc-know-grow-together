
/**
 * 🔝 Barre supérieure mobile PERMANENTE pour MedCollab - Version optimisée
 *
 * ✅ Améliorations apportées :
 * - Profil utilisateur optimisé : Avatar, nom et email avec navigation fluide
 * - Indicateur "En ligne" intelligent : Statut de connexion avec synchronisation PWA
 * - Bouton paramètres amélioré : Accès simplifié aux réglages
 * - Responsive design parfait pour mobile et tablette
 * - Performance et accessibilité renforcées
 * - Commentaires français détaillés pour maintenance
 *
 * 📱 TOUJOURS VISIBLE sur mobile et tablette avec positionnement fixe sécurisé
 */

import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Wifi, WifiOff, Smartphone, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { usePWAStatus } from "@/hooks/usePWAStatus";
import { cn } from "@/lib/utils";
import AdminAccessButton from "@/components/admin/AdminAccessButton";

/**
 * 📋 Interface pour les propriétés de la barre supérieure mobile
 * Structure optimisée pour la flexibilité et la réutilisabilité
 */
interface MobileTopBarProps {
  title?: string;
  showBackButton?: boolean;
}

/**
 * 🔝 Barre supérieure mobile PERMANENTE - TOUJOURS VISIBLE avec fonctionnalités PWA
 *
 * Optimisations techniques avancées :
 * - Position fixe sécurisée avec z-index prioritaire
 * - Safe area insets pour compatibilité notch/punch hole
 * - Gradient de fond avec blur pour lisibilité optimale
 * - Responsive design adapté mobile/tablette/desktop
 * - Indicateur de connexion temps réel avec PWA
 * - Synchronisation parfaite environnements natif/web
 * - Performance optimisée avec mémorisation intelligente
 */
const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  showBackButton,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const { isOnline, isNative, platform } = usePWAStatus();

  console.log('🔝 MobileTopBar: Rendu pour utilisateur', user?.displayName);
  console.log('🌐 État PWA:', { isOnline, isNative, platform });

  // 🎯 Calcul optimisé des initiales utilisateur avec mémorisation
  const userInitials = useMemo(() => {
    if (!user?.displayName) return "U";
    
    const initials = user.displayName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
    
    console.log('🎭 Initiales calculées:', initials);
    return initials;
  }, [user?.displayName]);

  // 📋 Détermination intelligente du titre de page actuel avec mémorisation
  const pageTitle = useMemo(() => {
    const path = location.pathname;

    const titleMap: Record<string, string> = {
      "/": "🏠 Accueil",
      "/dashboard": "📊 Tableau de bord",
      "/courses": "📚 Cours",
      "/resources": "📖 Ressources",
      "/community": "👥 Communauté",
      "/clinical-cases": "🩺 Cas cliniques",
      "/tools": "🛠️ Outils",
      "/study-groups": "👥 Groupes d'étude",
      "/calendar": "📅 Calendrier",
      "/profile": "👤 Mon profil",
      "/settings": "⚙️ Paramètres",
      "/subscription": "💎 Abonnement",
      "/notes": "📝 Notes",
      "/exam-simulator": "🎯 Simulateur d'examen",
      "/music-library": "🎵 Bibliothèque musicale",
    };

    const detectedTitle = titleMap[path] || title || "MedCollab";
    console.log('📋 Titre de page détecté:', detectedTitle);
    return detectedTitle;
  }, [location.pathname, title]);

  // 🌐 État de connexion intelligent avec détection PWA
  const connectionStatus = useMemo(() => {
    const status = {
      isOnline,
      text: isOnline ? 'En ligne' : 'Hors ligne',
      icon: isOnline ? Wifi : WifiOff,
      color: isOnline ? 'text-green-600' : 'text-red-600',
      bgColor: isOnline ? 'bg-green-100' : 'bg-red-100',
      borderColor: isOnline ? 'border-green-200' : 'border-red-200',
      platform: isNative ? 'Native' : 'Web'
    };
    
    console.log('🌐 Statut de connexion:', status);
    return status;
  }, [isOnline, isNative]);

  // 🛡️ Protection : masquer si aucun utilisateur connecté
  if (!user) {
    console.log("🚫 MobileTopBar: Aucun utilisateur connecté, masquage");
    return null;
  }

  console.log("🔝 MobileTopBar: Affichage PERMANENT pour utilisateur", {
    userId: user.id,
    displayName: user.displayName,
    currentPath: location.pathname,
    connectionStatus: connectionStatus.text,
    platform: connectionStatus.platform
  });

  return (
    <>
      {/* 🔝 BARRE SUPÉRIEURE MOBILE PERMANENTE - TOUJOURS FIXE EN HAUT */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          
          {/* 👤 SECTION GAUCHE : PROFIL UTILISATEUR avec avatar, nom et email */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 flex-1 min-w-0 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -ml-2 active:scale-95 group"
            aria-label={`Accéder au profil de ${user.displayName}`}
          >
            <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-medical-blue transition-colors flex-shrink-0">
              <AvatarImage
                src={user.profileImage || undefined}
                alt={`Photo de profil de ${user.displayName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-medical-blue to-medical-teal text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-gray-900 truncate group-hover:text-medical-blue transition-colors">
                {user.displayName}
              </h2>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          </Link>

          {/* 🔌 SECTION CENTRE-DROITE : INDICATEUR DE CONNEXION "EN LIGNE" avec PWA */}
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1 rounded-full border flex-shrink-0 transition-all duration-200",
            connectionStatus.bgColor,
            connectionStatus.borderColor
          )}>
            <connectionStatus.icon size={14} className={connectionStatus.color} />
            <span className={cn("text-xs font-medium", connectionStatus.color)}>
              {connectionStatus.text}
            </span>
            
            {/* 📱 Indicateur de plateforme (Native/Web) */}
            {isNative ? (
              <Smartphone size={12} className="text-blue-600" />
            ) : (
              <Globe size={12} className="text-gray-600" />
            )}
          </div>

          {/* 🔔 SECTION DROITE : BOUTON NOTIFICATIONS + PARAMÈTRES */}
          <div className="flex items-center space-x-2">
            {/* 🔔 Bouton Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-full transition-all duration-200 flex-shrink-0 group",
                "hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2"
              )}
              asChild
            >
              <Link to="/notifications" aria-label="Accéder aux notifications">
                <Bell size={18} className="text-gray-700 group-hover:text-medical-blue transition-colors duration-200" />
                {/* Badge pour notifications non lues */}
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white">
                  3
                </Badge>
              </Link>
            </Button>

            {/* ⚙️ Bouton Paramètres */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-full transition-all duration-200 flex-shrink-0 group",
                "hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2"
              )}
              asChild
            >
              <Link to="/settings" aria-label="Accéder aux paramètres">
                <Settings size={18} className="text-gray-700 group-hover:text-medical-blue group-hover:rotate-90 transition-all duration-200" />
              </Link>
            </Button>

            {/* 🔐 Bouton admin ultra-discret (pour les administrateurs autorisés uniquement) */}
            <AdminAccessButton isMobile={true} className="ml-1" />
          </div>
        </div>

        {/* 🎯 INDICATEUR DE RÔLE UTILISATEUR - Barre colorée subtile avec animation */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-20 transition-all duration-300">
          {user.role === "student" && (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse" />
          )}
          {user.role === "professional" && (
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse" />
          )}
          {user.role === "admin" && (
            <div className="w-full h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 animate-pulse" />
          )}
        </div>

        {/* 📱 Badge de titre de page responsive */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/80 backdrop-blur-sm">
            {pageTitle}
          </Badge>
        </div>
      </div>

      {/* 📏 ESPACEUR COMPENSATEUR - Compense la hauteur de la barre fixe */}
      <div
        className="md:hidden h-[72px] safe-area-inset-top"
        aria-hidden="true"
      />
    </>
  );
};

export default MobileTopBar;
