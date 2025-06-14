
/**
 * Point d'entrée pour le module MobileSecondaryMenu
 * Exportations centralisées de tous les composants et types pour utilisation simplifiée
 */

export { default as MobileSecondaryMenu } from './MobileSecondaryMenu';
export { UserHeader } from './components/UserHeader';
export { NavigationItem } from './components/NavigationItem';
export { NavigationSection } from './components/NavigationSection';
export { LogoutSection } from './components/LogoutSection';
export { MenuFooter } from './components/MenuFooter';
export type { 
  MobileSecondaryMenuProps,
  MobileNavItem,
  UserHeaderProps,
  NavigationItemProps,
  LogoutButtonProps
} from './types';
