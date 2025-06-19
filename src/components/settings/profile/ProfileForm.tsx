
/**
 * Profile information form component
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/lib/supabase/query-helpers';
import { toast } from 'sonner';

interface ProfileFormData {
  displayName: string;
  university?: string;
  specialty?: string;
}

export const ProfileForm: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      university: user?.university || '',
      specialty: user?.specialty || '',
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      console.log('Mise à jour du profil avec les données:', data);
      
      const { error } = await updateProfile(user.id, {
        display_name: data.displayName,
        university: data.university || null,
        specialty: data.specialty || null,
      });
      
      if (error) throw error;
      
      updateCurrentUser({
        ...user,
        displayName: data.displayName,
        university: data.university,
        specialty: data.specialty
      });
      
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  return (
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
  );
};
