
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

/**
 * Paramètres du profil utilisateur avec possibilité de modifier l'avatar et les infos de base
 */
const ProfileSettings = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async () => {
    if (!user) return;
    
    if (!displayName) {
      toast.error('Le nom d\'affichage est requis');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          university: university || null,
          specialty: specialty || null
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Show success message - changes will be reflected on next login/refresh
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    
    setIsUploadingAvatar(true);
    
    try {
      // Make sure the avatars bucket exists
      await supabase.storage.getBucket('avatars').catch(async () => {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('avatars', { public: true });
      });
      
      // Upload to storage
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Users will see changes after next reload/login
      setShowAvatarDialog(false);
      toast.success('Avatar mis à jour avec succès');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>
          Gérer les informations de votre profil visible par les autres utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24 hover-glow">
              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
              <AvatarFallback className="bg-medical-teal text-xl">
                {user.displayName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => setShowAvatarDialog(true)} className="hover-scale">Changer</Button>
          </div>
          
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                
                {user.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="university">Université</Label>
                    <Input
                      id="university"
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Spécialité</Label>
                  <Input
                    id="specialty"
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="md:col-span-2 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="hover-scale">Annuler</Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="hover-scale">
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom d'affichage</p>
                    <p>{displayName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  
                  {user.role === 'student' && university && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Université</p>
                      <p>{university}</p>
                    </div>
                  )}
                  
                  {specialty && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Spécialité</p>
                      <p>{specialty}</p>
                    </div>
                  )}
                </div>
                
                <Button onClick={() => setIsEditing(true)} className="hover-scale hover:bg-primary/90 transition-colors duration-300">Modifier</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer votre avatar</DialogTitle>
            <DialogDescription>
              Téléchargez une nouvelle image de profil
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-primary transition-colors duration-300">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Choisir une image</span>
                </div>
              )}
            </div>
            
            <Input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Label
              htmlFor="avatarUpload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 hover:border-primary transition-all duration-300 hover-scale"
            >
              <Upload className="h-4 w-4" />
              Sélectionner une image
            </Label>
            
            {avatarPreview && (
              <p className="text-xs text-gray-500">
                Formats recommandés : JPG, PNG. Taille maximale : 2Mo
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAvatarFile(null);
              setAvatarPreview(null);
              setShowAvatarDialog(false);
            }} className="hover-scale">
              Annuler
            </Button>
            <Button 
              onClick={uploadAvatar} 
              disabled={!avatarFile || isUploadingAvatar}
              className="hover-scale hover:bg-primary/90"
            >
              {isUploadingAvatar ? 'Téléchargement...' : 'Enregistrer l\'avatar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfileSettings;
