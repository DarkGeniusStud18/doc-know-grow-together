
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const EmailConfirmation: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const access_token = queryParams.get('access_token');
        const refresh_token = queryParams.get('refresh_token');
        const type = queryParams.get('type');

        if (!access_token || !type) {
          setVerificationStatus('error');
          return;
        }

        // Set the session if available
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error setting session:', error);
            setVerificationStatus('error');
            return;
          }
        }

        // If the type is signup_email_confirmation, the email has been verified successfully
        if (type === 'signup') {
          setVerificationStatus('success');
          toast.success("Email vérifié avec succès!", {
            description: "Votre compte est maintenant activé. Vous pouvez vous connecter."
          });
          
          // Automatically redirect to login after a short delay
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 5000);
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setVerificationStatus('error');
      }
    };

    confirmEmail();
  }, [location, navigate]);

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
