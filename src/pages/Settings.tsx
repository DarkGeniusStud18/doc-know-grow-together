
// Page principale des paramètres de l'application - Version mobile optimisée
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import MainLayout from '@/components/layout/MainLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import PerformanceSettings from '@/components/settings/PerformanceSettings';
import RoleSwitcher from '@/components/profile/RoleSwitcher';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getSubscriptionDetails } from '@/lib/auth/services/subscription-service';
import { useQuery } from '@tanstack/react-query';
import { 
  User, CreditCard, Bell, Palette, Gauge, 
  ChevronLeft, Settings as SettingsIcon,
  Shield, Moon, Sun
} from 'lucide-react';

/**
 * Page des paramètres utilisateur qui regroupe toutes les catégories de réglages
 * Version responsive optimisée pour mobile et tablette
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
      <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl font-bold">⚙️ Paramètres</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          {/* 📱 Onglets responsive optimisés mobile avec scroll horizontal */}
          <div className="w-full overflow-x-auto mb-4 sm:mb-6">
            <TabsList className="flex w-max sm:w-full min-w-max sm:min-w-0 bg-muted p-1 rounded-lg h-auto">
              <TabsTrigger value="profile" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                👤 Profil
              </TabsTrigger>
              <TabsTrigger value="account" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                🔐 Compte
              </TabsTrigger>
              <TabsTrigger value="subscription" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                👑 Premium
              </TabsTrigger>
              <TabsTrigger value="notifications" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                🔔 Notifs
              </TabsTrigger>
              <TabsTrigger value="display" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                🎨 Thème
              </TabsTrigger>
              <TabsTrigger value="performance" className="whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base flex-shrink-0">
                ⚡ Perf
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-0">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 sm:space-y-6 mt-0">
            <AccountSettings />
            <RoleSwitcher inSettings />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 sm:space-y-6 mt-0">
            <Card className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Abonnement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Veuillez vous connecter pour voir les informations d'abonnement
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Statut actuel</p>
                        <p className="text-base sm:text-lg font-semibold">
                          {isPremium 
                            ? <span className="text-green-600">Premium</span> 
                            : <span className="text-gray-600">Gratuit</span>
                          }
                        </p>
                      </div>
                      {isPremium && subscription?.expiryDate && (
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Date d'expiration</p>
                          <p className="text-base sm:text-lg font-semibold">
                            {formatExpiryDate(subscription.expiryDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 sm:p-6 rounded-lg border">
                      <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                        {isPremium 
                          ? "Vous bénéficiez de tous les avantages premium" 
                          : "Passez à l'abonnement premium pour débloquer toutes les fonctionnalités"
                        }
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {isPremium
                          ? "Accédez à toutes les ressources premium, cas cliniques exclusifs et fonctionnalités avancées."
                          : "Accédez aux ressources exclusives, cas cliniques détaillés et outils avancés pour votre formation médicale."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/subscription">
                    {isPremium ? "Gérer mon abonnement" : "Découvrir nos offres"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-0">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4 sm:space-y-6 mt-0">
            <DisplaySettings />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 sm:space-y-6 mt-0">
            <PerformanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
