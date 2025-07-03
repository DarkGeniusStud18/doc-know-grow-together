
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HiddenAdminAccessProps {
  onAdminAccess: () => void;
}

const HiddenAdminAccess: React.FC<HiddenAdminAccessProps> = ({ onAdminAccess }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const navigate = useNavigate();

  const handleTripleClick = () => {
    const now = Date.now();
    
    // Reset si plus de 2 secondes entre les clics
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);
    
    // Triple clic détecté
    if (clickCount >= 2) {
      setClickCount(0);
      onAdminAccess();
    }
  };

  // Reset automatique après 3 secondes
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  return (
    <div 
      className="fixed bottom-4 right-4 w-3 h-3 bg-gray-300/50 rounded-full cursor-pointer opacity-20 hover:opacity-40 transition-opacity z-10"
      onClick={handleTripleClick}
      title="Triple-cliquez pour accéder à l'administration"
    />
  );
};

export default HiddenAdminAccess;
