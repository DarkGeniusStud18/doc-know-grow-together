
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import PaymentPortal from '@/components/subscription/PaymentPortal';
import { checkPremiumStatus, getSubscriptionDetails } from '@/lib/auth/services/subscription-service';
import { ArrowRight, Check, Lock } from 'lucide-react';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{ 
    status: string; 
    expiryDate: Date | null 
  } | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const premium = await checkPremiumStatus(user.id);
        setIsPremium(premium);
        
        const details = await getSubscriptionDetails(user.id);
        setSubscriptionDetails(details);
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionStatus();
  }, [user]);

  const handleSelectPlan = (plan: 'monthly' | 'annual') => {
    if (!user) {
      toast.error("Vous devez être connecté pour vous abonner");
      navigate("/login", { state: { from: "/subscription" } });
      return;
    }
    
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentOpen(false);
    // Refresh the subscription status
    if (user) {
      checkPremiumStatus(user.id).then(setIsPremium);
      getSubscriptionDetails(user.id).then(setSubscriptionDetails);
    }
  };

  // Format expiry date
  const formatExpiryDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3 text-medical-navy">
            Abonnement Premium MedCollab
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accédez à toutes les fonctionnalités et ressources exclusives pour optimiser votre parcours médical
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : (
          <>
            {isPremium && subscriptionDetails && (
              <Card className="mb-8 border-medical-teal bg-teal-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                    Votre abonnement Premium est actif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Vous avez accès à toutes les fonctionnalités Premium jusqu'au:
                    <span className="font-semibold ml-2">
                      {formatExpiryDate(subscriptionDetails.expiryDate)}
                    </span>
                  </p>
                  <p className="text-sm text-teal-600">
                    Profitez de tous les avantages exclusifs de votre abonnement!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="ml-auto" onClick={() => navigate('/dashboard')}>
                    Retour au tableau de bord
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Mensuel */}
              <Card className="relative overflow-hidden border-medical-blue">
                <div className="absolute top-0 right-0 -rotate-12 translate-x-5 -translate-y-5 bg-medical-blue text-white text-xs py-1 px-8 font-medium opacity-75">
                  Populaire
                </div>
                <CardHeader className="bg-medical-blue/10">
                  <CardTitle className="text-xl text-medical-navy">Abonnement Mensuel</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">9,99€</span>
                    <span className="text-gray-500 ml-1">/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Accès à toutes les ressources premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Cas cliniques exclusifs pour les professionnels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Annulation à tout moment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSelectPlan('monthly')} disabled={isPremium}>
                    {isPremium ? 'Déjà abonné' : "S'abonner maintenant"}
                    {!isPremium && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>

              {/* Plan Annuel */}
              <Card className="relative overflow-hidden border-medical-teal">
                <div className="absolute top-0 right-0 -rotate-12 translate-x-5 -translate-y-5 bg-medical-teal text-white text-xs py-1 px-8 font-medium opacity-75">
                  -17%
                </div>
                <CardHeader className="bg-medical-teal/10">
                  <CardTitle className="text-xl text-medical-navy">Abonnement Annuel</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">99,99€</span>
                    <span className="text-gray-500 ml-1">/an</span>
                    <div className="text-sm text-gray-500 mt-1">
                      <s>119,88€</s> <Badge className="ml-2 bg-green-600">Économisez 19,89€</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Tout ce qui est inclus dans l'offre mensuelle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>2 mois gratuits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Économisez 17% sur le prix mensuel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Accès anticipé aux nouvelles fonctionnalités</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSelectPlan('annual')} disabled={isPremium}>
                    {isPremium ? 'Déjà abonné' : "S'abonner maintenant"}
                    {!isPremium && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-medical-navy">
                <Lock className="h-5 w-5" />
                Fonctionnalités Premium
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fonctionnalité Premium 1 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Bibliothèque exclusive</h3>
                    <p className="text-gray-600">Accédez à des milliers de ressources pédagogiques supplémentaires et articles scientifiques.</p>
                  </CardContent>
                </Card>

                {/* Fonctionnalité Premium 2 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Réseautage avancé</h3>
                    <p className="text-gray-600">Connectez-vous avec des professionnels et étudiants dans votre domaine de spécialité.</p>
                  </CardContent>
                </Card>

                {/* Fonctionnalité Premium 3 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Cas cliniques avancés</h3>
                    <p className="text-gray-600">Explorez des cas cliniques complexes avec analyses détaillées par des experts.</p>
                  </CardContent>
                </Card>

                {/* Fonctionnalité Premium 4 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Simulateur d'examens</h3>
                    <p className="text-gray-600">Préparez-vous avec des examens personnalisés basés sur votre spécialité et niveau.</p>
                  </CardContent>
                </Card>

                {/* Fonctionnalité Premium 5 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Téléchargement illimité</h3>
                    <p className="text-gray-600">Téléchargez tous les documents et ressources pour y accéder hors ligne.</p>
                  </CardContent>
                </Card>

                {/* Fonctionnalité Premium 6 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Notes collaboratives</h3>
                    <p className="text-gray-600">Créez et partagez des notes avec d'autres professionnels et étudiants.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Puis-je annuler mon abonnement à tout moment ?</h4>
                  <p className="text-gray-600 mt-1">Oui, vous pouvez annuler votre abonnement à tout moment. Vous conserverez l'accès jusqu'à la fin de la période déjà payée.</p>
                </div>
                <div>
                  <h4 className="font-medium">Comment fonctionne la période d'essai ?</h4>
                  <p className="text-gray-600 mt-1">Nous offrons une période d'essai de 7 jours pour tous les nouveaux abonnés. Vous pouvez annuler avant la fin de cette période sans être facturé.</p>
                </div>
                <div>
                  <h4 className="font-medium">Quels moyens de paiement acceptez-vous ?</h4>
                  <p className="text-gray-600 mt-1">Nous acceptons les cartes de crédit/débit (Visa, Mastercard, American Express), PayPal, et les solutions de paiement mobile.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {paymentOpen && (
        <PaymentPortal 
          planType={selectedPlan}
          onCancel={() => setPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </MainLayout>
  );
};

export default Subscription;
