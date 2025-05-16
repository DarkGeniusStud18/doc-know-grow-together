
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, XCircle, Loader2, LockKeyhole } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const passwordSchema = z.object({
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PasswordRecovery: React.FC = () => {
  const [recoveryStatus, setRecoveryStatus] = useState<'verifying' | 'ready' | 'success' | 'error'>('verifying');
  const location = useLocation();
  const navigate = useNavigate();
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const verifyRecoveryToken = async () => {
      try {
        // Get token from URL
        const queryParams = new URLSearchParams(location.search);
        const access_token = queryParams.get('access_token');
        const refresh_token = queryParams.get('refresh_token');
        const type = queryParams.get('type');

        if (!access_token || !type || type !== 'recovery') {
          setRecoveryStatus('error');
          return;
        }

        // Set session if tokens are present
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error setting session:', error);
            setRecoveryStatus('error');
            return;
          }
          
          setRecoveryStatus('ready');
        } else {
          setRecoveryStatus('error');
        }
      } catch (error) {
        console.error('Error verifying recovery token:', error);
        setRecoveryStatus('error');
      }
    };

    verifyRecoveryToken();
  }, [location]);

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error('Erreur lors de la mise à jour du mot de passe', {
          description: error.message
        });
        return;
      }
      
      setRecoveryStatus('success');
      toast.success('Mot de passe mis à jour avec succès');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error in password update:', error);
      toast.error('Une erreur est survenue', {
        description: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-blue/10 to-medical-teal/10 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-medical-navy">MedCollab</h1>
          <p className="text-gray-600 mt-2">La plateforme pour les professionnels de santé</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Créez un nouveau mot de passe pour votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {recoveryStatus === 'verifying' && (
              <>
                <Loader2 className="h-16 w-16 text-medical-blue animate-spin mb-4" />
                <p className="text-center text-gray-600">
                  Vérification de votre lien de récupération...
                </p>
              </>
            )}
            
            {recoveryStatus === 'ready' && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="********" 
                            type="password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********" 
                            type="password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full mt-6">
                    {form.formState.isSubmitting ? 
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mise à jour...</> : 
                      'Mettre à jour le mot de passe'
                    }
                  </Button>
                </form>
              </Form>
            )}
            
            {recoveryStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Mot de passe mis à jour!</h2>
                <p className="text-center text-gray-600">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
                <p className="text-center text-gray-600 mt-2">
                  Vous allez être redirigé vers la page de connexion...
                </p>
              </>
            )}
            
            {recoveryStatus === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Lien invalide ou expiré</h2>
                <p className="text-center text-gray-600">
                  Le lien de réinitialisation de mot de passe est invalide ou a expiré.
                </p>
                <p className="text-center text-gray-600 mt-2">
                  Veuillez demander un nouveau lien de réinitialisation.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="link" asChild className="w-full">
              <Link to="/login">Retour à la connexion</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordRecovery;
