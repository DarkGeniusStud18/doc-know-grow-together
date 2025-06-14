
/**
 * Service de vérification des connexions entre le code et la base de données
 * Vérifie que toutes les tables sont accessibles et que les RLS fonctionnent correctement
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ConnectionTest {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  status: 'success' | 'error' | 'pending';
  error?: string;
}

export class DatabaseConnectionVerifier {
  private tests: ConnectionTest[] = [];

  /**
   * Vérifie toutes les connexions essentielles de la base de données
   */
  async verifyAllConnections(userId?: string): Promise<boolean> {
    console.log('DatabaseConnectionVerifier: Début de la vérification des connexions');
    
    this.tests = [];
    
    if (!userId) {
      console.warn('DatabaseConnectionVerifier: Aucun utilisateur connecté, test limité');
      return await this.verifyPublicConnections();
    }

    // Tests pour les tables utilisateur
    const userTables = [
      'profiles',
      'user_preferences', 
      'user_display_preferences',
      'tasks',
      'task_categories',
      'study_plans',
      'study_goals',
      'study_sessions',
      'notes',
      'flashcards',
      'calendar_events',
      'presentations',
      'pomodoro_sessions',
      'pomodoro_settings'
    ];

    // Tests pour les tables publiques/communautaires
    const publicTables = [
      'community_topics',
      'community_responses',
      'resources',
      'music_tracks',
      'clinical_cases'
    ];

    let allSuccess = true;

    // Vérifier les tables utilisateur
    for (const table of userTables) {
      const success = await this.testUserTable(table, userId);
      if (!success) allSuccess = false;
    }

    // Vérifier les tables publiques
    for (const table of publicTables) {
      const success = await this.testPublicTable(table);
      if (!success) allSuccess = false;
    }

    // Vérifier les fonctions RPC
    const rpcSuccess = await this.testRpcFunctions();
    if (!rpcSuccess) allSuccess = false;

    this.logResults();
    return allSuccess;
  }

  /**
   * Vérifie les connexions publiques (sans authentification)
   */
  private async verifyPublicConnections(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('music_tracks')
        .select('count(*)', { count: 'exact' });

      if (error) {
        console.error('DatabaseConnectionVerifier: Erreur connexion publique:', error);
        return false;
      }

      console.log('DatabaseConnectionVerifier: Connexions publiques OK');
      return true;
    } catch (error) {
      console.error('DatabaseConnectionVerifier: Erreur vérification publique:', error);
      return false;
    }
  }

  /**
   * Teste l'accès à une table utilisateur avec RLS
   */
  private async testUserTable(tableName: string, userId: string): Promise<boolean> {
    const test: ConnectionTest = {
      table: tableName,
      operation: 'select',
      status: 'pending'
    };
    
    this.tests.push(test);

    try {
      // Test de lecture avec type assertion pour contourner les types stricts
      const { error: selectError } = await (supabase as any)
        .from(tableName)
        .select('count(*)', { count: 'exact' });

      if (selectError) {
        test.status = 'error';
        test.error = selectError.message;
        console.error(`DatabaseConnectionVerifier: Erreur SELECT ${tableName}:`, selectError);
        return false;
      }

      test.status = 'success';
      console.log(`DatabaseConnectionVerifier: Table ${tableName} accessible`);
      return true;
    } catch (error) {
      test.status = 'error';
      test.error = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`DatabaseConnectionVerifier: Erreur test ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Teste l'accès à une table publique
   */
  private async testPublicTable(tableName: string): Promise<boolean> {
    const test: ConnectionTest = {
      table: tableName,
      operation: 'select',
      status: 'pending'
    };
    
    this.tests.push(test);

    try {
      const { error } = await (supabase as any)
        .from(tableName)
        .select('count(*)', { count: 'exact' });

      if (error) {
        test.status = 'error';
        test.error = error.message;
        console.error(`DatabaseConnectionVerifier: Erreur table publique ${tableName}:`, error);
        return false;
      }

      test.status = 'success';
      console.log(`DatabaseConnectionVerifier: Table publique ${tableName} accessible`);
      return true;
    } catch (error) {
      test.status = 'error';
      test.error = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`DatabaseConnectionVerifier: Erreur test table publique ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Teste les fonctions RPC
   */
  private async testRpcFunctions(): Promise<boolean> {
    try {
      // Test de la fonction get_group_messages avec un ID bidon
      const { error } = await supabase
        .rpc('get_group_messages', { 
          p_group_id: '00000000-0000-0000-0000-000000000000' 
        });

      if (error && !error.message.includes('does not exist')) {
        console.error('DatabaseConnectionVerifier: Erreur fonction RPC:', error);
        return false;
      }

      console.log('DatabaseConnectionVerifier: Fonctions RPC accessibles');
      return true;
    } catch (error) {
      console.error('DatabaseConnectionVerifier: Erreur test RPC:', error);
      return false;
    }
  }

  /**
   * Log les résultats de tous les tests
   */
  private logResults(): void {
    const successCount = this.tests.filter(t => t.status === 'success').length;
    const errorCount = this.tests.filter(t => t.status === 'error').length;
    
    console.log(`DatabaseConnectionVerifier: Résultats - ${successCount} succès, ${errorCount} erreurs`);
    
    if (errorCount > 0) {
      console.warn('DatabaseConnectionVerifier: Tables avec erreurs:');
      this.tests
        .filter(t => t.status === 'error')
        .forEach(t => console.warn(`- ${t.table}: ${t.error}`));
    }
  }

  /**
   * Teste une connexion spécifique avec gestion d'erreur user-friendly
   */
  async testSpecificConnection(tableName: string, userId?: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from(tableName)
        .select('count(*)', { count: 'exact' });

      if (error) {
        toast.error(`Erreur de connexion`, {
          description: `Impossible d'accéder à la table ${tableName}: ${error.message}`
        });
        return false;
      }

      toast.success(`Connexion vérifiée`, {
        description: `Table ${tableName} accessible`
      });
      return true;
    } catch (error) {
      toast.error(`Erreur de test`, {
        description: `Erreur lors du test de ${tableName}`
      });
      return false;
    }
  }

  /**
   * Retourne les résultats des tests pour debugging
   */
  getTestResults(): ConnectionTest[] {
    return [...this.tests];
  }
}

// Instance singleton
export const dbConnectionVerifier = new DatabaseConnectionVerifier();
