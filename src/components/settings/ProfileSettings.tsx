
/**
 * Main ProfileSettings component - refactored to use smaller components
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';
import { ProfileImageUpload } from './profile/ProfileImageUpload';
import { ProfileForm } from './profile/ProfileForm';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [currentImageUrl, setCurrentImageUrl] = useState(user?.profileImage || '');

  const handleImageUpdate = (newImageUrl: string) => {
    setCurrentImageUrl(newImageUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du profil</CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles et votre photo de profil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ProfileImageUpload 
            currentImageUrl={currentImageUrl}
            onImageUpdate={handleImageUpdate}
          />
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
