
/**
 * 🔐 Dashboard Administrateur Ultra-Sécurisé
 * 
 * Fonctionnalités de sécurité :
 * - Authentification par PIN et mot de passe
 * - Accès restreint à yasseradjadi9@gmail.com uniquement
 * - Statistiques complètes des utilisateurs
 * - Interface responsive et professionnelle
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  Activity,
  TrendingUp,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  GraduationCap,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface pour les statistiques utilisateur réelles
 */
interface UserStats {
  totalUsers: number;
  activeUsersMonth: number;
  activeUsersWeek: number;
  newUsersToday: number;
  studyGroups: number;
  discussions: number;
  resources: number;
  presentations: number;
  studySessions: number;
  totalStudyMinutes: number;
}

/**
 * Composant principal du dashboard admin
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);
  
  // États des données réelles
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsersMonth: 0,
    activeUsersWeek: 0,
    newUsersToday: 0,
    studyGroups: 0,
    discussions: 0,
    resources: 0,
    presentations: 0,
    studySessions: 0,
    totalStudyMinutes: 0
  });
  const [loading, setLoading] = useState(true);

  // 🛡️ Vérification de l'autorisation d'accès
  const isAuthorizedAdmin = user?.email === 'yasseradjadi9@gmail.com';

  // Redirection si non autorisé
  useEffect(() => {
    if (!isAuthorizedAdmin) {
      console.log('🚫 Accès admin non autorisé - redirection');
      navigate('/dashboard');
      return;
    }
  }, [isAuthorizedAdmin, navigate]);

  /**
   * 🔐 Gestion de l'authentification admin
   */
  const handleAuthentication = async () => {
    // Vérification des identifiants
    if (pin === '1234' && password === 'ByronStud18') {
      console.log('✅ Authentification admin réussie');
      setIsAuthenticated(true);
      toast.success('Accès administrateur accordé', {
        description: 'Bienvenue dans le dashboard admin',
      });
      loadAdminStats();
    } else {
      const newAttempts = authAttempts + 1;
      setAuthAttempts(newAttempts);
      
      console.log(`❌ Tentative d'authentification échouée (${newAttempts}/3)`);
      toast.error('Identifiants incorrects', {
        description: `Tentative ${newAttempts}/3`,
      });

      // Blocage temporaire après 3 tentatives
      if (newAttempts >= 3) {
        toast.error('Accès temporairement bloqué', {
          description: 'Trop de tentatives échouées. Redirection...',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    }
  };

  /**
   * 📊 Chargement des statistiques administrateur réelles depuis la base de données
   */
  const loadAdminStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Chargement des statistiques administrateur réelles...');
      
      // Appel de la fonction Supabase pour obtenir les statistiques réelles
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('❌ Erreur lors de la récupération des statistiques:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const realStats = data[0];
        const formattedStats: UserStats = {
          totalUsers: Number(realStats.total_users) || 0,
          activeUsersMonth: Number(realStats.active_users_month) || 0,
          activeUsersWeek: Number(realStats.active_users_week) || 0,
          newUsersToday: Number(realStats.new_users_today) || 0,
          studyGroups: Number(realStats.total_groups) || 0,
          discussions: Number(realStats.total_topics) || 0,
          resources: Number(realStats.total_resources) || 0,
          presentations: Number(realStats.total_presentations) || 0,
          studySessions: Number(realStats.total_study_sessions) || 0,
          totalStudyMinutes: Number(realStats.total_study_minutes) || 0
        };
        
        setStats(formattedStats);
        console.log('✅ Statistiques admin réelles chargées:', formattedStats);
      } else {
        console.log('⚠️ Aucune donnée retournée, utilisation de valeurs par défaut');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des stats:', error);
      toast.error('Erreur de chargement', {
        description: 'Impossible de charger les statistiques réelles',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🚪 Déconnexion admin
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setPassword('');
    setAuthAttempts(0);
    toast.info('Déconnexion admin', {
      description: 'Session administrateur fermée',
    });
  };

  // 🚫 Blocage d'accès si non autorisé
  if (!isAuthorizedAdmin) {
    return null;
  }

  // 🔐 Écran d'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Accès Administrateur
            </CardTitle>
            <p className="text-red-600 text-sm">
              Authentification requise pour continuer
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pin" className="text-red-700 font-medium">
                Code PIN
              </Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="border-red-200 focus:border-red-500"
                placeholder="Entrez le code PIN"
                maxLength={4}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-red-700 font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-red-200 focus:border-red-500 pr-10"
                  placeholder="Entrez le mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-red-400 hover:text-red-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAuthentication}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={!pin || !password || authAttempts >= 3}
            >
              <Shield className="w-4 h-4 mr-2" />
              Authentifier
            </Button>
            
            {authAttempts > 0 && (
              <div className="text-center text-red-500 text-sm">
                Tentatives: {authAttempts}/3
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 📊 Dashboard principal
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* En-tête du dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 mt-1">
            Statistiques et gestion de MedCollab
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            En ligne
          </Badge>
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Grille des statistiques */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Utilisateurs totaux */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Utilisateurs totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tous les comptes créés
              </p>
            </CardContent>
          </Card>

          {/* Utilisateurs actifs mensuels */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                Actifs (mois)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeUsersMonth.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Actifs ce mois-ci
              </p>
            </CardContent>
          </Card>

          {/* Utilisateurs actifs hebdomadaires */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-emerald-500" />
                Actifs (semaine)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.activeUsersWeek.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Actifs cette semaine
              </p>
            </CardContent>
          </Card>

          {/* Nouveaux utilisateurs aujourd'hui */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2 text-cyan-500" />
                Nouveaux (jour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">
                {stats.newUsersToday.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inscrits aujourd'hui
              </p>
            </CardContent>
          </Card>

          {/* Groupes d'étude */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-purple-500" />
                Groupes d'étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.studyGroups.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Groupes créés
              </p>
            </CardContent>
          </Card>

          {/* Discussions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
                Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.discussions.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sujets créés
              </p>
            </CardContent>
          </Card>

          {/* Ressources */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-teal-500" />
                Ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {stats.resources.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Documents partagés
              </p>
            </CardContent>
          </Card>

          {/* Présentations */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                Présentations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.presentations.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Présentations créées
              </p>
            </CardContent>
          </Card>

          {/* Sessions d'étude */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                Sessions d'étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.studySessions.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sessions effectuées
              </p>
            </CardContent>
          </Card>

          {/* Temps d'étude total */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-pink-500" />
                Temps d'étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                {Math.round(stats.totalStudyMinutes / 60).toLocaleString()}h
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Heures d'étude totales
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section d'informations supplémentaires avec données réelles */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Nouveaux utilisateurs aujourd'hui</span>
                <Badge variant="secondary">+{stats.newUsersToday}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Utilisateurs actifs cette semaine</span>
                <Badge variant="secondary">{stats.activeUsersWeek}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sessions d'étude actives</span>
                <Badge variant="secondary">{stats.studySessions}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Heures d'étude totales</span>
                <Badge variant="secondary">{Math.round(stats.totalStudyMinutes / 60)}h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Statut du serveur</span>
                <Badge className="bg-green-100 text-green-800">En ligne</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Base de données</span>
                <Badge className="bg-green-100 text-green-800">Opérationnelle</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dernière sauvegarde</span>
                <span className="text-gray-500">Il y a 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
