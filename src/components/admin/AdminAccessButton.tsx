
/**
 * 🔐 Bouton d'Accès Administrateur - Version Dissimulée
 * Triple-clic requis pour accéder au dashboard admin
 * Design discret pour éviter les accès non autorisés
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface AdminAccessButtonProps {
  className?: string;
}

const AdminAccessButton: React.FC<AdminAccessButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * 🖱️ Gestion du triple-clic pour accès admin
   */
  const handleClick = useCallback(() => {
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
  }, [clickCount, resetTimeout, navigate]);

  // Nettoyage du timeout au démontage
  React.useEffect(() => {
    return () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [resetTimeout]);

  return (
    <div
      onClick={handleClick}
      className={`
        w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 
        transition-colors duration-200 cursor-pointer
        ${className}
      `}
      title="Triple-cliquez pour l'accès administrateur"
      style={{
        minWidth: '12px',
        minHeight: '12px'
      }}
    />
  );
};

export default AdminAccessButton;
