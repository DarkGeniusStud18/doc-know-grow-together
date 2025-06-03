
/**
 * Simple button component for role switching
 */
import React from 'react';
import { Button } from '@/components/ui/button';

interface RoleSwitchButtonProps {
  onClick: () => void;
}

export const RoleSwitchButton: React.FC<RoleSwitchButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-switch-camera">
        <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>
        <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="m18 22-3-3 3-3"/>
        <path d="m6 2 3 3-3 3"/>
      </svg>
      Changer d'interface
    </Button>
  );
};
