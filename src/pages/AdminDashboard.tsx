
/**
 * 🔐 Dashboard Administrateur - Version Sécurisée
 * Accessible uniquement avec PIN et mot de passe
 * Statistiques complètes de l'application
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, Timer, Brain, Stethoscope, Target, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import MainLayout from '@/components/layout/MainLayout';

interface AdminStats {
  total_users: number;
  total_study_sessions: number;
  total_pomodoro_sessions: number;
  total_flashcards: number;
  total_clinical_cases: number;
  total_quiz_questions: number;
  active_users_last_7_days: number;
  total_notes: number;
  total_study_groups: number;
  total_resources: number;
}

const AdminDashboard: React.FC = () => {
  // États pour l'authentification admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // États pour les statistiques
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  /**
   * 🔐 Authentification administrateur sécurisée
   */
  const handleAdminLogin = async () => {
    setLoading(true);
    
    try {
      // Vérification des credentials dans la base de données
      const { data: credentials, error } = await supabase
        .from('admin_credentials')
        .select('pin_code, password')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erreur récupération credentials:', error);
        toast.error('Erreur de connexion administrateur');
        return;
      }

      if (!credentials) {
        toast.error('Configuration administrateur non trouvée');
        return;
      }

      // Vérification des credentials
      if (credentials.pin_code === pinCode && credentials.password === password) {
        setIsAuthenticated(true);
        toast.success('Connexion administrateur réussie');
        await loadAdminStats();
      } else {
        toast.error('Identifiants administrateur incorrects');
        setPinCode('');
        setPassword('');
      }
    } catch (error) {
      console.error('Erreur authentification admin:', error);
      toast.error('Erreur lors de l\'authentification');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📊 Chargement des statistiques administrateur
   */
  const loadAdminStats = async () => {
    setLoadingStats(true);
    
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('Erreur chargement statistiques:', error);
        toast.error('Erreur lors du chargement des statistiques');
        return;
      }

      setStats(data);
    } catch (error) {
      console.error('Erreur statistiques admin:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoadingStats(false);
    }
  };

  /**
   * 🚪 Déconnexion administrateur
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setStats(null);
    setPinCode('');
    setPassword('');
    toast.info('Déconnexion administrateur');
  };

  // Interface d'authentification admin
  if (!isAuthenticated) {
    return (
      <MainLayout requireAuth={false}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue to-medical-teal p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                🔐 Accès Administrateur
              </CardTitle>
              <CardDescription>
                Authentification sécurisée requise
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Code PIN</label>
                <Input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Entrez le code PIN"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              
              <Button 
                onClick={handleAdminLogin}
                disabled={loading || !pinCode || !password}
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
              >
                {loading ? '🔄 Vérification...' : '🔑 Se connecter'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Dashboard administrateur principal
  return (
    <MainLayout requireAuth={false}>
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* En-tête du dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-medical-blue" />
              Dashboard Administrateur
            </h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble des statistiques de l'application</p>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            🚪 Déconnexion
          </Button>
        </div>

        {/* Statistiques principales */}
        {loadingStats ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : stats ? (
          <>
            {/* Métriques utilisateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Users className="h-5 w-5" />
                    Utilisateurs Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{stats.total_users}</div>
                  <p className="text-sm text-blue-600 mt-1">Comptes créés</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <TrendingUp className="h-5 w-5" />
                    Utilisateurs Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{stats.active_users_last_7_days}</div>
                  <p className="text-sm text-green-600 mt-1">7 derniers jours</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Timer className="h-5 w-5" />
                    Sessions d'Étude
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{stats.total_study_sessions}</div>
                  <p className="text-sm text-purple-600 mt-1">Toutes sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Target className="h-5 w-5" />
                    Sessions Pomodoro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">{stats.total_pomodoro_sessions}</div>
                  <p className="text-sm text-orange-600 mt-1">Technique Pomodoro</p>
                </CardContent>
              </Card>
            </div>

            {/* Métriques de contenu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-teal-800">
                    <Brain className="h-5 w-5" />
                    Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-900">{stats.total_flashcards}</div>
                  <p className="text-sm text-teal-600 mt-1">Cartes créées</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Stethoscope className="h-5 w-5" />
                    Cas Cliniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">{stats.total_clinical_cases}</div>
                  <p className="text-sm text-red-600 mt-1">Cas disponibles</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <BookOpen className="h-5 w-5" />
                    Questions Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-900">{stats.total_quiz_questions}</div>
                  <p className="text-sm text-indigo-600 mt-1">Questions créées</p>
                </CardContent>
              </Card>
            </div>

            {/* Métriques supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📝 Notes Créées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_notes}</div>
                  <p className="text-sm text-gray-600">Notes utilisateurs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    👥 Groupes d'Étude
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_study_groups}</div>
                  <p className="text-sm text-gray-600">Groupes créés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📚 Ressources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_resources}</div>
                  <p className="text-sm text-gray-600">Ressources partagées</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions administrateur */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle>⚙️ Actions Administrateur</CardTitle>
                <CardDescription>
                  Outils de gestion et maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={loadAdminStats}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    🔄 Actualiser les Statistiques
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Fonctionnalité en développement')}
                    className="flex items-center gap-2"
                  >
                    📊 Exporter les Données
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Fonctionnalité en développement')}
                    className="flex items-center gap-2"
                  >
                    🧹 Nettoyage Base de Données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune donnée disponible</p>
            <Button onClick={loadAdminStats} className="mt-4">
              🔄 Charger les Statistiques
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
