
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import DemoButtons from '@/components/auth/DemoButtons';
import VerificationAlert from '@/components/auth/VerificationAlert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { signInWithEmail, signInAsDemo, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const verified = searchParams.get('verified') === 'true';
  
  // Redirection IMMÉDIATE si déjà connecté - OPTIMISÉE
  useEffect(() => {
    if (!authLoading && user && !redirected) {
      console.log('✅ Login: Redirection immédiate vers dashboard');
      setRedirected(true);
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate, redirected]);
  
  const handleFormSubmit = async (data: { email: string; password: string }) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(data.email, data.password);
      
      if (!result.error) {
        console.log('✅ Login: Connexion réussie - redirection automatique');
        // La redirection sera gérée automatiquement par l'effet ci-dessus
      } else {
        toast.error('Erreur de connexion', { 
          description: 'Veuillez vérifier vos identifiants et réessayer.'
        });
      }
    } catch (error: any) {
      console.error('❌ Login: Erreur:', error);
      toast.error('Erreur de connexion', { 
        description: 'Veuillez vérifier vos identifiants et réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemo = async (type: 'student' | 'professional') => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInAsDemo(type);
      
      if (!result.error) {
        console.log('✅ Login: Connexion démo réussie - redirection automatique');
        // La redirection sera gérée automatiquement par l'effet ci-dessus
      } else {
        toast.error('Erreur de connexion démo');
      }
    } catch (error: any) {
      console.error('❌ Login: Erreur démo:', error);
      toast.error('Erreur de connexion démo');
    } finally {
      setIsLoading(false);
    }
  };

  // Écran de chargement MINIMAL - pas de "vérification" infinie
  if (authLoading) {
    return (
      <MainLayout requireAuth={false}>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-medical-blue" />
            <p className="text-lg text-gray-600">Connexion...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si déjà connecté, ne pas afficher le formulaire
  if (user) {
    return null;
  }
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4">
        {verified && <VerificationAlert />}
        
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            
            <DemoButtons onDemoLogin={handleDemo} isLoading={isLoading} />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Vous n'avez pas de compte?</span>{' '}
              <Link to="/register" className="text-medical-teal hover:underline font-medium">
                S'inscrire
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
