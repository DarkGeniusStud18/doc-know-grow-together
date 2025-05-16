
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/password-recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast.error('Erreur lors de la demande de réinitialisation', {
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
            <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
            <CardDescription className="text-center">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Mail className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">Vérifiez votre email</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.
                  Vérifiez votre boîte mail et suivez les instructions.
                </AlertDescription>
              </Alert>
            ) : (
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
                  
                  <Button 
                    type="submit" 
                    className="w-full hover:bg-medical-teal transition-all duration-300 hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-medical-teal hover:underline font-medium transition-colors hover:text-medical-blue flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
