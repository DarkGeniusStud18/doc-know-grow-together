
/**
 * Point d'entrée principal pour tous les services de base de données
 * Centralise l'accès aux différents services et utilitaires
 */

// Services de données
export { studyPlanService } from './studyPlans';
export { taskService } from './tasks';
export { userPreferencesService } from './userPreferences';
export { presentationService } from './presentations';

// Services de vérification et debugging
export { dbConnectionVerifier, DatabaseConnectionVerifier } from './connectionVerifier';

// Helpers et utilitaires
export * from './studySessions';

/**
 * Initialise tous les services de base de données
 * À appeler au démarrage de l'application
 */
export const initializeDatabaseServices = async (userId?: string) => {
  console.log('Database Services: Initialisation des services');
  
  if (userId) {
    // Import the verifier here to avoid circular dependency issues
    const { dbConnectionVerifier } = await import('./connectionVerifier');
    
    // Vérifier les connexions essentielles
    const connectionOk = await dbConnectionVerifier.verifyAllConnections(userId);
    
    if (!connectionOk) {
      console.warn('Database Services: Certaines connexions ont échoué');
    } else {
      console.log('Database Services: Toutes les connexions sont opérationnelles');
    }
  }
  
  console.log('Database Services: Initialisation terminée');
};
