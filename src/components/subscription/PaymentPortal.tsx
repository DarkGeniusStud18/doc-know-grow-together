
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { activateSubscription } from '@/lib/auth/services/subscription-service';

// IMPORTANT: This is a test payment portal for development purposes only.
// Replace this component with your actual payment provider integration.
// For example, integrate Stripe, PayPal, or another payment processor here.

interface PaymentPortalProps {
  planType: 'monthly' | 'annual';
  onCancel: () => void;
  onSuccess: () => void;
}

const PaymentPortal: React.FC<PaymentPortalProps> = ({ planType, onCancel, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('creditCard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  // Calculate plan details based on type
  const planDetails = planType === 'monthly' 
    ? { name: 'Abonnement Mensuel', price: '9,99€', duration: 1 } 
    : { name: 'Abonnement Annuel', price: '99,99€', duration: 12 };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  // Simulate payment processing
  const handleSubmitPayment = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour vous abonner');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate a payment process delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful payment confirmation
      // This is where you would integrate with your actual payment processor
      // REPLACE THIS WITH REAL PAYMENT PROCESSING LOGIC
      
      // After successful payment, update the user's subscription status
      const success = await activateSubscription(
        user.id, 
        planType === 'monthly' ? 1 : 12
      );
      
      if (success) {
        toast.success('Paiement réussi! Votre abonnement est maintenant actif.');
        onSuccess();
      } else {
        throw new Error('Échec de l\'activation de l\'abonnement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Portail de Paiement</CardTitle>
          <CardDescription>
            {`Vous allez souscrire au ${planDetails.name} à ${planDetails.price}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creditCard" id="creditCard" />
                <Label htmlFor="creditCard" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  Carte de crédit/débit
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paypal"><path d="M7.144 19.532l1.049-5.751A3 3 0 0 1 11.106 11h5.054a3 3 0 0 0 2.15-.913l3.294-3.293c.72-.72.22-1.794-.7-2.714l-1.657-1.657a2.5 2.5 0 0 0-3.82.17L12.86 5.5H8.899a3 3 0 0 0-2.831 2.015L4 14"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/></svg>
                  PayPal
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobileMoney" id="mobileMoney" />
                <Label htmlFor="mobileMoney" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  Mobile Money
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'creditCard' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input 
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Nom sur la carte</Label>
                <Input 
                  id="cardholderName"
                  name="cardholderName"
                  placeholder="Jean Dupont"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input 
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'paypal' && (
            <div className="p-4 border rounded bg-gray-50 text-center">
              <p className="mb-3">Vous allez être redirigé vers PayPal pour finaliser votre paiement.</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paypal mx-auto"><path d="M7.144 19.532l1.049-5.751A3 3 0 0 1 11.106 11h5.054a3 3 0 0 0 2.15-.913l3.294-3.293c.72-.72.22-1.794-.7-2.714l-1.657-1.657a2.5 2.5 0 0 0-3.82.17L12.86 5.5H8.899a3 3 0 0 0-2.831 2.015L4 14"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/></svg>
            </div>
          )}
          
          {paymentMethod === 'mobileMoney' && (
            <div className="p-4 border rounded bg-gray-50">
              <div className="space-y-2 mb-4">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input 
                  id="phoneNumber"
                  placeholder="+229 56123456"
                />
              </div>
              <p className="text-sm text-gray-600">
                Un code sera envoyé à ce numéro pour confirmer le paiement.
              </p>
            </div>
          )}
          
          <div className="p-3 border rounded bg-amber-50 text-amber-800 text-sm">
            <p className="font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Portail de test
            </p>
            <p className="mt-1">
              Ceci est un portail de paiement factice à des fins de test. Aucun paiement réel ne sera traité.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handleSubmitPayment} disabled={isProcessing}>
            {isProcessing ? 'Traitement...' : `Payer ${planDetails.price}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPortal;
