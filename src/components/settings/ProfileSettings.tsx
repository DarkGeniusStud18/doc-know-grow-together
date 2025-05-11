
// Composant de gestion des paramètres du profil
import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Paramètres du profil utilisateur avec possibilité de modifier l'avatar et les infos de base
 */
const ProfileSettings = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>
          Gérer les informations de votre profil visible par les autres utilisateurs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.displayName} />
              <AvatarFallback className="bg-medical-teal text-xl">
                {user?.displayName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Changer</Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom d'affichage</label>
                <input
                  type="text"
                  defaultValue={user?.displayName}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              
              {user?.role === 'student' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Université</label>
                  <input
                    type="text"
                    defaultValue={user?.university}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialité</label>
                <input
                  type="text"
                  defaultValue={user?.specialty}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <Button>Sauvegarder les modifications</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
