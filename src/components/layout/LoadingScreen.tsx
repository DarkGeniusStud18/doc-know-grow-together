
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  children: React.ReactNode;
}

/**
 * Écran de chargement avec animation pour l'application MedCollab
 * Affiche une animation de chargement pendant 1.5 seconde au démarrage
 * Utilise Framer Motion pour des transitions fluides
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ children }) => {
  // État pour contrôler l'affichage de l'écran de chargement
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('LoadingScreen: Initialisation du composant');
    
    // Durée minimale de chargement pour une expérience utilisateur optimale
    const timer = setTimeout(() => {
      console.log('LoadingScreen: Fin du chargement');
      setIsLoading(false);
    }, 1500);

    // Nettoyage du timer pour éviter les fuites mémoire
    return () => {
      console.log('LoadingScreen: Nettoyage du timer');
      clearTimeout(timer);
    };
  }, []);

  console.log('LoadingScreen: Rendu du composant, état de chargement:', isLoading);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center">
              {/* Logo animé avec SVG personnalisé */}
              <div className="w-32 h-32 mb-8">
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="fill-medical-teal/20" 
                  />
                  <motion.path
                    d="M50 10 A40 40 0 0 1 90 50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                </svg>
              </div>
              
              {/* Titre animé de l'application */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold text-medical-navy mb-2">
                  MedCollab
                </h1>
                <p className="text-medical-teal font-medium">
                  Chargement de votre plateforme médicale...
                </p>
              </motion.div>
              
              {/* Indicateur de progression visuel */}
              <motion.div
                className="mt-8 w-48 h-1 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-medical-teal rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Contenu principal affiché après le chargement */}
      {!isLoading && children}
    </>
  );
};

export default LoadingScreen;
