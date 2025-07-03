
/**
 * 🚀 Page de Démarrage (Splash Screen) - Animation Professionnelle
 * 
 * Fonctionnalités :
 * - Logo animé avec effets visuels avancés
 * - Animation fluide et professionnelle
 * - Navigation automatique selon l'état utilisateur
 * - Design responsive pour tous les écrans
 * - Préchargement des ressources critiques
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Stethoscope, Heart, Brain, Shield } from 'lucide-react';

/**
 * Composant principal de la page de démarrage
 * Gère l'animation d'entrée et la redirection automatique
 */
const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [animationPhase, setAnimationPhase] = useState(0);

  // Gestion des phases d'animation
  useEffect(() => {
    const phases = [
      { delay: 500, phase: 1 },   // Logo principal
      { delay: 1000, phase: 2 },  // Titre et sous-titre
      { delay: 1500, phase: 3 },  // Icônes flottantes
      { delay: 2500, phase: 4 },  // Finalisation
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
  }, []);

  // Navigation automatique après l'animation
  useEffect(() => {
    if (!loading && animationPhase >= 4) {
      const timer = setTimeout(() => {
        if (user) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, loading, animationPhase, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue via-medical-teal to-medical-navy flex items-center justify-center relative overflow-hidden">
      {/* Particules d'arrière-plan animées */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white/10 rounded-full animate-pulse ${
              animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-4">
        
        {/* Logo principal animé */}
        <div className={`mb-8 transition-all duration-1000 ${
          animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <div className="relative">
            {/* Cercle d'arrière-plan avec pulsation */}
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Stethoscope className="w-12 h-12 text-medical-blue animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Titre et sous-titre */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${
          animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Med<span className="text-medical-light">Collab</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
            Plateforme d'Apprentissage Médical
          </p>
          <p className="text-base md:text-lg text-white/70 max-w-md mx-auto">
            Votre compagnon d'étude pour l'excellence médicale
          </p>
        </div>

        {/* Icônes flottantes */}
        <div className={`flex justify-center space-x-8 mb-12 transition-all duration-1000 delay-700 ${
          animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col items-center animate-float">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-red-300" />
            </div>
            <span className="text-white/80 text-sm">Cardiologie</span>
          </div>
          
          <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-purple-300" />
            </div>
            <span className="text-white/80 text-sm">Neurologie</span>
          </div>
          
          <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-green-300" />
            </div>
            <span className="text-white/80 text-sm">Prévention</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className={`w-64 mx-auto transition-all duration-1000 delay-1000 ${
          animationPhase >= 4 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-medical-light to-white h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-white/80 text-sm">Initialisation en cours...</p>
        </div>
      </div>

      {/* Styles CSS personnalisés pour les animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
      }} />
    </div>
  );
};

export default Splash;
