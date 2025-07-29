/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/lib/auth/types';
import { Loader2, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

const registerSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
  confirmPassword: z.string(),
  displayName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  role: z.enum(['student', 'professional']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = React.useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      role: 'student',
    },
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const success = await register(
        data.email, 
        data.password, 
        data.role as UserRole, 
        data.displayName
      );
      
      if (success) {
        setShowVerifyAlert(true);
        // No automatic navigation - let user read the verification alert
        form.reset();
      }
    } catch (error: any) {
      toast.error('Erreur d\'inscription', { 
        description: error.message || 'Veuillez réessayer plus tard.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🌟 Inscription via Google OAuth
   */
  const handleGoogleSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('❌ Erreur Google OAuth:', error);
        toast.error('Erreur d\'inscription Google', {
          description: error.message
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur Google OAuth:', error);
      toast.error('Erreur d\'inscription Google');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📘 Inscription via Facebook OAuth  
   */
  const handleFacebookSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('❌ Erreur Facebook OAuth:', error);
        toast.error('Erreur d\'inscription Facebook', {
          description: error.message
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur Facebook OAuth:', error);
      toast.error('Erreur d\'inscription Facebook');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-[calc(100vh-120px)] md:min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">
        <Card className="w-full max-w-md animate-fade-in shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Remplissez le formulaire pour créer votre compte MedCollab
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showVerifyAlert && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Mail className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">Vérifiez votre email</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte mail et cliquer sur le lien pour activer votre compte. 
                  Vous ne pourrez pas vous connecter avant d'avoir vérifié votre email.
                </AlertDescription>
              </Alert>
            )}
            
            {!showVerifyAlert && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Jean Dupont" 
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Je suis</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            disabled={isLoading}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="student" className="transition-transform hover:scale-110" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer transition-colors hover:text-medical-blue">
                                Étudiant en médecine
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="professional" className="transition-transform hover:scale-110" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer transition-colors hover:text-medical-blue">
                                Professionnel de santé
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full hover:bg-medical-teal transition-all duration-300 hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      'S\'inscrire'
                    )}
                  </Button>
                </form>
              </Form>
            )}
            
            {/* 🌐 Connexions sociales (Google, Facebook) */}
            {!showVerifyAlert && (
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-center text-sm text-gray-500 mb-4">
                  Ou s'inscrire avec
                </p>
                
                <div className="space-y-2">
                  {/* 🌟 Inscription Google */}
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 hover:bg-red-50"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </Button>

                  {/* 📘 Inscription Facebook */}
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 hover:bg-blue-50"
                    onClick={handleFacebookSignUp}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Vous avez déjà un compte?</span>{' '}
              <Link to="/login" className="text-medical-teal hover:underline font-medium transition-colors hover:text-medical-blue">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;
