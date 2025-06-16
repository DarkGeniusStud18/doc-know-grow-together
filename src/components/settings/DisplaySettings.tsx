
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Laptop, Type, Palette, Eye, Zap } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Paramètres d'apparence et d'affichage de l'application - Version mobile optimisée
 */
const DisplaySettings = () => {
  const { 
    theme, 
    font, 
    colorScheme, 
    fontSize,
    highContrast,
    reduceMotion,
    setTheme, 
    setFont, 
    setColorScheme,
    setFontSize,
    setHighContrast,
    setReduceMotion,
    loading
  } = useTheme();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Affichage</CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const colorSchemes = [
    { value: 'default', label: 'Défaut', color: 'bg-medical-teal' },
    { value: 'blue', label: 'Bleu', color: 'bg-blue-500' },
    { value: 'green', label: 'Vert', color: 'bg-green-500' },
    { value: 'purple', label: 'Violet', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Rouge', color: 'bg-red-500' },
    { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' },
    { value: 'pink', label: 'Rose', color: 'bg-pink-500' },
    { value: 'teal', label: 'Sarcelle', color: 'bg-teal-500' },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Palette className="h-5 w-5 flex-shrink-0" />
          Affichage
        </CardTitle>
        <CardDescription className="text-sm">
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8">
        {/* Theme Selection - Responsive */}
        <div>
          <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Sun className="h-4 w-4 flex-shrink-0" />
            Thème
          </h3>
          <RadioGroup 
            value={theme} 
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')} 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-white p-3 sm:p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <Sun className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm font-medium">Clair</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-gray-900 p-3 sm:p-4 hover:opacity-90 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <Moon className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <span className="text-sm font-medium text-white">Sombre</span>
              </Label>
            </div>
            <div className="sm:col-span-1 col-span-1">
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-gradient-to-br from-white to-gray-900 p-3 sm:p-4 hover:opacity-90 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <Laptop className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm font-medium">Système</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Color Scheme Selection - Mobile Optimized */}
        <div>
          <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Palette className="h-4 w-4 flex-shrink-0" />
            Palette de couleurs
          </h3>
          <RadioGroup 
            value={colorScheme} 
            onValueChange={(value) => setColorScheme(value as any)} 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
          >
            {colorSchemes.map((scheme) => (
              <div key={scheme.value}>
                <RadioGroupItem value={scheme.value} id={`color-${scheme.value}`} className="sr-only" />
                <Label
                  htmlFor={`color-${scheme.value}`}
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-2 sm:p-3 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[70px] sm:min-h-[80px]"
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${scheme.color} mb-1 sm:mb-2 shadow-sm flex-shrink-0`}></div>
                  <span className="text-xs sm:text-sm font-medium text-center leading-tight">{scheme.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Font Selection - Mobile Responsive */}
        <div>
          <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Type className="h-4 w-4 flex-shrink-0" />
            Police
          </h3>
          <RadioGroup 
            value={font} 
            onValueChange={(value) => setFont(value as 'default' | 'serif' | 'mono')} 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            <div>
              <RadioGroupItem value="default" id="font-default" className="sr-only" />
              <Label
                htmlFor="font-default"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-3 sm:p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <div className="font-sans text-xl sm:text-2xl mb-1 sm:mb-2">Aa</div>
                <span className="text-sm font-medium">Sans Serif</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="serif" id="font-serif" className="sr-only" />
              <Label
                htmlFor="font-serif"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-3 sm:p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <div className="font-serif text-xl sm:text-2xl mb-1 sm:mb-2">Aa</div>
                <span className="text-sm font-medium">Serif</span>
              </Label>
            </div>
            <div className="sm:col-span-1 col-span-1">
              <RadioGroupItem value="mono" id="font-mono" className="sr-only" />
              <Label
                htmlFor="font-mono"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-3 sm:p-4 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px]"
              >
                <div className="font-mono text-xl sm:text-2xl mb-1 sm:mb-2">Aa</div>
                <span className="text-sm font-medium">Monospace</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Font Size Selection - Mobile Optimized */}
        <div>
          <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Type className="h-4 w-4 flex-shrink-0" />
            Taille du texte
          </h3>
          <RadioGroup 
            value={fontSize} 
            onValueChange={(value) => setFontSize(value as any)} 
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
          >
            <div>
              <RadioGroupItem value="small" id="font-small" className="sr-only" />
              <Label
                htmlFor="font-small"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-2 sm:p-3 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[70px]"
              >
                <div className="text-sm mb-1 sm:mb-2">Aa</div>
                <span className="text-xs font-medium">Petit</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="normal" id="font-normal" className="sr-only" />
              <Label
                htmlFor="font-normal"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-2 sm:p-3 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[70px]"
              >
                <div className="text-base mb-1 sm:mb-2">Aa</div>
                <span className="text-xs font-medium">Normal</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="large" id="font-large" className="sr-only" />
              <Label
                htmlFor="font-large"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-2 sm:p-3 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[70px]"
              >
                <div className="text-lg mb-1 sm:mb-2">Aa</div>
                <span className="text-xs font-medium">Grand</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="extra-large" id="font-extra-large" className="sr-only" />
              <Label
                htmlFor="font-extra-large"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-2 sm:p-3 hover:bg-gray-50 hover:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[70px]"
              >
                <div className="text-xl mb-1 sm:mb-2">Aa</div>
                <span className="text-xs font-medium">Très grand</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Accessibility Options - Mobile Optimized */}
        <div>
          <h3 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Eye className="h-4 w-4 flex-shrink-0" />
            Accessibilité
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Zap className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <Label htmlFor="reduceMotion" className="font-medium cursor-pointer block text-sm sm:text-base">
                    Réduire les animations
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Diminue les effets de mouvement et transitions
                  </p>
                </div>
              </div>
              <Switch 
                id="reduceMotion" 
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
                className="flex-shrink-0 ml-3"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Eye className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <Label htmlFor="highContrast" className="font-medium cursor-pointer block text-sm sm:text-base">
                    Contraste élevé
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Améliore la lisibilité avec des contrastes plus marqués
                  </p>
                </div>
              </div>
              <Switch 
                id="highContrast" 
                checked={highContrast}
                onCheckedChange={setHighContrast}
                className="flex-shrink-0 ml-3"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
