
/**
 * Card component for role switching in settings
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface RoleSwitchCardProps {
  currentRole: string;
  onSwitchClick: () => void;
}

export const RoleSwitchCard: React.FC<RoleSwitchCardProps> = ({
  currentRole,
  onSwitchClick
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Changer d'interface</h3>
              <p className="text-sm text-gray-500">
                Basculer entre l'interface étudiant et professionnel de santé
              </p>
            </div>
            
            <Badge variant={currentRole === 'student' ? 'outline' : 'default'}>
              {currentRole === 'student' ? 'Étudiant' : 'Professionnel'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <Switch
              checked={currentRole === 'professional'}
              disabled
            />
            
            <Button
              onClick={onSwitchClick}
              variant="outline"
            >
              Changer d'interface
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
