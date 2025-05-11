
// Composant de gestion des paramètres de notification
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Paramètres des notifications utilisateur
 */
const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configurez comment et quand vous souhaitez être notifié.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Emails</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center p-1 cursor-pointer">
              <div className="h-4 w-4 rounded-full bg-white shadow"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications push</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications push</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-medical-teal flex items-center p-1 justify-end cursor-pointer">
              <div className="h-4 w-4 rounded-full bg-white shadow"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
