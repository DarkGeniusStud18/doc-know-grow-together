
// Composant de gestion des paramètres du compte
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Paramètres du compte utilisateur avec options de sécurité et suppression
 */
const AccountSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compte</CardTitle>
        <CardDescription>
          Gérer les paramètres de votre compte et les options de sécurité.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Changer de mot de passe</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Mot de passe actuel</label>
                <input type="password" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium">Nouveau mot de passe</label>
                <input type="password" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium">Confirmer le mot de passe</label>
                <input type="password" className="w-full p-2 border rounded-md" />
              </div>
            </div>
            <Button className="mt-2">Changer le mot de passe</Button>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-red-600">Zone de danger</h3>
            <p className="text-sm text-gray-500 mt-1">
              Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain.
            </p>
            <Button variant="destructive" className="mt-2">Supprimer mon compte</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
