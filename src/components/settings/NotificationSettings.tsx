
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, CalendarDays, Users, BookOpen, MessageSquare, FileText } from 'lucide-react';

/**
 * Paramètres des notifications utilisateur
 */
const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    all: true,
    studyGroups: true,
    resources: true,
    exams: true,
    community: true,
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    all: true,
    studyGroups: true,
    resources: false,
    exams: true,
    community: true,
  });
  
  const [mobilePush, setMobilePush] = useState(true);
  const [desktopPush, setDesktopPush] = useState(true);
  
  const handleEmailToggle = (key: string) => {
    if (key === 'all') {
      const newValue = !emailNotifications.all;
      setEmailNotifications({
        all: newValue,
        studyGroups: newValue,
        resources: newValue,
        exams: newValue,
        community: newValue,
      });
    } else {
      setEmailNotifications(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev],
      }));
    }
  };
  
  const handlePushToggle = (key: string) => {
    if (key === 'all') {
      const newValue = !pushNotifications.all;
      setPushNotifications({
        all: newValue,
        studyGroups: newValue,
        resources: newValue,
        exams: newValue,
        community: newValue,
      });
    } else {
      setPushNotifications(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev],
      }));
    }
  };

  const handleSaveSettings = () => {
    // In a real application, this would save to a user preferences table
    toast.success('Préférences de notification enregistrées');
  };
  
  const requestPushPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          toast.success('Notifications push activées');
        } else {
          toast.error('Les notifications push ont été refusées');
        }
      } else {
        toast.error('Les notifications ne sont pas supportées par votre navigateur');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Erreur lors de la demande d\'autorisation');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configurez comment et quand vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="push" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications push
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Toutes les notifications par email</h3>
                  <p className="text-sm text-gray-500">Activer ou désactiver toutes les notifications par email</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-all" 
                    checked={emailNotifications.all}
                    onCheckedChange={() => handleEmailToggle('all')} 
                  />
                  <Label htmlFor="email-all" className="sr-only">Toutes les notifications par email</Label>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Groupes d'étude</h4>
                      <p className="text-sm text-gray-500">Activités et mises à jour des groupes</p>
                    </div>
                  </div>
                  <Switch 
                    id="email-groups" 
                    checked={emailNotifications.studyGroups}
                    disabled={!emailNotifications.all}
                    onCheckedChange={() => handleEmailToggle('studyGroups')} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Ressources</h4>
                      <p className="text-sm text-gray-500">Nouvelles ressources disponibles</p>
                    </div>
                  </div>
                  <Switch 
                    id="email-resources" 
                    checked={emailNotifications.resources}
                    disabled={!emailNotifications.all}
                    onCheckedChange={() => handleEmailToggle('resources')} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Examens</h4>
                      <p className="text-sm text-gray-500">Rappels et résultats d'examens</p>
                    </div>
                  </div>
                  <Switch 
                    id="email-exams" 
                    checked={emailNotifications.exams}
                    disabled={!emailNotifications.all}
                    onCheckedChange={() => handleEmailToggle('exams')} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Communauté</h4>
                      <p className="text-sm text-gray-500">Réponses à vos publications</p>
                    </div>
                  </div>
                  <Switch 
                    id="email-community" 
                    checked={emailNotifications.community}
                    disabled={!emailNotifications.all}
                    onCheckedChange={() => handleEmailToggle('community')} 
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>Enregistrer les préférences</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="push">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-700">Activer les notifications push</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Les notifications push vous permettent de recevoir des alertes même lorsque vous n'êtes pas sur le site.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={requestPushPermission}
                  >
                    Activer les notifications
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Toutes les notifications push</h3>
                  <p className="text-sm text-gray-500">Activer ou désactiver toutes les notifications push</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="push-all" 
                    checked={pushNotifications.all}
                    onCheckedChange={() => handlePushToggle('all')} 
                  />
                  <Label htmlFor="push-all" className="sr-only">Toutes les notifications push</Label>
                </div>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium">Appareils</h4>
                  <p className="text-sm text-gray-500 mb-2">Sélectionner les appareils pour les notifications</p>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Mobile</span>
                      <Badge variant="outline" className="text-xs">
                        Chrome • Android
                      </Badge>
                    </div>
                    <Switch 
                      id="mobile-push" 
                      checked={mobilePush}
                      onCheckedChange={() => setMobilePush(!mobilePush)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Ordinateur</span>
                      <Badge variant="outline" className="text-xs">
                        Chrome • Windows
                      </Badge>
                    </div>
                    <Switch 
                      id="desktop-push" 
                      checked={desktopPush}
                      onCheckedChange={() => setDesktopPush(!desktopPush)}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Groupes d'étude</h4>
                        <p className="text-sm text-gray-500">Activités et mises à jour des groupes</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-groups" 
                      checked={pushNotifications.studyGroups}
                      disabled={!pushNotifications.all}
                      onCheckedChange={() => handlePushToggle('studyGroups')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Ressources</h4>
                        <p className="text-sm text-gray-500">Nouvelles ressources disponibles</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-resources" 
                      checked={pushNotifications.resources}
                      disabled={!pushNotifications.all}
                      onCheckedChange={() => handlePushToggle('resources')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Examens</h4>
                        <p className="text-sm text-gray-500">Rappels et résultats d'examens</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-exams" 
                      checked={pushNotifications.exams}
                      disabled={!pushNotifications.all}
                      onCheckedChange={() => handlePushToggle('exams')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Communauté</h4>
                        <p className="text-sm text-gray-500">Réponses à vos publications</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-community" 
                      checked={pushNotifications.community}
                      disabled={!pushNotifications.all}
                      onCheckedChange={() => handlePushToggle('community')} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Silence pendant</h4>
                    <p className="text-sm text-gray-500">Ne pas recevoir de notifications pendant certaines périodes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select>
                      <option>23:00</option>
                      <option>00:00</option>
                      <option>01:00</option>
                    </Select>
                    <span>à</span>
                    <Select>
                      <option>06:00</option>
                      <option>07:00</option>
                      <option>08:00</option>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings} className="mt-4">Enregistrer les préférences</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for time selection
const Select: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <select className="p-2 border rounded-md text-sm">
      {children}
    </select>
  );
};

export default NotificationSettings;
