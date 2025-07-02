
/**
 * 🚀 Page de Démarrage (Splash Screen) - Version Professionnelle
 * Animation fluide avec logo et navigation automatique
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [animationPhase, setAnimationPhase] = useState<'logo' | 'text' | 'complete'>('logo');

  useEffect(() => {
    // Séquence d'animation
    const timer1 = setTimeout(() => setAnimationPhase('text'), 1000);
    const timer2 = setTimeout(() => setAnimationPhase('complete'), 2000);
    
    // Navigation automatique après l'animation
    const timer3 = setTimeout(() => {
      if (!loading) {
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue via-medical-teal to-medical-blue flex items-center justify-center overflow-hidden">
      {/* Animations de fond */}
      <div className="absolute inset-0">
        {/* Cercles animés */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-white/5 rounded-full animate-ping"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo animé */}
        <div 
          className={`
            transition-all duration-1000 ease-out
            ${animationPhase === 'logo' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
          `}
        >
          <div className="relative">
            {/* Logo principal */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 animate-spin">
                <div className="text-4xl font-bold text-medical-blue">M</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-medical-teal to-medical-blue rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-4xl font-bold text-white">M</div>
              </div>
            </div>

            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>
        </div>

        {/* Texte animé */}
        <div 
          className={`
            transition-all duration-1000 ease-out delay-500
            ${animationPhase === 'text' || animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
            MedCollab
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Votre plateforme d'étude médicale
          </p>
        </div>

        {/* Barre de progression */}
        <div 
          className={`
            transition-all duration-1000 ease-out delay-1000
            ${animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white to-medical-yellow rounded-full animate-pulse"></div>
          </div>
          <p className="text-white/70 text-sm mt-4 animate-pulse">
            Chargement de votre espace d'étude...
          </p>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 bg-white/40 rounded-full
                animate-bounce
              `}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Indicateur de chargement en bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Splash;
