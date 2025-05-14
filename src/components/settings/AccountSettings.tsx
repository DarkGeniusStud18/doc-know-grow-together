
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * Paramètres du compte utilisateur avec options de sécurité et suppression
 */
const AccountSettings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit comporter au moins 6 caractères');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer un email valide');
      return;
    }
    
    setIsChangingEmail(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: email 
      });
      
      if (error) throw error;
      
      toast.success('Email mis à jour avec succès. Veuillez vérifier votre nouvelle adresse email.');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'email');
    } finally {
      setIsChangingEmail(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      toast.error('L\'email ne correspond pas');
      return;
    }
    
    try {
      // In a real application, this would need to be handled by a server-side function
      // as Supabase doesn't allow users to delete their own accounts directly
      toast.error('La suppression de compte n\'est pas encore implémentée');
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression du compte');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compte</CardTitle>
        <CardDescription>
          Gérer les paramètres de votre compte et les options de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Settings */}
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Adresse Email</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="mt-2" 
              disabled={isChangingEmail || !email || email === user?.email}
            >
              {isChangingEmail ? 'Mise à jour...' : 'Mettre à jour l\'email'}
            </Button>
          </div>
        </form>
        
        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="text-lg font-medium mb-2">Changer de mot de passe</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="mt-2" 
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {isChangingPassword ? 'Mise à jour...' : 'Changer le mot de passe'}
            </Button>
          </div>
        </form>
        
        {/* Account Deletion */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium text-red-600">Zone de danger</h3>
          <p className="text-sm text-gray-500 mt-1">
            Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain.
          </p>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-2">Supprimer mon compte</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Supprimer définitivement votre compte ?
                </DialogTitle>
                <DialogDescription>
                  Cette action ne peut pas être annulée. Elle supprimera définitivement votre compte et toutes les données associées.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm font-medium">
                  Pour confirmer, veuillez saisir votre adresse email : <span className="font-bold">{user?.email}</span>
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Entrez votre email"
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== user?.email}
                >
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
