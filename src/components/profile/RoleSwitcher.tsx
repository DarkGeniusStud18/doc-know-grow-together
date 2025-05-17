
/**
 * Composant RoleSwitcher
 * 
 * Ce composant permet à l'utilisateur de basculer entre les interfaces étudiant et professionnel.
 * Il nécessite un code PIN et un mot de passe pour autoriser le changement.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { SwitchCredentialsTable, ProfilesUpdate } from '@/lib/auth/types';

/**
 * Props du composant RoleSwitcher
 */
interface RoleSwitcherProps {
  /** Indique si le composant est affiché dans les paramètres */
  inSettings?: boolean;
}

/**
 * Interface pour les identifiants de changement de rôle
 */
interface SwitchCredentials {
  pin_code: string;
  password: string;
}

/**
 * Composant pour changer d'interface (étudiant/professionnel)
 */
const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ inSettings = false }) => {
  const { user, updateCurrentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pinCode, setPinCode] = useState('123456'); // Valeurs par défaut pour faciliter le développement
  const [password, setPassword] = useState('Byron@2025');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<SwitchCredentials | null>(null);

  useEffect(() => {
    // Récupération des identifiants au montage du composant
    const fetchCredentials = async () => {
      try {
        const { data, error } = await supabase
          .from('switch_credentials')
          .select('pin_code, password')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) throw error;
        
        // Vérification que data est bien défini et n'est pas une erreur
        if (data && !('error' in data)) {
          setCredentials({
            pin_code: data.pin_code,
            password: data.password
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des identifiants:', error);
      }
    };
    
    fetchCredentials();
  }, []);

  /**
   * Gère le changement de rôle de l'utilisateur
   */
  const handleSwitchRole = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Vérification des identifiants
      if (!credentials || pinCode !== credentials.pin_code || password !== credentials.password) {
        toast.error("Code PIN ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }
      
      // Bascule du rôle
      const newRole = user.role === 'student' ? 'professional' : 'student';
      
      // Création de l'objet de mise à jour
      const updateData: ProfilesUpdate = {
        role: newRole,
        updated_at: new Date().toISOString()
      };
      
      // Mise à jour du profil dans Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Mise à jour du contexte utilisateur
      updateCurrentUser({
        ...user,
        role: newRole
      });
      
      toast.success(`Interface changée avec succès: ${newRole === 'student' ? 'Étudiant' : 'Professionnel'}`);
      setIsDialogOpen(false);
      
      // Effacement des identifiants
      setPinCode('');
      setPassword('');
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
      toast.error("Erreur lors du changement d'interface");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {inSettings ? (
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
                
                <Badge variant={user.role === 'student' ? 'outline' : 'default'}>
                  {user.role === 'student' ? 'Étudiant' : 'Professionnel'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Switch
                  checked={user.role === 'professional'}
                  disabled
                />
                
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  variant="outline"
                >
                  Changer d'interface
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-switch-camera"><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/><circle cx="12" cy="12" r="3"/><path d="m18 22-3-3 3-3"/><path d="m6 2 3 3-3 3"/></svg>
          Changer d'interface
        </Button>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Changer d'interface</DialogTitle>
            <DialogDescription>
              Entrez les identifiants pour basculer de{' '}
              {user.role === 'student' ? 'l\'interface étudiant vers professionnel' : 'l\'interface professionnel vers étudiant'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pinCode">Code PIN</Label>
              <Input
                id="pinCode"
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Entrez le code PIN"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
              />
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md mt-4">
              Pour obtenir les identifiants de changement d'interface, veuillez contacter:
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>WhatsApp: +229 56123109</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>Email: yasseradjadi9@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSwitchRole} disabled={!pinCode || !password || isLoading}>
              {isLoading ? "Traitement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleSwitcher;
