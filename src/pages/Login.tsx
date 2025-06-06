
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
  
  // Check for query parameters like verified=true
  const searchParams = new URLSearchParams(location.search);
  const verified = searchParams.get('verified') === 'true';
  
  // Redirect if user is already logged in - but only after auth loading is complete
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  const handleFormSubmit = async (data: { email: string; password: string }) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', data.email);
      const result = await signInWithEmail(data.email, data.password);
      
      if (!result.error) {
        console.log('Login successful, navigating to dashboard...');
        // Force navigation after successful login
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('Login failed:', result.error);
        toast.error('Erreur de connexion', { 
          description: 'Veuillez vérifier vos identifiants et réessayer.'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
        console.log('Demo login successful, navigating to dashboard...');
        // Force navigation after successful demo login
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        toast.error('Erreur de connexion démo', { 
          description: 'Veuillez réessayer plus tard.' 
        });
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error('Erreur de connexion démo', { 
        description: 'Veuillez réessayer plus tard.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen only during initial auth check
  if (authLoading) {
    return (
      <MainLayout requireAuth={false}>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-lg text-gray-600">Vérification de la session...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If user is authenticated after loading is complete, don't render the form
  if (user) {
    return null;
  }
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-[calc(100vh-120px)] md:min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">
        {verified && <VerificationAlert />}
        
        <Card className="w-full max-w-md animate-fade-in shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <Link to="/register" className="text-medical-teal hover:underline font-medium transition-colors hover:text-medical-blue">
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
