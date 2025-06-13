
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageUpdate
}) => {
  const { user, updateCurrentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data?.publicUrl || null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const updateUserProfile = async (imageUrl: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image: imageUrl })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update auth context
      updateCurrentUser({ ...user, profileImage: imageUrl });
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 2MB)');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format de fichier non supporté (JPG, PNG ou GIF uniquement)');
      return;
    }

    try {
      setIsUploading(true);
      
      // Show preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase
      const uploadedUrl = await uploadToSupabase(file);
      
      if (!uploadedUrl) {
        throw new Error('Failed to upload image');
      }
      
      // Update profile in database
      const success = await updateUserProfile(uploadedUrl);
      
      if (!success) {
        throw new Error('Failed to update profile');
      }
      
      // Clean up object URL and update with real URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(uploadedUrl);
      onImageUpdate(uploadedUrl);
      
      toast.success("Photo de profil mise à jour avec succès!");
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast.error("Erreur lors du téléchargement de l'image");
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Label htmlFor="profile-image" className="block mb-2">Photo de profil</Label>
      <div className="flex items-end gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden relative">
          <AspectRatio ratio={1/1}>
            <Avatar className="w-full h-full">
              <AvatarImage src={previewUrl || undefined} alt="Photo de profil" />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </AspectRatio>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            id="profile-image"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Téléchargement..." : "Modifier la photo"}
          </Button>
          <p className="text-sm text-muted-foreground mt-1">
            JPG, PNG ou GIF. 2MB maximum.
          </p>
        </div>
      </div>
    </div>
  );
};
