
/**
 * Composant Error Boundary pour MedCollab
 * 
 * Gère les erreurs JavaScript non capturées dans l'arbre des composants React.
 * Fournit une interface utilisateur de récupération gracieuse et des informations
 * de débogage utiles pour les développeurs.
 * 
 * Fonctionnalités :
 * - Capture des erreurs React non gérées
 * - Interface de récupération conviviale
 * - Logging détaillé pour le débogage
 * - Options de rechargement et de signalement
 * - Design responsive et accessible
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Interface pour les props du composant ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Composants enfants à surveiller */
  children: ReactNode;
  /** Message d'erreur personnalisé (optionnel) */
  fallbackMessage?: string;
  /** Fonction de callback lors d'une erreur (optionnel) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Interface pour l'état du composant ErrorBoundary
 */
interface ErrorBoundaryState {
  /** Indique si une erreur a été capturée */
  hasError: boolean;
  /** Détails de l'erreur capturée */
  error: Error | null;
  /** Informations supplémentaires sur l'erreur */
  errorInfo: ErrorInfo | null;
  /** ID unique de l'erreur pour le tracking */
  errorId: string;
}

/**
 * Composant Error Boundary principal
 * Classe component nécessaire pour implémenter componentDidCatch
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    // Initialisation de l'état
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  /**
   * Méthode statique appelée lors de la capture d'une erreur
   * Met à jour l'état pour déclencher l'affichage de l'interface d'erreur
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Génération d'un ID unique pour l'erreur
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  /**
   * Méthode appelée après la capture d'une erreur
   * Gère le logging et les callbacks personnalisés
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Mise à jour de l'état avec les informations détaillées
    this.setState({ errorInfo });

    // Logging détaillé de l'erreur
    console.group('🚨 ErrorBoundary: Erreur capturée');
    console.error('Erreur:', error);
    console.error('Stack trace:', error.stack);
    console.error('Informations du composant:', errorInfo.componentStack);
    console.error('ID d\'erreur:', this.state.errorId);
    console.groupEnd();

    // Appel du callback personnalisé si fourni
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        console.error('❌ ErrorBoundary: Erreur dans le callback onError:', callbackError);
      }
    }

    // Envoi optionnel de l'erreur à un service de monitoring
    // (Sentry, LogRocket, etc. - à implémenter selon les besoins)
    this.reportErrorToService(error, errorInfo);
  }

  /**
   * Fonction pour signaler l'erreur à un service de monitoring externe
   * Placeholder pour l'intégration future avec des outils comme Sentry
   */
  private reportErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Intégrer avec un service de monitoring d'erreurs
    console.log('📊 ErrorBoundary: Signalement de l\'erreur au service de monitoring');
    
    // Exemple d'implémentation future :
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack
    //       }
    //     },
    //     tags: {
    //       errorBoundary: true,
    //       errorId: this.state.errorId
    //     }
    //   });
    // }
  };

  /**
   * Fonction pour réinitialiser l'état d'erreur
   * Permet à l'utilisateur de tenter une récupération
   */
  private handleReset = () => {
    console.log('🔄 ErrorBoundary: Réinitialisation de l\'état d\'erreur');
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  /**
   * Fonction pour recharger complètement la page
   * Option de récupération en dernier recours
   */
  private handleReload = () => {
    console.log('🔄 ErrorBoundary: Rechargement complet de la page');
    window.location.reload();
  };

  /**
   * Fonction pour copier les détails de l'erreur dans le presse-papiers
   * Facilite le signalement des bugs par les utilisateurs
   */
  private copyErrorDetails = async () => {
    if (!this.state.error) return;

    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      console.log('📋 ErrorBoundary: Détails de l\'erreur copiés dans le presse-papiers');
      
      // TODO: Afficher une notification de succès
    } catch (err) {
      console.error('❌ ErrorBoundary: Impossible de copier dans le presse-papiers:', err);
    }
  };

  /**
   * Rendu du composant
   * Affiche soit les enfants normalement, soit l'interface d'erreur
   */
  render() {
    // Affichage normal si aucune erreur
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Interface d'erreur responsive et accessible
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center pb-4">
            {/* Icône d'erreur avec animation */}
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <CardTitle className="text-2xl text-gray-900">
              Oups ! Une erreur est survenue
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-lg">
              {this.props.fallbackMessage || 
                'Nous sommes désolés, quelque chose s\'est mal passé. Notre équipe technique a été notifiée.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Alerte avec ID d'erreur pour le support */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ID d'erreur :</strong> {this.state.errorId}
                <br />
                <span className="text-sm text-gray-500">
                  Communiquez cet ID au support technique si vous contactez l'assistance.
                </span>
              </AlertDescription>
            </Alert>

            {/* Détails techniques (en mode développement uniquement) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Détails techniques (développement)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            {/* Boutons d'actions de récupération */}
            <Button
              onClick={this.handleReset}
              className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>

            <Button
              onClick={this.handleReload}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger la page
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>

            {/* Bouton pour copier les détails (développement) */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={this.copyErrorDetails}
                variant="ghost"
                size="sm"
                className="self-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Copier les détails
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
}

/**
 * Hook pour les composants fonctionnels qui ont besoin de gérer des erreurs
 * Fournit une fonction pour signaler manuellement des erreurs à l'Error Boundary
 */
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: Partial<ErrorInfo>) => {
    console.error('🚨 useErrorHandler: Erreur signalée manuellement:', error);
    
    // Re-lancer l'erreur pour qu'elle soit capturée par l'Error Boundary
    throw error;
  };
};

/**
 * Composant Error Boundary simplifié pour des cas d'usage spécifiques
 * Version légère pour des sections critiques
 */
export const SimpleErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => {
  return (
    <ErrorBoundary
      fallbackMessage="Une erreur est survenue dans cette section"
      onError={(error, errorInfo) => {
        console.error('🚨 SimpleErrorBoundary: Erreur capturée:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
