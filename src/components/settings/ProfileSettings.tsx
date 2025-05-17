
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';

// Type for form data
interface ProfileFormData {
  displayName: string;
  university?: string;
  specialty?: string;
}

const ProfileSettings = () => {
  const { user, updateCurrentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      university: user?.university || '',
      specialty: user?.specialty || '',
    }
  });

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data) {
        // Update user profile in database
        const updateData = {
          profile_image: data.publicUrl,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        
        if (updateError) throw updateError;
        
        // Update local user state
        updateCurrentUser({
          ...user,
          profileImage: data.publicUrl
        });
        
        toast.success("Photo de profil mise à jour");
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error("Erreur lors du téléchargement de l'image", {
        description: error.message || "Veuillez réessayer plus tard"
      });
      // Reset preview if upload failed
      setPreviewUrl(user.profileImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle profile form submission
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      // Update profile in database
      const updateData = {
        display_name: data.displayName,
        university: data.university || null,
        specialty: data.specialty || null,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      updateCurrentUser({
        ...user,
        displayName: data.displayName,
        university: data.university,
        specialty: data.specialty
      });
      
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de la mise à jour du profil", {
        description: error.message || "Veuillez réessayer plus tard"
      });
    }
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
          {/* Profile Image Section */}
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

          <Separator />

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Nom d'affichage</Label>
                <Input
                  id="displayName"
                  placeholder="Votre nom"
                  {...register('displayName', { required: "Ce champ est requis" })}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500">{errors.displayName.message}</p>
                )}
              </div>
              
              {user?.role === 'student' && (
                <div className="grid gap-2">
                  <Label htmlFor="university">Université</Label>
                  <Input
                    id="university"
                    placeholder="Votre université"
                    {...register('university')}
                  />
                </div>
              )}
              
              {user?.role === 'professional' && (
                <div className="grid gap-2">
                  <Label htmlFor="specialty">Spécialité</Label>
                  <Input
                    id="specialty"
                    placeholder="Votre spécialité"
                    {...register('specialty')}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
