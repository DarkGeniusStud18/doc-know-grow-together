
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import DemoButtons from '@/components/auth/DemoButtons';
import VerificationAlert from '@/components/auth/VerificationAlert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const { signInWithEmail, signInAsDemo, user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  let navigate: any = null;
  let location: any = null;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    console.warn('React Router hooks not available, using fallback navigation');
  }
  
  const searchParams = new URLSearchParams(location?.search || '');
  const verified = searchParams.get('verified') === 'true';
  
  const safeNavigate = (path: string) => {
    if (navigate) {
      navigate(path, { replace: true });
    } else {
      window.location.href = path;
    }
  };
  
  // Redirection IMMÉDIATE et UNE SEULE FOIS
  useEffect(() => {
    if (!authLoading && user && !redirected) {
      console.log('✅ Login: Redirection immédiate et définitive vers dashboard');
      setRedirected(true);
      safeNavigate('/dashboard');
    }
  }, [user, authLoading, redirected]);
  
  const handleFormSubmit = async (data: { email: string; password: string }) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(data.email, data.password);
      
      if (!result.error) {
        console.log('✅ Login: Connexion réussie - redirection automatique');
        // La redirection sera gérée par l'effet ci-dessus
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
        // La redirection sera gérée par l'effet ci-dessus
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

  /**
   * 🌟 Connexion via Google OAuth
   */
  const handleGoogleSignIn = async () => {
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
        toast.error('Erreur de connexion Google', {
          description: error.message
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur Google OAuth:', error);
      toast.error('Erreur de connexion Google');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📘 Connexion via Facebook OAuth  
   */
  const handleFacebookSignIn = async () => {
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
        toast.error('Erreur de connexion Facebook', {
          description: error.message
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur Facebook OAuth:', error);
      toast.error('Erreur de connexion Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  // SUPPRESSION de l'écran de chargement - accès immédiat
  // Si l'utilisateur existe, ne pas afficher le formulaire
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
            
            {/* 🌐 Connexions sociales (Google, Facebook, WhatsApp) */}
            <div className="mt-6">
              <Separator className="my-4" />
              <p className="text-center text-sm text-gray-500 mb-4">
                Ou se connecter avec
              </p>
              
              <div className="space-y-2">
                {/* 🌟 Connexion Google */}
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 hover:bg-red-50"
                  onClick={handleGoogleSignIn}
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

                {/* 📘 Connexion Facebook */}
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 hover:bg-blue-50"
                  onClick={handleFacebookSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuer avec Facebook
                </Button>

                {/* 💬 Connexion WhatsApp */}
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 hover:bg-green-50"
                  onClick={() => toast.info('🔄 Connexion WhatsApp en cours d\'implémentation')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.384"/>
                  </svg>
                  Continuer avec WhatsApp
                </Button>
              </div>
            </div>
            
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
