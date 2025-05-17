/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

/**
 * Schéma de validation du formulaire de connexion
 */
const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
});

/**
 * Type dérivé du schéma de validation
 */
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Page de connexion avec formulaire et options de connexion rapide (démo)
 */
const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Check for query parameters like verified=true
  const searchParams = new URLSearchParams(location.search);
  const verified = searchParams.get('verified') === 'true';
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        setLoginError('Échec de la connexion. Vérifiez vos identifiants et réessayez.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Une erreur s\'est produite lors de la connexion');
      toast.error('Erreur de connexion', { 
        description: error.message || 'Veuillez vérifier vos identifiants et réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemo = async (type: 'student' | 'professional') => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      let success;
      if (type === 'student') {
        success = await login('student@example.com', 'password');
      } else {
        success = await login('doctor@example.com', 'password');
      }
      
      if (success) {
        toast.success('Connexion démo réussie');
        navigate('/dashboard');
      } else {
        setLoginError('Échec de la connexion démo. Veuillez réessayer.');
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      setLoginError(error.message || 'Une erreur s\'est produite lors de la connexion');
      toast.error('Erreur de connexion', { 
        description: error.message || 'Veuillez réessayer plus tard.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-[calc(100vh-120px)] md:min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">
        {verified && (
          <Alert className="max-w-md w-full mb-4 bg-green-50 border-green-200" variant="default">
            <Mail className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-700">Email vérifié</AlertTitle>
            <AlertDescription className="text-green-600">
              Votre email a été vérifié. Vous pouvez maintenant vous connecter.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="w-full max-w-md animate-fade-in shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
                <AlertDescription className="text-red-700">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com" 
                          type="email" 
                          {...field} 
                          disabled={isLoading}
                          className="transition-all focus:ring-2 focus:ring-medical-teal hover:border-medical-teal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="********" 
                          type="password" 
                          {...field} 
                          disabled={isLoading}
                          className="transition-all focus:ring-2 focus:ring-medical-teal hover:border-medical-teal"
                        />
                      </FormControl>
                      <FormDescription>
                        <Link to="/forgot-password" className="text-xs text-medical-teal hover:underline transition-colors hover:text-medical-blue">
                          Mot de passe oublié?
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full hover:bg-medical-teal transition-colors duration-300 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleDemo('student')}
                  disabled={isLoading}
                  className="transition-all hover:scale-105 hover:shadow-md hover:bg-medical-light"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Démo Étudiant'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemo('professional')}
                  disabled={isLoading}
                  className="transition-all hover:scale-105 hover:shadow-md hover:bg-medical-light"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Démo Médecin'
                  )}
                </Button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Vous n'avez pas de compte?</span>{' '}
                <Link to="/register" className="text-medical-teal hover:underline font-medium transition-colors hover:text-medical-blue">
                  S'inscrire
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
