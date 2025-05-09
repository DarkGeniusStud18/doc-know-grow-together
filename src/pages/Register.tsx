
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/lib/auth-utils';
import { Loader2, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      }
    } catch (error: any) {
      toast.error('Erreur d\'inscription', { 
        description: error.message || 'Veuillez réessayer plus tard.' 
      });
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
