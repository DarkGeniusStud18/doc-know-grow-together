
/**
 * 🔐 Bouton d'Accès Administrateur - Version Ultra Dissimulée
 * Triple-clic requis pour accéder au dashboard admin
 * Visible uniquement pour l'administrateur autorisé
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface AdminAccessButtonProps {
  className?: string;
}

const AdminAccessButton: React.FC<AdminAccessButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

  // 🛡️ Vérification de l'autorisation d'accès admin
  const isAuthorizedAdmin = user?.email === 'yasseradjadi9@gmail.com';

  /**
   * 🖱️ Gestion du triple-clic pour accès admin
   */
  const handleClick = useCallback(() => {
    // Bloquer l'accès si l'utilisateur n'est pas autorisé
    if (!isAuthorizedAdmin) {
      return;
    }

    // Réinitialiser le timeout précédent
    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Triple-clic détecté = accès admin
    if (newCount === 3) {
      console.log('🔐 Accès administrateur activé via triple-clic');
      toast.info('Accès administrateur activé');
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
  React.useEffect(() => {
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

  return (
    <div
      onClick={handleClick}
      className={`
        w-2 h-2 rounded-full bg-gray-200 hover:bg-gray-300 
        transition-colors duration-200 cursor-pointer opacity-30 hover:opacity-60
        ${className}
      `}
      title="Accès administrateur"
      style={{
        minWidth: '8px',
        minHeight: '8px'
      }}
    />
  );
};

export default AdminAccessButton;
