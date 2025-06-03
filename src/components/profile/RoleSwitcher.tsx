
/**
 * Main RoleSwitcher component - refactored to use smaller components
 */
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCredentials } from './role-switcher/hooks/useCredentials';
import { RoleSwitchDialog } from './role-switcher/components/RoleSwitchDialog';
import { RoleSwitchButton } from './role-switcher/components/RoleSwitchButton';
import { RoleSwitchCard } from './role-switcher/components/RoleSwitchCard';
import { RoleSwitcherProps } from './role-switcher/types';

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ inSettings = false }) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const credentials = useCredentials();

  if (!user) return null;

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <>
      {inSettings ? (
        <RoleSwitchCard
          currentRole={user.role}
          onSwitchClick={handleOpenDialog}
        />
      ) : (
        <RoleSwitchButton onClick={handleOpenDialog} />
      )}
      
      <RoleSwitchDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        currentRole={user.role}
        credentials={credentials}
      />
    </>
  );
};

export default RoleSwitcher;
