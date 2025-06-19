
// Composant pour éditer les informations du profil
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

/**
 * Formulaire d'édition des informations du profil utilisateur
 */
const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  if (!user) return null;

  const handleSaveProfile = () => {
    // Dans une vraie app, ceci mettrait à jour le profil de l'utilisateur
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès."
    });
    setIsEditing(false);
  };

  return (
    <Card className="shadow-md mb-6">
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="displayName">Nom d'affichage</Label>
              <Input 
                type="text" 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
              />
            </div>
            
            {user.role === 'student' && (
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="university">Université</Label>
                <Input 
                  type="text" 
                  id="university" 
                  defaultValue={user.university || ''} 
                />
              </div>
            )}
            
            {user.role === 'professional' && (
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="specialty">Spécialité</Label>
                <Input 
                  type="text" 
                  id="specialty" 
                  defaultValue={user.specialty || ''} 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nom d'affichage</p>
              <p>{user.displayName}</p>
            </div>
            
            {user.role === 'student' && user.university && (
              <div>
                <p className="text-sm font-medium text-gray-500">Université</p>
                <p>{user.university}</p>
              </div>
            )}
            
            {user.role === 'professional' && user.specialty && (
              <div>
                <p className="text-sm font-medium text-gray-500">Spécialité</p>
                <p>{user.specialty}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
            <Button onClick={handleSaveProfile}>Enregistrer</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Modifier</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileEditor;
