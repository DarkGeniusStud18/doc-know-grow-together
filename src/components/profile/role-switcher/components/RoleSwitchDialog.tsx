
/**
 * Dialog component for role switching
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SwitchCredentials } from '../types';
import { useRoleSwitch } from '../hooks/useRoleSwitch';

interface RoleSwitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  credentials: SwitchCredentials | null;
}

export const RoleSwitchDialog: React.FC<RoleSwitchDialogProps> = ({
  isOpen,
  onClose,
  currentRole,
  credentials
}) => {
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const { switchRole, isLoading } = useRoleSwitch();

  const handleSwitchRole = async () => {
    const success = await switchRole(pinCode, password, credentials);
    if (success) {
      onClose();
      setPinCode('');
      setPassword('');
    }
  };

  const handleClose = () => {
    onClose();
    setPinCode('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Changer d'interface</DialogTitle>
          <DialogDescription>
            Entrez les identifiants pour basculer de{' '}
            {currentRole === 'student' ? 'l\'interface étudiant vers professionnel' : 'l\'interface professionnel vers étudiant'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pinCode">Code PIN</Label>
            <Input
              id="pinCode"
              type="password"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Entrez le code PIN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
            />
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md mt-4">
            Pour obtenir les identifiants de changement d'interface, veuillez contacter:
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>WhatsApp: +229 56123109</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>Email: yasseradjadi9@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSwitchRole} 
            disabled={!pinCode || !password || isLoading}
          >
            {isLoading ? "Traitement..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
