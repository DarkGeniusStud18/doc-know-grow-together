
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { LogOut, Mail, User, Shield, Briefcase, School, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleSaveProfile = () => {
    // In a real app, this would update the user's profile
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès."
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Accès non autorisé</h1>
            <p className="text-gray-500 mb-4">Vous devez être connecté pour accéder à cette page.</p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - User info card */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
                    <AvatarFallback className="bg-medical-blue text-white text-2xl">
                      {user.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.displayName}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-medical-blue" />
                  <div>
                    <p className="text-sm font-medium">Rôle</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                {user.university && (
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-medical-blue" />
                    <div>
                      <p className="text-sm font-medium">Université</p>
                      <p className="text-sm text-gray-500">{user.university}</p>
                    </div>
                  </div>
                )}
                
                {user.specialty && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-medical-blue" />
                    <div>
                      <p className="text-sm font-medium">Spécialité</p>
                      <p className="text-sm text-gray-500">{user.specialty}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {user.kycStatus === 'verified' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Statut de vérification</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {user.kycStatus === 'verified' ? 'Vérifié' : 'Non vérifié'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {user.kycStatus !== 'verified' && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/kyc">Vérifier mon identité</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Edit profile and other information */}
          <div className="md:col-span-2">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
