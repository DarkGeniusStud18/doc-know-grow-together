import React, { ReactNode } from 'react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PremiumContentProps {
  children: React.ReactNode;
  blur?: boolean; // Add this line
  showSubscribeButton?: boolean;
  message?: string;
  className?: string;
}

/**
 * A wrapper component that only shows content to premium users
 * For non-premium users, it shows a lock screen with subscription CTA
 */
const PremiumContent: React.FC<PremiumContentProps> = ({
  children,
  blur = true,
  showSubscribeButton = true,
  message = "Ce contenu est réservé aux membres premium",
  className = "",
}) => {
  const { isPremium, isLoading } = usePremiumStatus();
  const navigate = useNavigate();

  // If still loading the premium status, show a placeholder
  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-md ${className}`} style={{ minHeight: '100px' }}>
        {/* Loading placeholder */}
      </div>
    );
  }

  // If user has premium access, show the content
  if (isPremium) {
    return <>{children}</>;
  }

  // Otherwise show the locked content overlay
  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      {/* Optional blurred background showing the content */}
      {blur && (
        <div className="absolute inset-0 filter blur-md opacity-30">
          {children}
        </div>
      )}
      
      {/* Lock overlay */}
      <Card className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/90 to-white/95 dark:from-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
        <Lock className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-center mb-2">Contenu Premium</h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {message}
        </p>
        
        {showSubscribeButton && (
          <Button 
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            S'abonner à Premium
          </Button>
        )}
      </Card>
    </div>
  );
};

export default PremiumContent;
