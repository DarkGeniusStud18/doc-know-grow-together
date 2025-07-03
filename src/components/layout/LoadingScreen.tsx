
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  children: React.ReactNode;
}

/**
 * Écran de chargement unique et élégant pour l'application MedCollab
 * Suppression du loader linéaire - Un seul loader circulaire professionnel
 * Messages contextuels et animations fluides optimisées
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ children }) => {
  // État pour contrôler l'affichage de l'écran de chargement - Une seule fois par session
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('medcollab-loaded');
  });
  
  // Messages contextuels français pour une meilleure expérience utilisateur
  const loadingMessages = [
    "Initialisation de MedCollab...",
    "Chargement de vos données médicales...",
    "Préparation de votre espace de travail...",
    "Synchronisation avec la base de données...",
    "Finalisation du chargement..."
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    console.log('🔄 LoadingScreen: Initialisation unique du chargement');
    
    // Animation de progression fluide et messages contextuels
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5; // Progression réaliste
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    // Changement des messages contextuels
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 800);
    
    // Durée optimisée pour une expérience utilisateur fluide
    const timer = setTimeout(() => {
      console.log('✅ LoadingScreen: Chargement terminé - Marquage en session');
      sessionStorage.setItem('medcollab-loaded', 'true');
      setIsLoading(false);
      
      // Scroll automatique vers le haut après chargement
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);

    // Nettoyage des timers pour éviter les fuites mémoire
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  console.log('🎨 LoadingScreen: Rendu du composant, état:', { isLoading, progress });

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-medical-blue via-medical-teal to-medical-navy"
          >
            <div className="flex flex-col items-center space-y-8 px-6">
              
              {/* Logo animé avec cercle de progression élégant */}
              <div className="relative">
                {/* Cercle de progression principal */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Cercle de fond */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Cercle de progression animé */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </svg>
                
                {/* Logo central avec animation de pulsation */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/f579baa8-4c1b-4195-97f4-055d6ffcbd4d.png" 
                      alt="MedCollab Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </motion.div>
                
                {/* Pourcentage de progression */}
                <div className="absolute inset-0 flex items-center justify-center mt-20">
                  <motion.span 
                    className="text-white font-bold text-lg"
                    key={Math.floor(progress)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {Math.floor(progress)}%
                  </motion.span>
                </div>
              </div>

              {/* Titre et messages contextuels */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold text-white tracking-wide">
                  MedCollab
                </h1>
                <p className="text-white/80 text-lg font-light">
                  Plateforme Médicale Collaborative
                </p>
                
                {/* Message contextuel animé */}
                <motion.div
                  key={currentMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <p className="text-white/90 text-sm font-medium">
                    {loadingMessages[currentMessageIndex]}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contenu principal affiché après le chargement unique */}
      {!isLoading && children}
    </>
  );
};

export default LoadingScreen;
