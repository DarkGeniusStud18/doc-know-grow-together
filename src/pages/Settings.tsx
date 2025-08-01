
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
        {/* 📱 En-tête mobile optimisé avec bouton retour */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <ChevronLeft 
            className="h-5 w-5 sm:hidden cursor-pointer text-muted-foreground hover:text-foreground transition-colors" 
            onClick={() => window.history.back()}
          />
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-medical-teal" />
            <h1 className="text-lg sm:text-2xl font-bold text-medical-navy">
              Paramètres
            </h1>
          </div>
        </div>

        {/* 📱 Indicateur de statut utilisateur mobile */}
        <div className="bg-gradient-to-r from-medical-teal/10 to-medical-navy/10 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-medical-teal/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-medical-teal" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">{user?.email?.split('@')[0] || 'Utilisateur'}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isPremium ? '👑 Compte Premium' : '🆓 Compte Gratuit'}
                </p>
              </div>
            </div>
            <Badge variant={isPremium ? "default" : "secondary"} className="text-xs">
              {isPremium ? 'Premium' : 'Gratuit'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          {/* 📱 Onglets responsive optimisés mobile avec scroll horizontal amélioré */}
          <div className="w-full overflow-x-auto mb-4 sm:mb-6 scrollbar-hide">
            <TabsList className="flex w-max sm:w-full min-w-max sm:min-w-0 bg-gradient-to-r from-medical-teal/5 to-medical-navy/5 p-1 rounded-xl h-auto shadow-sm border border-medical-teal/10">
              <TabsTrigger 
                value="profile" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Compte</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Premium</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Notifs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="display" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Thème</span>
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex-shrink-0 gap-1.5 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-medical-navy data-[state=active]:shadow-sm"
              >
                <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Perf</span>
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
            <Card className="w-full overflow-hidden border border-medical-teal/20">
              <CardHeader className="pb-4 bg-gradient-to-r from-medical-teal/5 to-medical-navy/5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-medical-teal" />
                  <CardTitle className="text-lg sm:text-xl text-medical-navy">Gestion de l'abonnement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                {!user ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <User className="h-8 w-8 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Veuillez vous connecter pour voir les informations d'abonnement
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {/* 📊 Carte de statut premium/gratuit mobile-friendly */}
                    <div className="bg-gradient-to-r from-medical-teal/10 to-medical-navy/10 p-4 rounded-lg border border-medical-teal/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${isPremium ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm font-medium">Statut actuel</span>
                        </div>
                        <Badge 
                          variant={isPremium ? "default" : "secondary"} 
                          className={`text-xs px-2 py-1 ${isPremium ? 'bg-medical-teal text-white' : ''}`}
                        >
                          {isPremium ? '👑 Premium' : '🆓 Gratuit'}
                        </Badge>
                      </div>
                      
                      {/* 📅 Informations d'expiration si premium */}
                      {isPremium && subscription?.expiryDate && (
                        <div className="text-xs text-muted-foreground border-t border-medical-teal/10 pt-2">
                          <span>Expire le: {formatExpiryDate(subscription.expiryDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 🎯 Avantages premium responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white border border-medical-teal/20 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-xs sm:text-sm font-medium">Cas cliniques premium</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Accès illimité aux cas avancés</p>
                      </div>
                      
                      <div className="bg-white border border-medical-teal/20 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-xs sm:text-sm font-medium">Support prioritaire</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Assistance dédiée 24/7</p>
                      </div>
                      
                      <div className="bg-white border border-medical-teal/20 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-xs sm:text-sm font-medium">Stockage illimité</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Notes et documents sans limite</p>
                      </div>
                      
                      <div className="bg-white border border-medical-teal/20 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-xs sm:text-sm font-medium">Outils avancés</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Calculateurs et simulations</p>
                      </div>
                    </div>
                    
                    {/* 💡 Message promotionnel/informatif responsive */}
                    <div className={`p-4 sm:p-6 rounded-lg border ${isPremium 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950' 
                      : 'bg-gradient-to-r from-medical-teal/5 to-medical-navy/5 border-medical-teal/20'
                    }`}>
                      <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                        {isPremium ? (
                          <>
                            <span className="text-green-600">✨</span>
                            Vous profitez de tous les avantages premium
                          </>
                        ) : (
                          <>
                            <span className="text-medical-teal">🚀</span>
                            Débloquez votre potentiel médical
                          </>
                        )}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {isPremium
                          ? "Continuez à exceller dans vos études avec l'accès complet à tous nos outils premium et ressources exclusives."
                          : "Rejoignez des milliers d'étudiants et professionnels qui utilisent nos outils premium pour réussir leurs examens et leur carrière."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 bg-gray-50/50 dark:bg-gray-900/50 px-4 sm:px-6">
                <Button asChild className="w-full bg-medical-teal hover:bg-medical-navy transition-colors">
                  <Link to="/subscription" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {isPremium ? "Gérer mon abonnement" : "Découvrir Premium"}
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
