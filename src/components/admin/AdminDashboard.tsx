
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Calendar,
  Clock,
  Target
} from 'lucide-react';

/**
 * Interface pour les statistiques en temps réel de l'application
 */
interface AppStats {
  totalUsers: number;
  activeUsers: number;
  totalResources: number;
  totalDiscussions: number;
  totalStudySessions: number;
  totalGoals: number;
  avgSessionDuration: number;
  completionRate: number;
}

/**
 * Tableau de bord administrateur avec données réelles et statistiques en temps réel
 * Accès sécurisé par PIN et mot de passe
 * Synchronisation automatique avec la base de données Supabase
 */
const AdminDashboard: React.FC = () => {
  // États pour l'authentification administrateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // États pour les statistiques de l'application
  const [stats, setStats] = useState<AppStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    totalDiscussions: 0,
    totalStudySessions: 0,
    totalGoals: 0,
    avgSessionDuration: 0,
    completionRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Authentification sécurisée de l'administrateur
   * PIN: 1234, Mot de passe: ByronStud18
   */
  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    
    // Simulation d'une vérification sécurisée
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (pin === '1234' && password === 'ByronStud18') {
      setIsAuthenticated(true);
      toast.success('Accès administrateur accordé', {
        description: 'Bienvenue dans le tableau de bord administrateur'
      });
      console.log('🔓 Authentification administrateur réussie');
      
      // Chargement initial des statistiques
      await fetchRealTimeStats();
    } else {
      toast.error('Accès refusé', {
        description: 'PIN ou mot de passe incorrect'
      });
      console.log('❌ Tentative d\'authentification échouée');
    }
    
    setIsAuthenticating(false);
  };

  /**
   * Récupération des statistiques en temps réel depuis Supabase
   * Données réelles sans simulation
   */
  const fetchRealTimeStats = async () => {
    setIsLoading(true);
    console.log('📊 Récupération des statistiques en temps réel...');
    
    try {
      // Statistiques des utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at, last_sign_in_at');
      
      if (profilesError) throw profilesError;
      
      // Calcul des utilisateurs actifs (connectés dans les 7 derniers jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeUsers = profiles?.filter(profile => 
        profile.last_sign_in_at && new Date(profile.last_sign_in_at) > sevenDaysAgo
      ).length || 0;

      // Statistiques des ressources
      const { count: resourcesCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true });

      // Statistiques des discussions communautaires
      const { count: discussionsCount } = await supabase
        .from('community_topics')
        .select('*', { count: 'exact', head: true });

      // Statistiques des sessions d'étude
      const { data: studySessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('duration_minutes, completed');
      
      if (sessionsError) throw sessionsError;

      // Calcul de la durée moyenne et du taux de completion
      const completedSessions = studySessions?.filter(s => s.completed) || [];
      const avgDuration = completedSessions.length > 0 
        ? completedSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / completedSessions.length
        : 0;
      
      const completionRate = studySessions && studySessions.length > 0
        ? (completedSessions.length / studySessions.length) * 100
        : 0;

      // Statistiques des objectifs
      const { count: goalsCount } = await supabase
        .from('study_goals')
        .select('*', { count: 'exact', head: true });

      // Mise à jour des statistiques
      setStats({
        totalUsers: profiles?.length || 0,
        activeUsers,
        totalResources: resourcesCount || 0,
        totalDiscussions: discussionsCount || 0,
        totalStudySessions: studySessions?.length || 0,
        totalGoals: goalsCount || 0,
        avgSessionDuration: Math.round(avgDuration),
        completionRate: Math.round(completionRate)
      });

      setLastUpdate(new Date());
      console.log('✅ Statistiques mises à jour avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      toast.error('Erreur de synchronisation', {
        description: 'Impossible de récupérer les statistiques'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actualisation automatique toutes les 30 secondes
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(fetchRealTimeStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Interface d'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue via-medical-teal to-medical-navy flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-medical-navy">
              🔐 Accès Administrateur
            </CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Code PIN</label>
              <Input
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <Input
                type="password"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAuthentication}
              className="w-full"
              disabled={isAuthenticating || !pin || !password}
            >
              {isAuthenticating ? 'Vérification...' : 'Se connecter'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête du tableau de bord */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Tableau de Bord Administrateur
              </h1>
              <p className="text-gray-600 mt-2">
                Statistiques en temps réel de la plateforme MedCollab
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
                </span>
              )}
              <Button 
                onClick={fetchRealTimeStats}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Actualisation...' : '🔄 Actualiser'}
              </Button>
            </div>
          </div>
        </div>

        {/* Grille des statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Statistiques des utilisateurs */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-medical-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-navy">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} actifs cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ressources médicales</CardTitle>
              <BookOpen className="h-4 w-4 text-medical-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-navy">{stats.totalResources}</div>
              <p className="text-xs text-muted-foreground">
                Documents et ressources
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-medical-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-navy">{stats.totalDiscussions}</div>
              <p className="text-xs text-muted-foreground">
                Sujets de discussion
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions d'étude</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-navy">{stats.totalStudySessions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completionRate}% de taux de réussite
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-medical-blue" />
                Performance d'étude
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Durée moyenne des sessions</span>
                  <span className="text-sm text-gray-600">{stats.avgSessionDuration} min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-medical-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.avgSessionDuration / 120) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Taux de completion</span>
                  <span className="text-sm text-gray-600">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-medical-teal h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-medical-green" />
                Objectifs et engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-medical-navy mb-2">
                  {stats.totalGoals}
                </div>
                <p className="text-sm text-gray-600">Objectifs créés par les utilisateurs</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold text-medical-teal mb-2">
                  {Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Taux d'engagement hebdomadaire</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Actions administratives */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">🛠️ Actions administratives</h3>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => toast.info('Fonctionnalité en cours de développement')}
              variant="outline"
            >
              📤 Exporter les données
            </Button>
            <Button 
              onClick={() => toast.info('Fonctionnalité en cours de développement')}
              variant="outline"
            >
              🔄 Synchroniser les données
            </Button>
            <Button 
              onClick={() => setIsAuthenticated(false)}
              variant="destructive"
            >
              🚪 Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
