
// Zone de danger pour le profil utilisateur
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';

/**
 * Section "Zone de danger" pour les actions sensibles comme la déconnexion
 */
const DangerZone = () => {
  const { logout } = useAuth();
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-red-500">Zone de danger</CardTitle>
        <CardDescription>
          Actions qui nécessitent une attention particulière
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Déconnexion</h3>
            <p className="text-sm text-gray-500">
              Déconnectez-vous de votre compte sur tous les appareils.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DangerZone;
