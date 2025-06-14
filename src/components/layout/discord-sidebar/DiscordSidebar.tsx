
/**
 * Composant de sidebar optimisé inspiré de Discord avec animations Magic Navbar
 * 
 * Sidebar principale refactorisée avec architecture modulaire et composants réutilisables.
 * Fonctionnalités complètes d'animation Magic Navbar et navigation adaptative.
 */

import React, { useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import { MagicNavIcon } from './components/MagicNavIcon';
import { UserAvatar } from './components/UserAvatar';
import { LogoutButton } from './components/LogoutButton';

/**
 * Composant principal de sidebar avec design Discord et animations Magic Navbar
 * 
 * Architecture refactorisée :
 * - Composants modulaires et réutilisables
 * - Hooks personnalisés pour la logique métier
 * - Configuration centralisée de la navigation
 * - Gestion d'erreur robuste avec fallbacks
 * - Optimisation des performances avec mémorisation
 */
const DiscordSidebar: React.FC = () => {
  // Gestion sécurisée du contexte d'authentification avec fallback d'erreur
  let user, signOut;
  try {
    const authContext = useAuth();
    user = authContext.user;
    signOut = authContext.signOut;
  } catch (error) {
    console.error('DiscordSidebar: Erreur du contexte d\'authentification:', error);
    // Masquage de la sidebar si le contexte n'est pas disponible
    return null;
  }

  // Protection : ne pas afficher la sidebar si aucun utilisateur connecté
  if (!user) {
    console.log('DiscordSidebar: Aucun utilisateur connecté, masquage de la sidebar');
    return null;
  }

  /**
   * Génération mémorisée des éléments de navigation selon le rôle utilisateur
   * Évite la recalculation à chaque rendu pour optimiser les performances
   */
  const allNavItems = useMemo(() => {
    return generateNavItems(user.role);
  }, [user.role]);

  /**
   * Hook personnalisé pour la gestion des animations Magic Navbar
   * Encapsule toute la logique d'animation du blob flottant
   */
  const {
    hoveredItem,
    blobPosition,
    navItemsRef,
    sidebarRef,
    isActive,
    handleMouseEnter,
    handleMouseLeave
  } = useBlobAnimation(allNavItems);

  /**
   * Gestionnaire optimisé pour la déconnexion utilisateur
   * Mémorisé pour éviter les re-créations inutiles
   */
  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <div 
      ref={sidebarRef}
      className="hidden md:flex flex-col items-center w-[80px] bg-gray-100 h-screen border-r shadow-sm relative overflow-hidden"
    >
      {/* Blob magique animé avec gradient et effets visuels */}
      <div
        className={cn(
          "absolute w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-2xl transition-all duration-500 ease-out shadow-lg blur-sm",
          blobPosition.opacity > 0 ? "opacity-30" : "opacity-0"
        )}
        style={{
          top: `${blobPosition.top - 2}px`,
          left: '8px',
          transform: 'translateY(0)',
        }}
      />

      {/* Avatar utilisateur avec informations et effets visuels */}
      <UserAvatar 
        displayName={user.displayName}
        role={user.role}
      />
      
      {/* Séparateur décoratif avec effet de lueur gradient */}
      <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-medical-teal to-transparent rounded-full my-3 opacity-50"></div>
      
      {/* Zone de navigation avec scroll optimisé et animations */}
      <ScrollArea className="h-[calc(100vh-220px)] w-full py-3 px-4 relative">
        <div 
          className="flex flex-col items-center space-y-2 w-full relative"
          onMouseLeave={handleMouseLeave}
        >
          {/* Rendu de tous les éléments de navigation avec animations Magic Navbar */}
          {allNavItems.map((item) => (
            <MagicNavIcon 
              key={item.path} 
              item={item}
              isActive={isActive(item.path)}
              isHovered={hoveredItem === item.path}
              onMouseEnter={() => handleMouseEnter(item.path)}
              onMouseLeave={handleMouseLeave}
              navItemRef={(el) => navItemsRef.current[item.path] = el}
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* Bouton de déconnexion fixe en bas avec animations spéciales */}
      <LogoutButton onLogout={handleLogout} />
    </div>
  );
};

export default DiscordSidebar;
