
// Page principale des paramètres de l'application
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from '@/components/layout/MainLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import PerformanceSettings from '@/components/settings/PerformanceSettings';
import RoleSwitcher from '@/components/profile/RoleSwitcher';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionDetails } from '@/lib/auth/services/subscription-service';
import { useQuery } from '@tanstack/react-query';

/**
 * Page des paramètres utilisateur qui regroupe toutes les catégories de réglages
 */
const Settings = () => {
  const { user } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ['subscriptionDetails', user?.id],
    queryFn: async () => user ? getSubscriptionDetails(user.id) : null,
    enabled: !!user
  });

  // Format expiry date
  const formatExpiryDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const isPremium = subscription?.status === 'premium' && 
    (subscription?.expiryDate === null || new Date(subscription.expiryDate) > new Date());

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="subscription">Abonnement</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
            <RoleSwitcher inSettings />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Abonnement</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-4">
                    <p>Veuillez vous connecter pour voir les informations d'abonnement</p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-500 text-sm">Statut actuel</p>
                        <p className="font-medium">
                          {isPremium 
                            ? <span className="text-green-600">Premium</span> 
                            : <span className="text-gray-600">Gratuit</span>
                          }
                        </p>
                      </div>
                      {isPremium && subscription?.expiryDate && (
                        <div>
                          <p className="text-gray-500 text-sm">Date d'expiration</p>
                          <p className="font-medium">{formatExpiryDate(subscription.expiryDate)}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">
                          {isPremium 
                            ? "Vous bénéficiez de tous les avantages premium" 
                            : "Passez à l'abonnement premium pour débloquer toutes les fonctionnalités"
                          }
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {isPremium
                            ? "Accédez à toutes les ressources premium, cas cliniques exclusifs et fonctionnalités avancées."
                            : "Accédez aux ressources exclusives, cas cliniques détaillés et outils avancés pour votre formation médicale."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/subscription">
                    {isPremium ? "Gérer mon abonnement" : "Découvrir nos offres"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
            <DisplaySettings />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
