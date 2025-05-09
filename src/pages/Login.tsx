
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Erreur de connexion', { 
        description: 'Veuillez vérifier vos identifiants et réessayer.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemo = async (type: 'student' | 'professional') => {
    setIsLoading(true);
    try {
      if (type === 'student') {
        await login('student@example.com', 'password');
      } else {
        await login('doctor@example.com', 'password');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur de connexion', { 
        description: 'Veuillez réessayer plus tard.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        />
                      </FormControl>
                      <FormDescription>
                        <Link to="/forgot-password" className="text-xs text-medical-teal hover:underline">
                          Mot de passe oublié?
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
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
                >
                  Démo Étudiant
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemo('professional')}
                  disabled={isLoading}
                >
                  Démo Médecin
                </Button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Vous n'avez pas de compte?</span>{' '}
                <Link to="/register" className="text-medical-teal hover:underline font-medium">
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
