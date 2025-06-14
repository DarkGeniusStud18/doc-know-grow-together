
/**
 * Composant Error Boundary pour la gestion d'erreurs React
 * 
 * Capture les erreurs JavaScript dans l'arbre des composants
 * et affiche une interface utilisateur de secours élégante
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';

/**
 * Interface des propriétés de l'Error Boundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Interface de l'état de l'Error Boundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary pour capturer et gérer les erreurs React
 * 
 * Fonctionnalités :
 * - Capture automatique des erreurs JavaScript
 * - Interface utilisateur de secours élégante
 * - Boutons de récupération (actualiser/accueil)
 * - Logging des erreurs pour le débogage
 * - Design cohérent avec le thème médical
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Méthode statique pour capturer les erreurs
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Met à jour l'état pour afficher l'interface de secours
    return { hasError: true, error };
  }

  /**
   * Méthode pour capturer les informations d'erreur
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
    
    // Mise à jour de l'état avec les informations d'erreur
    this.setState({
      error,
      errorInfo
    });

    // Ici, vous pourriez envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
  }

  /**
   * Méthode pour réinitialiser l'état d'erreur
   */
  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  /**
   * Méthode pour recharger la page
   */
  reloadPage = () => {
    window.location.reload();
  };

  /**
   * Méthode pour retourner à l'accueil
   */
  goHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Interface utilisateur de secours personnalisée
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface de secours par défaut
      return (
        <div className="min-h-screen bg-medical-light flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Icône d'erreur */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
            </div>

            {/* Titre et message d'erreur */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oups ! Quelque chose s'est mal passé
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Une erreur inattendue s'est produite. Nos équipes ont été notifiées 
              et travaillent à résoudre le problème.
            </p>

            {/* Détails de l'erreur en mode développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Détails de l'erreur :
                </p>
                <code className="text-xs text-red-600 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button 
                onClick={this.resetError}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              
              <Button 
                onClick={this.reloadPage}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser la page
              </Button>
              
              <Button 
                onClick={this.goHome}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            {/* Message de support */}
            <p className="text-xs text-gray-500 mt-6">
              Si le problème persiste, contactez notre support technique.
            </p>
          </div>
        </div>
      );
    }

    // Rendu normal des enfants si pas d'erreur
    return this.props.children;
  }
}

/**
 * Hook pour utiliser l'Error Boundary de manière fonctionnelle
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
