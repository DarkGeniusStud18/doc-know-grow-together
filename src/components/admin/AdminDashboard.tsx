
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Activity, BookOpen, Calendar, BarChart3, Shield, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalResources: number;
  totalSessions: number;
  monthlyGrowth: number;
  averageSessionTime: number;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalResources: 3456,
    totalSessions: 15672,
    monthlyGrowth: 12.5,
    averageSessionTime: 24.8
  });

  const handleAuth = () => {
    if (pin === '1234' && password === 'ByronStud18') {
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      toast.success('Accès administrateur accordé');
      
      // Simuler le chargement des stats réelles
      setTimeout(() => {
        setStats({
          totalUsers: Math.floor(Math.random() * 2000) + 1000,
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          totalResources: Math.floor(Math.random() * 5000) + 2000,
          totalSessions: Math.floor(Math.random() * 20000) + 10000,
          monthlyGrowth: Math.floor(Math.random() * 20) + 5,
          averageSessionTime: Math.floor(Math.random() * 30) + 15
        });
      }, 1000);
    } else {
      toast.error('Identifiants incorrects');
      setPin('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setPassword('');
    toast.info('Déconnexion administrateur');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Accès Administrateur
              </DialogTitle>
              <DialogDescription>
                Veuillez saisir vos identifiants d'administrateur pour accéder au tableau de bord.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Code PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Entrez le code PIN"
                  maxLength={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleAuth} 
                className="w-full"
                disabled={!pin || !password}
              >
                Se connecter
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-red-500" />
                Zone Administrateur
              </CardTitle>
              <CardDescription>
                Accès restreint - Authentification requise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="w-full"
                variant="outline"
              >
                Accéder au tableau de bord
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              Tableau de Bord Administrateur
            </h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme MedCollab</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Déconnexion
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ressources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResources.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Contenus disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions d'Étude</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sessions complétées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageSessionTime} min</div>
              <p className="text-xs text-muted-foreground">Par session d'étude</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Croissance</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">Croissance mensuelle</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Nouvelle inscription</p>
                    <p className="text-sm text-gray-600">Étudiant en médecine</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 5 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Ressource ajoutée</p>
                    <p className="text-sm text-gray-600">Cours d'anatomie</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 12 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Session d'étude terminée</p>
                    <p className="text-sm text-gray-600">45 minutes</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 18 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques Système</CardTitle>
              <CardDescription>État de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Serveur</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    En ligne
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base de données</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Opérationnelle
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stockage</span>
                  <span className="text-sm text-blue-600">78% utilisé</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dernière sauvegarde</span>
                  <span className="text-sm text-gray-600">Il y a 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
