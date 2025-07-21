
/*import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DemoButtonsProps {
  onDemoLogin: (type: 'student' | 'professional') => Promise<void>;
  isLoading: boolean;
}

const DemoButtons: React.FC<DemoButtonsProps> = ({ onDemoLogin, isLoading }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={() => onDemoLogin('student')}
          disabled={isLoading}
          className="transition-all hover:scale-105 hover:shadow-md hover:bg-medical-light"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Démo Étudiant'
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onDemoLogin('professional')}
          disabled={isLoading}
          className="transition-all hover:scale-105 hover:shadow-md hover:bg-medical-light"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Démo Médecin'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DemoButtons;*/
