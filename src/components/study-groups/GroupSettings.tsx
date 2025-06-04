
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

type StudyGroup = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_private: boolean;
  max_participants: number;
  created_at: string;
};

type GroupSettingsProps = {
  group: StudyGroup;
  isAdmin: boolean;
  onGroupUpdate: (group: StudyGroup) => void;
};

const GroupSettings: React.FC<GroupSettingsProps> = ({ group, isAdmin, onGroupUpdate }) => {
  const [isPrivate, setIsPrivate] = useState(group.is_private);

  const updatePrivacySetting = async () => {
    try {
      const { error } = await supabase
        .from('study_groups')
        .update({ is_private: !isPrivate } as any)
        .eq('id', group.id as any);
        
      if (error) throw error;
      
      setIsPrivate(!isPrivate);
      onGroupUpdate({
        ...group,
        is_private: !isPrivate
      });
      
      toast.success('Paramètres de confidentialité mis à jour');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confidentialité du groupe</CardTitle>
          <CardDescription>
            Gérer qui peut voir et rejoindre ce groupe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Groupe privé</p>
              <p className="text-sm text-gray-500">
                Les groupes privés ne sont visibles que par les membres et sur invitation.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="privacy" checked={isPrivate} onCheckedChange={updatePrivacySetting} />
              <Label htmlFor="privacy" className="sr-only">Groupe privé</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Paramètres de notification pour ce groupe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications par email</p>
                <p className="text-sm text-gray-500">
                  Recevoir des emails pour les activités importantes
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="emailNotif" defaultChecked />
                <Label htmlFor="emailNotif" className="sr-only">Notifications par email</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications push</p>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications dans l'application
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="pushNotif" defaultChecked />
                <Label htmlFor="pushNotif" className="sr-only">Notifications push</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zone de danger</CardTitle>
            <CardDescription>
              Ces actions sont irréversibles, soyez prudent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="destructive" className="w-full">
              Archiver le groupe
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupSettings;
