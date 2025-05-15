
import { toast } from '@/components/ui/sonner';

/**
 * Affiche une notification de succès avec fallback sur console.log
 * @param message Message à afficher
 */
export const showSuccessNotification = (message: string): void => {
  try {
    toast.success(message);
  } catch (e) {
    console.log(`✅ ${message}`);
  }
};

/**
 * Affiche une notification d'erreur avec fallback sur console.error
 * @param message Message principal
 * @param details Détails optionnels de l'erreur
 */
export const showErrorNotification = (message: string, details?: string): void => {
  try {
    toast.error(message, {
      description: details
    });
  } catch (e) {
    console.error(`❌ ${message}${details ? `: ${details}` : ''}`);
  }
};

/**
 * Affiche une notification d'information avec fallback sur console.info
 * @param message Message à afficher
 */
export const showInfoNotification = (message: string): void => {
  try {
    toast.info(message);
  } catch (e) {
    console.info(`ℹ️ ${message}`);
  }
};
