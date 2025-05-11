
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import MainLayout from '@/components/layout/MainLayout';

const Settings = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
