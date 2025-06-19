/**
 * 🔝 Barre supérieure mobile PERMANENTE pour MedCollab
 *
 * Caractéristiques requises :
 * - Profil utilisateur à gauche : Avatar, nom et email avec lien vers la page profil
 * - Indicateur "En ligne" au centre-droit : Statut de connexion compact
 * - Bouton paramètres à l'extrême droite : Accès aux réglages
 *
 * TOUJOURS VISIBLE sur mobile et tablette avec positionnement fixe sécurisé
 */

import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/**
 * 🔝 Barre supérieure mobile PERMANENTE - TOUJOURS VISIBLE
 *
 * Optimisations techniques :
 * - Position fixe sécurisée avec z-index prioritaire
 * - Safe area insets pour compatibilité notch/punch hole
 * - Gradient de fond avec blur pour lisibilité
 * - Responsive design adapté mobile/tablette
 * - Indicateur de connexion temps réel
 */
interface MobileTopBarProps {
  title?: string;
  showBackButton?: boolean;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  showBackButton,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  // 🎯 Calcul optimisé des initiales utilisateur avec mémorisation
  const userInitials = useMemo(() => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.displayName]);

  // 📋 Détermination intelligente du titre de page actuel
  const pageTitle = useMemo(() => {
    const path = location.pathname;

    const titleMap: Record<string, string> = {
      "/": "Accueil",
      "/dashboard": "Tableau de bord",
      "/courses": "Cours",
      "/resources": "Ressources",
      "/community": "Communauté",
      "/clinical-cases": "Cas cliniques",
      "/tools": "Outils",
      "/study-groups": "Groupes d'étude",
      "/calendar": "Calendrier",
      "/profile": "Mon profil",
      "/settings": "Paramètres",
      "/subscription": "Abonnement",
      "/notes": "Notes",
      "/exam-simulator": "Simulateur d'examen",
      "/music-library": "Bibliothèque musicale",
    };

    return titleMap[path] || "MedCollab";
  }, [location.pathname]);

  // 🔌 Simulation d'état de connexion (à intégrer avec un vrai service)
  const isOnline = useMemo(() => {
    return navigator.onLine; // État de connexion navigateur
  }, []);

  // 🛡️ Protection : masquer si aucun utilisateur connecté
  if (!user) {
    console.log("🚫 MobileTopBar: Aucun utilisateur connecté, masquage");
    return null;
  }

  console.log("🔝 MobileTopBar: Affichage PERMANENT pour utilisateur", {
    userId: user.id,
    displayName: user.displayName,
    currentPath: location.pathname,
    isOnline,
  });

  return (
    <>
      {/* 🔝 BARRE SUPÉRIEURE MOBILE PERMANENTE - TOUJOURS FIXE EN HAUT */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          {/* 👤 SECTION GAUCHE : PROFIL UTILISATEUR avec avatar, nom et email */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 flex-1 min-w-0 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -ml-2 active:scale-95"
            aria-label={`Accéder au profil de ${user.displayName}`}
          >
            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-medical-blue transition-colors flex-shrink-0">
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
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {user.displayName}
              </h2>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          </Link>

          {/* 🔌 SECTION CENTRE-DROITE : INDICATEUR DE CONNEXION "EN LIGNE" */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border flex-shrink-0">
            {isOnline ? (
              <>
                <Wifi size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  En ligne
                </span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-red-600" />
                <span className="text-xs font-medium text-red-700">
                  Hors ligne
                </span>
              </>
            )}
          </div>

          {/* ⚙️ SECTION EXTRÊME DROITE : BOUTON PARAMÈTRES */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-2 rounded-full transition-all duration-200 flex-shrink-0 ml-2",
              "hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2"
            )}
            asChild
          >
            <Link to="/settings" aria-label="Accéder aux paramètres">
              <Settings size={20} className="text-gray-700" />
            </Link>
          </Button>
        </div>

        {/* 🎯 INDICATEUR DE RÔLE UTILISATEUR - Barre colorée subtile */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-20 transition-all duration-300">
          {user.role === "student" && (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
          )}
          {user.role === "professional" && (
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
          )}
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
