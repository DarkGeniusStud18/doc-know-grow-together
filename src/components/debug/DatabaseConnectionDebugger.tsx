
/**
 * Composant de débogage pour les connexions de base de données
 * Permet de tester et visualiser l'état des connexions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Database, Loader2 } from 'lucide-react';
import { useConnectionVerifier } from '@/hooks/useConnectionVerifier';

export const DatabaseConnectionDebugger: React.FC = () => {
  const {
    isVerifying,
    verificationResults,
    verifyAllConnections,
    resetResults,
    hasErrors,
    successCount,
    errorCount
  } = useConnectionVerifier();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Débogueur de Connexions Base de Données
        </CardTitle>
        <CardDescription>
          Vérifiez l'état des connexions et des politiques RLS
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Contrôles */}
        <div className="flex gap-2">
          <Button
            onClick={verifyAllConnections}
            disabled={isVerifying}
            className="flex items-center gap-2"
          >
            {isVerifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isVerifying ? 'Vérification...' : 'Vérifier Connexions'}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetResults}
            disabled={isVerifying || verificationResults.length === 0}
          >
            Réinitialiser
          </Button>
        </div>

        {/* Résumé des résultats */}
        {verificationResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{successCount}</p>
                    <p className="text-sm text-gray-600">Connexions OK</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">{errorCount}</p>
                    <p className="text-sm text-gray-600">Erreurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{verificationResults.length}</p>
                    <p className="text-sm text-gray-600">Tests Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Résultats détaillés */}
        {verificationResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Résultats Détaillés</h3>
            <div className="grid gap-2">
              {verificationResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : result.status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                    <span className="font-mono text-sm">{result.table}</span>
                    <Badge variant="outline" className="text-xs">
                      {result.operation}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        result.status === 'success' 
                          ? 'default' 
                          : result.status === 'error' 
                          ? 'destructive' 
                          : 'secondary'
                      }
                    >
                      {result.status}
                    </Badge>
                    {result.error && (
                      <span className="text-xs text-red-600 max-w-xs truncate">
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* État général */}
        {verificationResults.length > 0 && (
          <div className={`p-4 rounded-lg border-l-4 ${
            hasErrors 
              ? 'bg-red-50 border-red-400' 
              : 'bg-green-50 border-green-400'
          }`}>
            <div className="flex items-center gap-2">
              {hasErrors ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <p className="font-medium">
                {hasErrors 
                  ? 'Certaines connexions ont échoué'
                  : 'Toutes les connexions sont fonctionnelles'
                }
              </p>
            </div>
            {hasErrors && (
              <p className="text-sm text-gray-600 mt-1">
                Vérifiez les politiques RLS et les permissions utilisateur
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
