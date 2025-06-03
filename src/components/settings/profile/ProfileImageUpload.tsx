
/**
 * Profile image upload component
 */
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/context/AuthContext';
import { uploadProfileImage } from '@/lib/profile/image-upload';
import { updateProfile } from '@/lib/supabase/query-helpers';
import { toast } from 'sonner';

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const uploadedUrl = await uploadProfileImage(file, user);
      
      if (uploadedUrl) {
        const { error } = await updateProfile(user.id, { profile_image: uploadedUrl });
        
        if (error) throw error;
        
        updateCurrentUser({ ...user, profileImage: uploadedUrl });
        onImageUpdate(uploadedUrl);
        setPreviewUrl(uploadedUrl);
        toast.success("Photo de profil mise à jour");
      } else {
        setPreviewUrl(currentImageUrl || null);
      }
    } catch (error: any) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error);
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
