
/**
 * Point d'entrée pour le module PWA Status
 * 
 * Exporte tous les composants et hooks du module PWA
 * pour une utilisation facilitée dans l'application
 */

// Composant principal
export { default as PWAStatus } from '../PWAStatus';

// Hooks personnalisés
export { usePWAState } from './hooks/usePWAState';
export { usePWAActions } from './hooks/usePWAActions';

// Composants modulaires
export { ConnectionIndicator } from './components/ConnectionIndicator';
export { InstallPrompt } from './components/InstallPrompt';
export { UpdateNotification } from './components/UpdateNotification';
export { StatusCard } from './components/StatusCard';
