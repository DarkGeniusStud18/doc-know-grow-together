
/**
 * Page de suivi des performances utilisateur pour MedCollab
 * 
 * Fonctionnalités principales :
 * - Tableau de bord complet des métriques de performance
 * - Graphiques interactifs pour visualiser les progrès
 * - Statistiques détaillées par matière et période
 * - Interface responsive optimisée mobile/desktop
 * - Comparaison temporelle des résultats
 */

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Interface pour les données de métrique de performance
 * Structure les informations de suivi des performances utilisateur
 */
interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  category: string;
  description: string;
}

/**
 * Page principale de suivi des performances
 * Affiche un tableau de bord complet des métriques utilisateur
 * 
 * @returns JSX de la page de suivi des performances
 */
const PerformanceTracker: React.FC = () => {
  console.log('PerformanceTracker: Rendu de la page de suivi des performances');

  // Données d'exemple pour les métriques de performance
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: '1',
      title: 'Temps d\'étude quotidien',
      value: 3.5,
      unit: 'heures',
      trend: 'up',
      trendValue: 15,
      category: 'Productivité',
      description: 'Moyenne des 7 derniers jours'
    },
    {
      id: '2', 
      title: 'Score moyen aux quiz',
      value: 87,
      unit: '%',
      trend: 'up',
      trendValue: 5,
      category: 'Résultats',
      description: 'Amélioration constante'
    },
    {
      id: '3',
      title: 'Objectifs atteints',
      value: 12,
      unit: 'sur 15',
      trend: 'stable',
      trendValue: 0,
      category: 'Objectifs',
      description: 'Ce mois-ci'
    },
    {
      id: '4',
      title: 'Séances Pomodoro',
      value: 42,
      unit: 'séances',
      trend: 'up',
      trendValue: 8,
      category: 'Focus',
      description: 'Cette semaine'
    }
  ];

  /**
   * Rendu d'une carte de métrique de performance
   * Affiche les statistiques avec indicateurs visuels de tendance
   * 
   * @param metric - Données de la métrique à afficher
   * @returns JSX de la carte de métrique
   */
  const renderMetricCard = (metric: PerformanceMetric) => {
    // Icône de tendance selon l'évolution de la métrique
    const TrendIcon = metric.trend === 'up' ? TrendingUp : 
                     metric.trend === 'down' ? TrendingDown : Target;
    
    // Couleur de la tendance pour un feedback visuel immédiat
    const trendColor = metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';

    return (
      <Card key={metric.id} className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {metric.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {metric.category}
          </Badge>
        </CardHeader>
        <CardContent>
          {/* Valeur principale avec unité */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {metric.value}
            </span>
            <span className="text-sm text-gray-500">
              {metric.unit}
            </span>
          </div>
          
          {/* Indicateur de tendance avec variation */}
          <div className="flex items-center space-x-1 mb-1">
            <TrendIcon className={cn("h-4 w-4", trendColor)} />
            <span className={cn("text-sm font-medium", trendColor)}>
              {metric.trend !== 'stable' && (
                <>
                  {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.trendValue)}%
                </>
              )}
              {metric.trend === 'stable' && 'Stable'}
            </span>
          </div>
          
          {/* Description contextuelle */}
          <p className="text-xs text-gray-500">
            {metric.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout requireAuth>
      <div className="container-responsive spacing-section">
        {/* En-tête de la page avec titre et description */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="h-8 w-8 text-medical-blue" />
            <h1 className="text-3xl font-bold text-gray-900">
              Suivi des Performances
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Analysez vos progrès et optimisez votre apprentissage médical
          </p>
        </div>

        {/* Grille des métriques de performance */}
        <div className="responsive-grid-cards mb-8">
          {performanceMetrics.map(renderMetricCard)}
        </div>

        {/* Section des graphiques et analyses détaillées */}
        <div className="responsive-grid-wide">
          {/* Carte d'analyse des tendances */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-medical-teal" />
                <span>Analyse des Tendances</span>
              </CardTitle>
              <CardDescription>
                Évolution de vos performances sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder pour graphique futur */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Graphique des tendances à venir
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Carte des objectifs et recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-medical-purple" />
                <span>Recommandations</span>
              </CardTitle>
              <CardDescription>
                Conseils pour améliorer vos performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Liste des recommandations personnalisées */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    📈 Excellent progrès !
                  </p>
                  <p className="text-xs text-green-700">
                    Votre temps d'étude quotidien a augmenté de 15% cette semaine.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    🎯 Suggestion
                  </p>
                  <p className="text-xs text-blue-700">
                    Essayez d'augmenter la fréquence des séances Pomodoro pour améliorer votre concentration.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-1">
                    🏆 Objectif
                  </p>
                  <p className="text-xs text-purple-700">
                    Vous êtes proche d'atteindre votre objectif mensuel de 15 tâches complétées.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PerformanceTracker;
