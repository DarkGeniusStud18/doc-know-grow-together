
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const SplashScreen: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animation d'entrée du logo
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Navigation automatique après l'animation
    const navigationTimer = setTimeout(() => {
      if (!loading) {
        setFadeOut(true);
        setTimeout(() => {
          if (user) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }, 500);
      }
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigationTimer);
    };
  }, [user, loading, navigate]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-medical-blue via-medical-teal to-medical-navy flex items-center justify-center transition-opacity duration-500 z-50 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Cercles d'animation en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/15 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Logo principal avec animations */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Logo animé */}
        <div className={`relative transition-all duration-1000 ${showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="relative">
            {/* Cercle externe pulsant */}
            <div className="absolute inset-0 w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
            
            {/* Logo principal */}
            <div className="relative w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/f579baa8-4c1b-4195-97f4-055d6ffcbd4d.png" 
                alt="MedCollab Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            
            {/* Points orbitaux */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-500"></div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-1000"></div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-1500"></div>
            </div>
          </div>
        </div>

        {/* Texte de l'application */}
        <div className={`text-center space-y-2 transition-all duration-1000 delay-500 ${showLogo ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-4xl font-bold text-white tracking-wide">
            MedCollab
          </h1>
          <p className="text-white/80 text-lg font-light">
            Plateforme Médicale Collaborative
          </p>
          
          {/* Barre de progression */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-white rounded-full animate-[loading_2s_ease-in-out]"></div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% { width: 0% }
            50% { width: 60% }
            100% { width: 100% }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
