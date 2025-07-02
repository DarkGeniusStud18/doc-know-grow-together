
/**
 * 🔐 Bouton d'Accès Administrateur - Version Ultra Dissimulée
 * 
 * Sécurité maximale :
 * - Visible uniquement pour yasseradjadi9@gmail.com
 * - Triple-clic requis pour activation
 * - Design ultra-discret (petit point)
 * - Fonctionnement sur desktop ET mobile
 * - Aucune indication visuelle évidente
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface AdminAccessButtonProps {
  className?: string;
  isMobile?: boolean;
}

/**
 * Composant bouton d'accès admin ultra-sécurisé
 */
const AdminAccessButton: React.FC<AdminAccessButtonProps> = ({ 
  className = '', 
  isMobile = false 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

  // 🛡️ Vérification de l'autorisation d'accès admin (email spécifique)
  const isAuthorizedAdmin = user?.email === 'yasseradjadi9@gmail.com';

  /**
   * 🖱️ Gestion du triple-clic pour accès admin
   */
  const handleClick = useCallback(() => {
    // Bloquer complètement l'accès si l'utilisateur n'est pas autorisé
    if (!isAuthorizedAdmin) {
      return;
    }

    // Réinitialiser le timeout précédent
    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Debug uniquement pour l'utilisateur autorisé
    console.log(`🔐 Clic admin ${newCount}/3 détecté`);

    // Triple-clic détecté = accès admin
    if (newCount === 3) {
      console.log('🔐 Accès administrateur activé via triple-clic');
      toast.success('Accès administrateur activé', {
        description: 'Redirection vers le dashboard admin...',
      });
      navigate('/admin-dashboard');
      setClickCount(0);
      return;
    }

    // Réinitialiser le compteur après 2 secondes d'inactivité
    const timeout = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    
    setResetTimeout(timeout);
  }, [clickCount, resetTimeout, navigate, isAuthorizedAdmin]);

  // Nettoyage du timeout au démontage
  useEffect(() => {
    return () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [resetTimeout]);

  // 🚫 Ne pas afficher le bouton si l'utilisateur n'est pas autorisé
  if (!isAuthorizedAdmin) {
    return null;
  }

  // Styles adaptatifs selon l'environnement (desktop/mobile)
  const buttonStyles = isMobile 
    ? `
        w-3 h-3 rounded-full bg-gray-200 hover:bg-gray-300 
        transition-colors duration-200 cursor-pointer opacity-20 hover:opacity-40
        ${className}
      `
    : `
        w-2 h-2 rounded-full bg-gray-200 hover:bg-gray-300 
        transition-colors duration-200 cursor-pointer opacity-30 hover:opacity-60
        ${className}
      `;

  return (
    <div
      onClick={handleClick}
      className={buttonStyles}
      title="" // Pas de tooltip pour rester discret
      style={{
        minWidth: isMobile ? '12px' : '8px',
        minHeight: isMobile ? '12px' : '8px'
      }}
    />
  );
};

export default AdminAccessButton;
