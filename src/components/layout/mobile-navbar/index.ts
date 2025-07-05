
/**
 * Point d'entrée pour le module MobileNavbar
 * 
 * Exportation centralisée de tous les composants, hooks et types
 * pour une utilisation simplifiée dans l'application
 */

export { MobileNavbar, default as default } from './MobileNavbar';
export { MagicNavIcon } from './components/MagicNavIcon';
export { useBlobAnimation } from './hooks/useBlobAnimation';
export { primaryNavItems, secondaryNavItems } from './navigation-config';
export type { 
  MobileNavItem, 
  MagicNavIconProps, 
  BlobPosition, 
  MobileSecondaryMenuProps 
} from './types';
