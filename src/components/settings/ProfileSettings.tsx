
/**
 * Composant ProfileSettings
 * 
 * Ce composant permet à l'utilisateur de modifier ses informations de profil
 * et de télécharger une photo de profil.
 */
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
import { Database } from '@/integrations/supabase/types';

/**
 * Type pour les données du formulaire
 */
interface ProfileFormData {
  /** Nom d'affichage de l'utilisateur */
  displayName: string;
  /** Université (pour les étudiants) */
  university?: string;
  /** Spécialité (pour les professionnels) */
  specialty?: string;
}

/**
 * Composant de paramètres du profil utilisateur
 */
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

  /**
   * Gère le téléchargement d'une image de profil
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      // Création d'une prévisualisation locale
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Téléchargement vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 2MB)');
        setPreviewUrl(user.profileImage || null);
        setIsUploading(false);
        return;
      }
      
      // Vérifier le type de fichier
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error('Format de fichier non supporté (JPG, PNG ou GIF uniquement)');
        setPreviewUrl(user.profileImage || null);
        setIsUploading(false);
        return;
      }
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data) {
        // Mise à jour du profil utilisateur dans la base de données
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            profile_image: data.publicUrl,
            updated_at: new Date().toISOString()
          } as Database['public']['Tables']['profiles']['Update'])
          .eq('id', user.id);
        
        if (updateError) throw updateError;
        
        // Mise à jour de l'état local de l'utilisateur
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
      // Réinitialisation de la prévisualisation en cas d'échec
      setPreviewUrl(user.profileImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Gère la soumission du formulaire de profil
   */
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      // Mise à jour du profil dans la base de données
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          university: data.university || null,
          specialty: data.specialty || null,
          updated_at: new Date().toISOString()
        } as Database['public']['Tables']['profiles']['Update'])
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Mise à jour de l'état local de l'utilisateur
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
          {/* Section de la photo de profil */}
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

          {/* Formulaire de profil */}
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
