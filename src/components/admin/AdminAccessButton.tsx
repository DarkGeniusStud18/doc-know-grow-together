/**
 * 🔐 Bouton d'Accès Administrateur - Version Ultra Dissimulée
 * 
 * Sécurité maximale :
 * - Visible uniquement pour yasseradjadi9@gmail.com, merinakinm@gmail.com et boristeslazerotwo@gmail.com
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

  // 🛡️ Liste élargie des emails autorisés pour l'accès admin
  const authorizedEmails = [
    'yasseradjadi9@gmail.com',
    'merinakinm@gmail.com', 
    'boristeslazerotwo@gmail.com'
  ];

  // 🛡️ Vérification de l'autorisation d'accès admin (emails spécifiques)
  const isAuthorizedAdmin = user?.email && authorizedEmails.includes(user.email);

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
    console.log(`🔐 Clic admin ${newCount}/3 détecté pour ${user?.email}`);

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
  }, [clickCount, resetTimeout, navigate, isAuthorizedAdmin, user?.email]);

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

  // Styles adaptatifs selon l'environnement (desktop/mobile) - Ultra dissimulé
  const buttonStyles = isMobile 
    ? `
        w-2 h-2 rounded-full bg-gray-100 hover:bg-gray-200 
        transition-colors duration-200 cursor-pointer opacity-10 hover:opacity-20
        ${className}
      `
    : `
        w-1 h-1 rounded-full bg-gray-100 hover:bg-gray-200 
        transition-colors duration-200 cursor-pointer opacity-5 hover:opacity-15
        ${className}
      `;

  console.log('🔐 AdminAccessButton: Rendu pour utilisateur autorisé', user?.email);

  return (
    <div
      onClick={handleClick}
      className={buttonStyles}
      title="" // Pas de tooltip pour rester discret
      style={{
        minWidth: isMobile ? '8px' : '4px',
        minHeight: isMobile ? '8px' : '4px'
      }}
    />
  );
};

export default AdminAccessButton;