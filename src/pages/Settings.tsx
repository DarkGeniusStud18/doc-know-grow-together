
/**
 * ⚙️ Paramètres - Version Mobile Responsive Complète
 * 
 * Fonctionnalités :
 * - Préférences utilisateur complètes
 * - Paramètres d'affichage et d'accessibilité
 * - Notifications et vie privée
 * - Sauvegarde et synchronisation
 * - Interface responsive et intuitive
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download,
  Upload,
  Smartphone,
  Monitor,
  Volume2,
  Accessibility,
  Languages,
  Clock,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  Moon,
  Sun,
  Contrast,
  Type,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { usePWAStatus } from '@/hooks/usePWAStatus';

// Types pour les préférences
interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  weeklyReports: boolean;
}

interface DisplayPreferences {
  theme: string;
  fontSize: string;
  fontFamily: string;
  colorScheme: string;
  highContrast: boolean;
  reduceMotion: boolean;
}

interface MusicPreferences {
  volume: number;
  lastPlayedTrack?: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { isOnline, isNative, platform } = usePWAStatus();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // États des préférences
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    language: 'fr',
    timezone: 'Europe/Paris',
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    weeklyReports: true
  });

  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>({
    theme: 'light',
    fontSize: 'normal',
    fontFamily: 'default',
    colorScheme: 'default',
    highContrast: false,
    reduceMotion: false
  });

  const [musicPrefs, setMusicPrefs] = useState<MusicPreferences>({
    volume: 80
  });

  // Charger les préférences au montage
  useEffect(() => {
    if (user) {
      loadAllPreferences();
    }
  }, [user]);

  /**
   * 📊 Charger toutes les préférences utilisateur
   */
  const loadAllPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Charger les préférences générales
      const { data: userPrefsData, error: userPrefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userPrefsError && userPrefsError.code !== 'PGRST116') {
        console.error('❌ Erreur préférences utilisateur:', userPrefsError);
      } else if (userPrefsData) {
        setUserPrefs({
          language: userPrefsData.language || 'fr',
          timezone: userPrefsData.timezone || 'Europe/Paris',
          emailNotifications: userPrefsData.email_notifications ?? true,
          pushNotifications: userPrefsData.push_notifications ?? true,
          studyReminders: userPrefsData.study_reminders ?? true,
          weeklyReports: userPrefsData.weekly_reports ?? true
        });
      }

      // Charger les préférences d'affichage
      const { data: displayPrefsData, error: displayPrefsError } = await supabase
        .from('user_display_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (displayPrefsError && displayPrefsError.code !== 'PGRST116') {
        console.error('❌ Erreur préférences affichage:', displayPrefsError);
      } else if (displayPrefsData) {
        setDisplayPrefs({
          theme: displayPrefsData.theme || 'light',
          fontSize: displayPrefsData.font_size || 'normal',
          fontFamily: displayPrefsData.font_family || 'default',
          colorScheme: displayPrefsData.color_scheme || 'default',
          highContrast: displayPrefsData.high_contrast || false,
          reduceMotion: displayPrefsData.reduce_motion || false
        });
      }

      // Charger les préférences musicales
      const { data: musicPrefsData, error: musicPrefsError } = await supabase
        .from('user_music_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (musicPrefsError && musicPrefsError.code !== 'PGRST116') {
        console.error('❌ Erreur préférences musique:', musicPrefsError);
      } else if (musicPrefsData) {
        setMusicPrefs({
          volume: musicPrefsData.volume || 80,
          lastPlayedTrack: musicPrefsData.last_played_track
        });
      }

    } catch (error) {
      console.error('❌ Erreur lors du chargement des préférences:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 💾 Sauvegarder les préférences utilisateur
   */
  const saveUserPreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: userPrefs.language,
          timezone: userPrefs.timezone,
          email_notifications: userPrefs.emailNotifications,
          push_notifications: userPrefs.pushNotifications,
          study_reminders: userPrefs.studyReminders,
          weekly_reports: userPrefs.weeklyReports
        });

      if (error) {
        console.error('❌ Erreur sauvegarde préférences:', error);
        toast.error('Erreur lors de la sauvegarde');
        return;
      }

      toast.success('Préférences générales sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🎨 Sauvegarder les préférences d'affichage
   */
  const saveDisplayPreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_display_preferences')
        .upsert({
          user_id: user.id,
          theme: displayPrefs.theme,
          font_size: displayPrefs.fontSize,
          font_family: displayPrefs.fontFamily,
          color_scheme: displayPrefs.colorScheme,
          high_contrast: displayPrefs.highContrast,
          reduce_motion: displayPrefs.reduceMotion
        });

      if (error) {
        console.error('❌ Erreur sauvegarde affichage:', error);
        toast.error('Erreur lors de la sauvegarde de l\'affichage');
        return;
      }

      toast.success('Préférences d\'affichage sauvegardées');
      
      // Appliquer les changements immédiatement
      applyDisplayPreferences();
    } catch (error) {
      console.error('❌ Erreur sauvegarde affichage:', error);
      toast.error('Erreur lors de la sauvegarde de l\'affichage');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🎵 Sauvegarder les préférences musicales
   */
  const saveMusicPreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_music_preferences')
        .upsert({
          user_id: user.id,
          volume: musicPrefs.volume,
          last_played_track: musicPrefs.lastPlayedTrack
        });

      if (error) {
        console.error('❌ Erreur sauvegarde musique:', error);
        toast.error('Erreur lors de la sauvegarde de la musique');
        return;
      }

      toast.success('Préférences musicales sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde musique:', error);
      toast.error('Erreur lors de la sauvegarde de la musique');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🎨 Appliquer les préférences d'affichage
   */
  const applyDisplayPreferences = () => {
    const root = document.documentElement;
    
    // Appliquer le thème
    if (displayPrefs.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Appliquer la taille de police
    root.style.fontSize = displayPrefs.fontSize === 'large' ? '18px' : 
                          displayPrefs.fontSize === 'small' ? '14px' : '16px';
    
    // Appliquer le contraste élevé
    if (displayPrefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Appliquer la réduction des mouvements
    if (displayPrefs.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  /**
   * 🗑️ Réinitialiser les paramètres
   */
  const resetSettings = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser tous vos paramètres ?')) {
      return;
    }

    if (!user) return;

    try {
      setSaving(true);
      
      // Supprimer toutes les préférences
      await Promise.all([
        supabase.from('user_preferences').delete().eq('user_id', user.id),
        supabase.from('user_display_preferences').delete().eq('user_id', user.id),
        supabase.from('user_music_preferences').delete().eq('user_id', user.id)
      ]);

      // Réinitialiser les états
      setUserPrefs({
        language: 'fr',
        timezone: 'Europe/Paris',
        emailNotifications: true,
        pushNotifications: true,
        studyReminders: true,
        weeklyReports: true
      });

      setDisplayPrefs({
        theme: 'light',
        fontSize: 'normal',
        fontFamily: 'default',
        colorScheme: 'default',
        highContrast: false,
        reduceMotion: false
      });

      setMusicPrefs({
        volume: 80
      });

      applyDisplayPreferences();
      toast.success('Paramètres réinitialisés avec succès');
    } catch (error) {
      console.error('❌ Erreur réinitialisation:', error);
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-4 px-4 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 max-w-4xl">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Paramètres</h1>
              <p className="text-sm sm:text-base text-gray-500">Personnalisez votre expérience MedCollab</p>
            </div>
          </div>
          
          {/* Statut de connexion */}
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
              {isOnline ? '🌐 En ligne' : '📱 Hors ligne'}
            </Badge>
            {isNative && (
              <Badge variant="outline" className="text-xs">
                📱 {platform}
              </Badge>
            )}
          </div>
        </div>

        {/* Onglets des paramètres */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="text-xs sm:text-sm">
              <Palette className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Affichage</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs sm:text-sm">
              <Shield className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Avancé</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Préférences linguistiques
                </CardTitle>
                <CardDescription>
                  Configurez la langue et la région de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select 
                      value={userPrefs.language} 
                      onValueChange={(value) => setUserPrefs({...userPrefs, language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select 
                      value={userPrefs.timezone} 
                      onValueChange={(value) => setUserPrefs({...userPrefs, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveUserPreferences}
                    disabled={saving}
                    className="bg-medical-blue hover:bg-medical-blue/90"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Préférences audio
                </CardTitle>
                <CardDescription>
                  Contrôlez les paramètres audio de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Volume principal : {musicPrefs.volume}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicPrefs.volume}
                    onChange={(e) => setMusicPrefs({...musicPrefs, volume: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveMusicPreferences}
                    disabled={saving}
                    variant="outline"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Affichage */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thème</Label>
                    <Select 
                      value={displayPrefs.theme} 
                      onValueChange={(value) => setDisplayPrefs({...displayPrefs, theme: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Clair
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Sombre
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Automatique
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Taille de police</Label>
                    <Select 
                      value={displayPrefs.fontSize} 
                      onValueChange={(value) => setDisplayPrefs({...displayPrefs, fontSize: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Petite</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                {/* Options d'accessibilité */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Accessibility className="h-4 w-4" />
                    Accessibilité
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Contraste élevé</Label>
                        <p className="text-sm text-gray-500">
                          Améliore la lisibilité pour les malvoyants
                        </p>
                      </div>
                      <Switch
                        checked={displayPrefs.highContrast}
                        onCheckedChange={(checked) => setDisplayPrefs({...displayPrefs, highContrast: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Réduire les mouvements</Label>
                        <p className="text-sm text-gray-500">
                          Limite les animations pour éviter les distractions
                        </p>
                      </div>
                      <Switch
                        checked={displayPrefs.reduceMotion}
                        onCheckedChange={(checked) => setDisplayPrefs({...displayPrefs, reduceMotion: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveDisplayPreferences}
                    disabled={saving}
                    className="bg-medical-blue hover:bg-medical-blue/90"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Appliquer les changements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-normal">Notifications par email</Label>
                      <p className="text-sm text-gray-500">
                        Recevez des mises à jour importantes par email
                      </p>
                    </div>
                    <Switch
                      checked={userPrefs.emailNotifications}
                      onCheckedChange={(checked) => setUserPrefs({...userPrefs, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-normal">Notifications push</Label>
                      <p className="text-sm text-gray-500">
                        Notifications en temps réel sur votre appareil
                      </p>
                    </div>
                    <Switch
                      checked={userPrefs.pushNotifications}
                      onCheckedChange={(checked) => setUserPrefs({...userPrefs, pushNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-normal">Rappels d'étude</Label>
                      <p className="text-sm text-gray-500">
                        Rappels pour vos sessions d'étude planifiées
                      </p>
                    </div>
                    <Switch
                      checked={userPrefs.studyReminders}
                      onCheckedChange={(checked) => setUserPrefs({...userPrefs, studyReminders: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-normal">Rapports hebdomadaires</Label>
                      <p className="text-sm text-gray-500">
                        Résumé de vos progrès chaque semaine
                      </p>
                    </div>
                    <Switch
                      checked={userPrefs.weeklyReports}
                      onCheckedChange={(checked) => setUserPrefs({...userPrefs, weeklyReports: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveUserPreferences}
                    disabled={saving}
                    className="bg-medical-blue hover:bg-medical-blue/90"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Informations de l'application
                </CardTitle>
                <CardDescription>
                  Détails techniques et gestion des données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <Label className="font-medium">Plateforme</Label>
                    <p className="text-gray-600">{isNative ? `${platform} (Native)` : 'Web'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-medium">Statut de connexion</Label>
                    <p className="text-gray-600">{isOnline ? 'En ligne' : 'Hors ligne'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-medium">Version</Label>
                    <p className="text-gray-600">2.1.0</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-medium">Dernière mise à jour</Label>
                    <p className="text-gray-600">Aujourd'hui</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Zap className="h-5 w-5" />
                  Actions
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Actions irréversibles - Utilisez avec précaution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser l'application
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={resetSettings}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Réinitialiser les paramètres
                  </Button>
                </div>
                
                <p className="text-xs text-orange-700">
                  ⚠️ La réinitialisation supprimera tous vos paramètres personnalisés
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
