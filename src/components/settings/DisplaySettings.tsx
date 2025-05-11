
// Composant de gestion des paramètres d'affichage
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Paramètres d'apparence et d'affichage de l'application
 */
const DisplaySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affichage</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Thème</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-2 flex items-center justify-center text-center cursor-pointer hover:border-medical-teal">
                <div>
                  <div className="h-8 w-full mb-2 bg-white border"></div>
                  <span className="text-sm">Clair</span>
                </div>
              </div>
              <div className="border rounded p-2 flex items-center justify-center text-center cursor-pointer hover:border-medical-teal">
                <div>
                  <div className="h-8 w-full mb-2 bg-gray-800"></div>
                  <span className="text-sm">Sombre</span>
                </div>
              </div>
              <div className="border rounded p-2 flex items-center justify-center text-center cursor-pointer hover:border-medical-teal border-medical-teal">
                <div>
                  <div className="h-8 w-full mb-2 bg-gradient-to-r from-white to-gray-800"></div>
                  <span className="text-sm">Système</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
