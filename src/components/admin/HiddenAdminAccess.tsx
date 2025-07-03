
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HiddenAdminAccessProps {
  onAdminAccess: () => void;
}

/**
 * Composant d'accès administrateur sécurisé et dissimulé
 * Accessible uniquement via triple-clic et réservé à l'administrateur principal
 * Email autorisé : yasseradjadi9@gmail.com
 */
const HiddenAdminAccess: React.FC<HiddenAdminAccessProps> = ({ onAdminAccess }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Gestion sécurisée de l'accès à useAuth avec vérification d'erreur
  let user = null;
  let isAuthorizedAdmin = false;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    isAuthorizedAdmin = user?.email === 'yasseradjadi9@gmail.com';
  } catch (error) {
    console.log('🔒 HiddenAdminAccess: AuthProvider non disponible');
    return null;
  }

  /**
   * Gestionnaire de triple-clic sécurisé pour l'accès administrateur
   * Réinitialisation automatique si délai dépassé
   */
  const handleTripleClick = () => {
    // Vérification de sécurité supplémentaire
    if (!isAuthorizedAdmin) {
      console.log('🔒 Accès administrateur refusé - Email non autorisé');
      return;
    }

    const now = Date.now();
    
    // Réinitialisation si plus de 2 secondes entre les clics
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);
    
    // Triple-clic détecté - Accès administrateur accordé
    if (clickCount >= 2) {
      console.log('🔓 Accès administrateur accordé pour:', user?.email);
      setClickCount(0);
      onAdminAccess();
    }
  };

  // Réinitialisation automatique après 3 secondes d'inactivité
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
        console.log('⏰ Compteur de clics réinitialisé');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // Rendu conditionnel - Visible uniquement pour l'administrateur autorisé
  if (!isAuthorizedAdmin) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 w-2 h-2 bg-gray-400/30 rounded-full cursor-pointer opacity-10 hover:opacity-30 transition-opacity duration-300 z-10"
      onClick={handleTripleClick}
      title="Accès administrateur (Triple-clic)"
      style={{
        background: clickCount > 0 
          ? `radial-gradient(circle, rgba(59, 130, 246, ${0.3 + clickCount * 0.2}) 0%, transparent 70%)`
          : undefined
      }}
    />
  );
};

export default HiddenAdminAccess;
