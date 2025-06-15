
/**
 * Gestionnaire d'authentification pour les comptes de démonstration
 * 
 * Ce service gère l'authentification des comptes de démonstration pour permettre aux utilisateurs
 * de tester l'application sans créer de compte réel. Il simule un processus d'authentification
 * réaliste avec délai de réseau et gestion d'erreurs.
 */

import { toast } from "@/components/ui/sonner";
import { User } from "../../types";
import { getCurrentUser } from "../../user-service";

/**
 * Types de comptes de démonstration disponibles
 * Utilisés pour créer des profils utilisateur spécifiques selon le contexte
 */
type DemoAccountType = 'student' | 'professional';

/**
 * Configuration des comptes de démonstration
 * Centralise les informations des comptes de test
 */
const DEMO_ACCOUNTS_CONFIG = {
  student: {
    email: 'student@example.com',
    displayName: 'Étudiant de Démonstration',
    role: 'student' as const
  },
  professional: {
    email: 'doctor@example.com', 
    displayName: 'Professionnel de Démonstration',
    role: 'professional' as const
  }
} as const;

/**
 * Durée de simulation du délai réseau pour les comptes de démonstration (en ms)
 * Simule une expérience utilisateur réaliste
 */
const DEMO_NETWORK_DELAY = 800;

/**
 * Gère le processus de connexion pour un compte de démonstration
 * 
 * Cette fonction orchestre l'authentification complète d'un compte de démonstration :
 * - Validation du type de compte demandé
 * - Simulation d'un délai réseau réaliste
 * - Stockage sécurisé des informations de démonstration
 * - Récupération du profil utilisateur via le service dédié
 * - Affichage de notifications utilisateur appropriées
 * 
 * @param email - Email du compte de démonstration à authentifier
 * @returns Promise<User | null> - Objet utilisateur ou null en cas d'erreur
 * 
 * @example
 * ```typescript
 * const demoUser = await handleDemoLogin('student@example.com');
 * if (demoUser) {
 *   console.log('Connexion démo réussie:', demoUser.displayName);
 * }
 * ```
 */
export const handleDemoLogin = async (email: string): Promise<User | null> => {
  console.log('🎭 AuthDemo: Début d\'authentification pour compte de démonstration:', email);
  
  try {
    // Simulation d'un délai réseau réaliste pour l'expérience utilisateur
    console.log('⏳ AuthDemo: Simulation du délai réseau...');
    await new Promise(resolve => setTimeout(resolve, DEMO_NETWORK_DELAY));
    
    // Détermination du type d'utilisateur de démonstration basé sur l'email
    const demoUserType: DemoAccountType = email === 'student@example.com' ? 'student' : 'professional';
    const demoConfig = DEMO_ACCOUNTS_CONFIG[demoUserType];
    
    console.log(`👤 AuthDemo: Configuration du profil de démonstration pour type: ${demoUserType}`);
    
    // Stockage sécurisé du type d'utilisateur de démonstration
    // Utilisation du localStorage pour persistance entre les sessions
    localStorage.setItem('demoUser', demoUserType);
    console.log('💾 AuthDemo: Informations de démonstration stockées localement');
    
    // Récupération du profil utilisateur complet via le service utilisateur
    console.log('🔄 AuthDemo: Récupération du profil utilisateur...');
    const demoUser = await getCurrentUser();
    
    // Vérification de la création réussie du profil utilisateur
    if (demoUser) {
      console.log('✅ AuthDemo: Profil utilisateur créé avec succès:', {
        id: demoUser.id,
        name: demoUser.displayName,
        role: demoUser.role
      });
      
      // Notification de succès avec personnalisation selon le type d'utilisateur
      toast.success('Connexion de démonstration réussie', { 
        id: 'demo-login-success',
        description: `Bienvenue ${demoUser.displayName} ! Explorez toutes les fonctionnalités.`,
        duration: 4000
      });
      
      return demoUser;
    }
    
    // Gestion d'erreur : échec de création du profil utilisateur
    console.error('❌ AuthDemo: Impossible de créer le profil utilisateur de démonstration');
    toast.error('Erreur de démonstration', {
      description: 'Impossible de créer le profil de démonstration. Veuillez réessayer.',
      duration: 5000
    });
    return null;
    
  } catch (error) {
    // Gestion des erreurs inattendues avec logging détaillé
    console.error('💥 AuthDemo: Erreur critique lors de l\'authentification de démonstration:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      email,
      timestamp: new Date().toISOString()
    });
    
    toast.error('Erreur de démonstration', {
      description: 'Une erreur technique est survenue. Veuillez réessayer dans quelques instants.',
      duration: 6000
    });
    return null;
  }
};

/**
 * Vérifie si un email correspond à un compte de démonstration
 * Fonction utilitaire pour identifier les comptes de test
 * 
 * @param email - Email à vérifier
 * @returns true si c'est un compte de démonstration, false sinon
 */
export const isDemoAccount = (email: string): boolean => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail === 'student@example.com' || normalizedEmail === 'doctor@example.com';
};

/**
 * Nettoie les données de démonstration du stockage local
 * Fonction utilitaire pour la déconnexion des comptes de démonstration
 */
export const clearDemoData = (): void => {
  localStorage.removeItem('demoUser');
  console.log('🧹 AuthDemo: Données de démonstration nettoyées');
};
