
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

interface PremiumBadgeProps {
  small?: boolean;
  showLock?: boolean;
}

/**
 * A badge component that indicates premium content or features
 */
const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  small = false,
  showLock = true
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className={`bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 ${
              small ? 'px-1.5 py-0 text-xs' : ''
            }`}
          >
            {showLock && <Lock className={`mr-1 ${small ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />}
            PREMIUM
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Fonctionnalité réservée aux membres premium</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;
