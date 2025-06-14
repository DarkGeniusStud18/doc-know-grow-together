
/**
 * Moniteur de performance pour MedCollab
 * 
 * Composant utilitaire pour surveiller et optimiser les performances de l'application
 * Détecte les problèmes de chargement infini et propose des solutions automatiques
 */

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, Zap, Activity } from 'lucide-react';

/**
 * Interface pour les métriques de performance
 */
interface PerformanceMetrics {
  loadTime: number;
  renderCount: number;
  memoryUsage: number;
  lastUpdate: number;
}

/**
 * Interface pour la configuration du moniteur
 */
interface PerformanceMonitorProps {
  componentName?: string;
  maxRenderCount?: number;
  warningThreshold?: number;
  enabled?: boolean;
}

/**
 * Hook personnalisé pour surveiller les performances des composants
 */
export const usePerformanceMonitor = (componentName: string = 'Unknown') => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderCount: 0,
    memoryUsage: 0,
    lastUpdate: Date.now()
  });

  const [hasWarned, setHasWarned] = useState(false);

  /**
   * Mesure la mémoire utilisée par l'application
   */
  const measureMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // En MB
    }
    return 0;
  }, []);

  /**
   * Enregistre un nouveau rendu du composant
   */
  const recordRender = useCallback(() => {
    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      const currentTime = Date.now();
      const timeSinceLastUpdate = currentTime - prev.lastUpdate;

      // Détecter les boucles de rendu potentielles
      if (newRenderCount > 50 && timeSinceLastUpdate < 5000 && !hasWarned) {
        console.warn(`PerformanceMonitor: Possible boucle de rendu détectée dans ${componentName}`);
        setHasWarned(true);
        
        toast.warning('Performance dégradée détectée', {
          description: `Le composant ${componentName} se re-rend fréquemment`,
          duration: 5000,
          action: {
            label: 'Diagnostiquer',
            onClick: () => console.log('Métriques:', { componentName, renderCount: newRenderCount })
          }
        });
      }

      return {
        ...prev,
        renderCount: newRenderCount,
        memoryUsage: measureMemoryUsage(),
        lastUpdate: currentTime
      };
    });
  }, [componentName, hasWarned, measureMemoryUsage]);

  /**
   * Réinitialise les métriques
   */
  const resetMetrics = useCallback(() => {
    setMetrics({
      loadTime: 0,
      renderCount: 0,
      memoryUsage: measureMemoryUsage(),
      lastUpdate: Date.now()
    });
    setHasWarned(false);
  }, [measureMemoryUsage]);

  return {
    metrics,
    recordRender,
    resetMetrics
  };
};

/**
 * Composant de surveillance des performances globales
 * 
 * Fonctionnalités :
 * - Surveillance de la mémoire utilisée
 * - Détection des boucles de rendu infinies
 * - Alertes automatiques en cas de problème
 * - Suggestions d'optimisation
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  componentName = 'Application',
  maxRenderCount = 100,
  warningThreshold = 50,
  enabled = process.env.NODE_ENV === 'development'
}) => {
  const [isMonitoring, setIsMonitoring] = useState(enabled);
  const [globalMetrics, setGlobalMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderCount: 0,
    memoryUsage: 0,
    lastUpdate: Date.now()
  });

  /**
   * Surveille les performances globales de l'application
   */
  const monitorGlobalPerformance = useCallback(() => {
    if (!isMonitoring) return;

    const now = Date.now();
    const memoryUsage = ('memory' in performance) 
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
      : 0;

    setGlobalMetrics(prev => ({
      ...prev,
      memoryUsage,
      lastUpdate: now
    }));

    // Alerter si l'utilisation mémoire est trop élevée
    if (memoryUsage > 100) { // Plus de 100MB
      console.warn('PerformanceMonitor: Utilisation mémoire élevée détectée:', memoryUsage, 'MB');
      
      toast.warning('Utilisation mémoire élevée', {
        description: `L'application utilise ${memoryUsage.toFixed(1)}MB de mémoire`,
        duration: 8000,
        action: {
          label: 'Optimiser',
          onClick: () => {
            // Forcer le garbage collection si disponible
            if ('gc' in window) {
              (window as any).gc();
            }
            window.location.reload();
          }
        }
      });
    }
  }, [isMonitoring]);

  /**
   * Surveille les erreurs JavaScript globales
   */
  useEffect(() => {
    if (!isMonitoring) return;

    const handleError = (event: ErrorEvent) => {
      console.error('PerformanceMonitor: Erreur JavaScript détectée:', event.error);
      
      toast.error('Erreur détectée', {
        description: 'Une erreur JavaScript s\'est produite',
        duration: 5000,
        action: {
          label: 'Recharger',
          onClick: () => window.location.reload()
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('PerformanceMonitor: Promesse rejetée non gérée:', event.reason);
      
      toast.error('Erreur de promesse', {
        description: 'Une promesse a été rejetée sans gestion',
        duration: 5000
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isMonitoring]);

  /**
   * Surveillance périodique des performances
   */
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(monitorGlobalPerformance, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, [isMonitoring, monitorGlobalPerformance]);

  /**
   * Surveillance des Web Vitals pour les performances UX
   */
  useEffect(() => {
    if (!isMonitoring || typeof window === 'undefined') return;

    // Mesurer le LCP (Largest Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry && lastEntry.entryType === 'largest-contentful-paint') {
        const lcp = lastEntry.startTime;
        
        if (lcp > 2500) { // Plus de 2.5 secondes
          console.warn('PerformanceMonitor: LCP lent détecté:', lcp, 'ms');
          
          toast.warning('Chargement lent détecté', {
            description: `Le contenu principal met ${(lcp/1000).toFixed(1)}s à s'afficher`,
            duration: 5000
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('PerformanceMonitor: Observer LCP non supporté');
    }

    return () => observer.disconnect();
  }, [isMonitoring]);

  // Ne rien rendre en production sauf si explicitement activé
  if (!enabled && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-900/90 text-white p-2 rounded-lg text-xs max-w-xs backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <Activity size={12} className="text-green-400" />
        <span className="font-semibold">Performance Monitor</span>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {isMonitoring ? 'Pause' : 'Start'}
        </button>
      </div>
      
      {isMonitoring && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Mémoire:</span>
            <span className={globalMetrics.memoryUsage > 50 ? 'text-orange-400' : 'text-green-400'}>
              {globalMetrics.memoryUsage.toFixed(1)}MB
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Composant:</span>
            <span className="text-blue-400">{componentName}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Zap size={10} />
            <span>Surveillance active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
