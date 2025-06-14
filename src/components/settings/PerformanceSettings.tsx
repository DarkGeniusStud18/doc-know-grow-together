
/**
 * Composant de paramètres de performance pour MedCollab
 * 
 * Intègre le moniteur de performance dans les paramètres avec des fonctionnalités étendues :
 * - Surveillance en temps réel des performances
 * - Contrôles utilisateur pour activer/désactiver le monitoring
 * - Métriques détaillées d'utilisation
 * - Suggestions d'optimisation
 * - Gestion des notifications PWA
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePerformanceMonitor } from '@/components/ui/performance-monitor';
import { toast } from '@/components/ui/sonner';
import { 
  Activity, 
  Zap, 
  MemoryStick, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Trash2,
  RefreshCw
} from 'lucide-react';

/**
 * Composant principal des paramètres de performance
 */
const PerformanceSettings: React.FC = () => {
  const [monitoringEnabled, setMonitoringEnabled] = useState(
    localStorage.getItem('performance-monitoring') !== 'false'
  );
  const [pwaNotificationsEnabled, setPwaNotificationsEnabled] = useState(
    localStorage.getItem('pwa-notifications') !== 'false'
  );
  const [memoryThreshold, setMemoryThreshold] = useState(
    parseInt(localStorage.getItem('memory-threshold') || '100')
  );

  const { metrics, recordRender, resetMetrics } = usePerformanceMonitor('PerformanceSettings');

  // Enregistrer les préférences dans localStorage
  useEffect(() => {
    localStorage.setItem('performance-monitoring', monitoringEnabled.toString());
  }, [monitoringEnabled]);

  useEffect(() => {
    localStorage.setItem('pwa-notifications', pwaNotificationsEnabled.toString());
  }, [pwaNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('memory-threshold', memoryThreshold.toString());
  }, [memoryThreshold]);

  // Enregistrer le rendu du composant
  useEffect(() => {
    if (monitoringEnabled) {
      recordRender();
    }
  }, [monitoringEnabled, recordRender]);

  /**
   * Nettoie le cache et optimise les performances
   */
  const handleOptimizePerformance = () => {
    try {
      // Nettoyer le localStorage des données temporaires
      const keysToKeep = ['auth-token', 'user-preferences', 'performance-monitoring', 'pwa-notifications', 'memory-threshold'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Forcer le garbage collection si disponible
      if ('gc' in window) {
        (window as any).gc();
      }

      resetMetrics();

      toast.success('Optimisation terminée', {
        description: 'Les performances de l\'application ont été optimisées',
        duration: 3000
      });
    } catch (error) {
      toast.error('Erreur d\'optimisation', {
        description: 'Impossible d\'optimiser les performances',
        duration: 3000
      });
    }
  };

  /**
   * Réinitialise tous les paramètres de performance
   */
  const handleResetSettings = () => {
    setMonitoringEnabled(true);
    setPwaNotificationsEnabled(true);
    setMemoryThreshold(100);
    resetMetrics();
    
    toast.info('Paramètres réinitialisés', {
      description: 'Tous les paramètres de performance ont été remis par défaut',
      duration: 3000
    });
  };

  /**
   * Désactive définitivement les notifications PWA
   */
  const handleDisablePWANotifications = () => {
    localStorage.setItem('pwa-notifications-disabled', 'true');
    localStorage.setItem('pwa-install-decline-time', Date.now().toString());
    setPwaNotificationsEnabled(false);
    
    toast.success('Notifications PWA désactivées', {
      description: 'Les notifications PWA ont été désactivées définitivement',
      duration: 3000
    });
  };

  /**
   * Obtient le statut de la mémoire
   */
  const getMemoryStatus = () => {
    if (metrics.memoryUsage === 0) return { status: 'unknown', color: 'gray' };
    if (metrics.memoryUsage < 50) return { status: 'optimal', color: 'green' };
    if (metrics.memoryUsage < memoryThreshold) return { status: 'normal', color: 'blue' };
    return { status: 'élevée', color: 'orange' };
  };

  const memoryStatus = getMemoryStatus();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical-blue" />
            Moniteur de Performance
          </CardTitle>
          <CardDescription>
            Surveillez et optimisez les performances de votre application MedCollab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Surveillance active</p>
              <p className="text-sm text-gray-500">
                Active le monitoring en temps réel des performances
              </p>
            </div>
            <Switch
              checked={monitoringEnabled}
              onCheckedChange={setMonitoringEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Métriques en temps réel */}
      {monitoringEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Métriques en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MemoryStick className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Mémoire utilisée</p>
                  <p className="text-lg font-bold text-blue-900">
                    {metrics.memoryUsage.toFixed(1)} MB
                  </p>
                  <Badge variant="outline" className={`text-${memoryStatus.color}-600`}>
                    {memoryStatus.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-purple-700">Rendus</p>
                  <p className="text-lg font-bold text-purple-900">
                    {metrics.renderCount}
                  </p>
                  <Badge variant="outline" className={`${metrics.renderCount > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                    {metrics.renderCount > 50 ? 'Élevé' : 'Normal'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-700">Dernière MAJ</p>
                  <p className="text-lg font-bold text-green-900">
                    {Math.round((Date.now() - metrics.lastUpdate) / 1000)}s
                  </p>
                  <Badge variant="outline" className="text-green-600">
                    Actif
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestion des notifications PWA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Notifications PWA
          </CardTitle>
          <CardDescription>
            Contrôlez les notifications liées aux fonctionnalités PWA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications PWA actives</p>
              <p className="text-sm text-gray-500">
                Autorise les notifications d'installation et de mise à jour
              </p>
            </div>
            <Switch
              checked={pwaNotificationsEnabled}
              onCheckedChange={setPwaNotificationsEnabled}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDisablePWANotifications}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Désactiver définitivement les notifications PWA
            </Button>
            
            <p className="text-xs text-gray-500">
              Cette action désactivera toutes les notifications PWA de manière permanente.
              Vous pouvez les réactiver en modifiant le commutateur ci-dessus.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Optimisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-medical-teal" />
            Optimisation
          </CardTitle>
          <CardDescription>
            Outils pour améliorer les performances de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleOptimizePerformance}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Optimiser maintenant
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Suggestions d'optimisation</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Fermez les onglets inutilisés pour libérer de la mémoire</li>
                  <li>• Redémarrez l'application si la mémoire dépasse {memoryThreshold}MB</li>
                  <li>• Utilisez le mode sombre pour économiser la batterie</li>
                  <li>• Videz le cache du navigateur régulièrement</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSettings;
