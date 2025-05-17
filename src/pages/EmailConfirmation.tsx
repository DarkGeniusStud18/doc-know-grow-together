
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Composant qui gère la confirmation d'email après inscription
 * Vérifie le token dans l'URL et confirme l'activation du compte
 */
const EmailConfirmation: React.FC = () => {
  // État pour suivre le statut de la vérification
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        console.log("Email confirmation path:", location.pathname);
        console.log("Email confirmation search:", location.search);
        console.log("Email confirmation hash:", location.hash);
        
        // For email confirmations, Supabase adds a hash fragment that contains the tokens
        // Supabase client will automatically handle this when we check the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setVerificationStatus('error');
          return;
        }
        
        if (data.session) {
          console.log('Session found, email verified successfully');
          setVerificationStatus('success');
          
          // Store the session for the app
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
          
          toast.success("Email vérifié avec succès!", {
            description: "Votre compte est maintenant activé. Vous pouvez vous connecter."
          });
          
          // Redirection automatique vers la connexion après un court délai
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 5000);
        } else {
          // If no session, look for confirmation type in URL
          const queryParams = new URLSearchParams(location.search);
          const type = queryParams.get('type');
          
          if (type === 'signup' || type === 'signup_email_confirmation') {
            console.log('Found signup confirmation type in URL');
            setVerificationStatus('success');
          } else {
            console.error('No valid session or confirmation type found');
            setVerificationStatus('error');
          }
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setVerificationStatus('error');
      }
    };

    confirmEmail();
  }, [location, navigate]);

  // Rendu conditionnel selon le statut de vérification
  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-blue/10 to-medical-teal/10 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-medical-navy">MedCollab</h1>
          <p className="text-gray-600 mt-2">La plateforme pour les professionnels de santé</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Confirmation d'Email</CardTitle>
            <CardDescription>
              Vérification de votre adresse email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            {verificationStatus === 'verifying' && (
              <>
                <Loader2 className="h-16 w-16 text-medical-blue animate-spin mb-4" />
                <p className="text-center text-gray-600">
                  Vérification de votre email en cours...
                </p>
              </>
            )}
            
            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Email vérifié avec succès!</h2>
                <p className="text-center text-gray-600">
                  Votre email a été vérifié avec succès. Votre compte est maintenant activé.
                </p>
                <p className="text-center text-gray-600 mt-2">
                  Vous allez être redirigé vers la page de connexion...
                </p>
              </>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Erreur de vérification</h2>
                <p className="text-center text-gray-600">
                  Nous n'avons pas pu vérifier votre email. Le lien pourrait être expiré ou invalide.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {verificationStatus === 'success' && (
              <Button asChild className="w-full">
                <Link to="/login">Se connecter maintenant</Link>
              </Button>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <Button asChild className="w-full">
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button variant="outline" asChild className="w-full mt-2">
                  <Link to="/register">Créer un compte</Link>
                </Button>
              </>
            )}
            
            <Button variant="link" asChild className="w-full">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;
