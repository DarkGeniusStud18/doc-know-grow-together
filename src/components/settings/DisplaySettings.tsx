
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Laptop } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

/**
 * Paramètres d'apparence et d'affichage de l'application
 */
const DisplaySettings = () => {
  const { theme, font, colorScheme, setTheme, setFont, setColorScheme } = useTheme();
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [largeText, setLargeText] = React.useState(false);

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>Affichage</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="font-medium mb-3">Thème</h3>
          <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <Sun className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Clair</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-900 p-4 hover:opacity-90 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary transition-all duration-200 hover-scale"
              >
                <Moon className="mb-3 h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">Sombre</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-gray-900 p-4 hover:opacity-90 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary transition-all duration-200 hover-scale"
              >
                <Laptop className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Système</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Font Selection */}
        <div>
          <h3 className="font-medium mb-3">Police</h3>
          <RadioGroup value={font} onValueChange={(value) => setFont(value as 'default' | 'serif' | 'mono')} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="default" id="font-default" className="sr-only" />
              <Label
                htmlFor="font-default"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="font-sans text-lg mb-2">Aa</div>
                <span className="text-sm font-medium">Sans Serif</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="serif" id="font-serif" className="sr-only" />
              <Label
                htmlFor="font-serif"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="font-serif text-lg mb-2">Aa</div>
                <span className="text-sm font-medium">Serif</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="mono" id="font-mono" className="sr-only" />
              <Label
                htmlFor="font-mono"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="font-mono text-lg mb-2">Aa</div>
                <span className="text-sm font-medium">Monospace</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Color Scheme Selection */}
        <div>
          <h3 className="font-medium mb-3">Palette de couleurs</h3>
          <RadioGroup value={colorScheme} onValueChange={(value) => setColorScheme(value as 'default' | 'blue' | 'green' | 'purple' | 'orange')} className="grid grid-cols-3 md:grid-cols-5 gap-4">
            <div>
              <RadioGroupItem value="default" id="color-default" className="sr-only" />
              <Label
                htmlFor="color-default"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="w-10 h-10 rounded-full bg-medical-teal mb-2"></div>
                <span className="text-sm font-medium">Défaut</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="blue" id="color-blue" className="sr-only" />
              <Label
                htmlFor="color-blue"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 mb-2"></div>
                <span className="text-sm font-medium">Bleu</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="green" id="color-green" className="sr-only" />
              <Label
                htmlFor="color-green"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 mb-2"></div>
                <span className="text-sm font-medium">Vert</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="purple" id="color-purple" className="sr-only" />
              <Label
                htmlFor="color-purple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 mb-2"></div>
                <span className="text-sm font-medium">Violet</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="orange" id="color-orange" className="sr-only" />
              <Label
                htmlFor="color-orange"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 hover-scale"
              >
                <div className="w-10 h-10 rounded-full bg-orange-500 mb-2"></div>
                <span className="text-sm font-medium">Orange</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Accessibility Options */}
        <div>
          <h3 className="font-medium mb-3">Accessibilité</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="reduceMotion">Réduire les animations</Label>
              <Switch 
                id="reduceMotion" 
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
              />
            </div>
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="highContrast">Contraste élevé</Label>
              <Switch 
                id="highContrast" 
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="largeText">Texte plus grand</Label>
              <Switch 
                id="largeText" 
                checked={largeText}
                onCheckedChange={setLargeText}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
