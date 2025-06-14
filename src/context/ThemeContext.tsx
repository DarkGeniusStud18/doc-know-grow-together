
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Types de thème disponibles pour l'application
 * - light: Thème clair (défaut)
 * - dark: Thème sombre
 * - system: Suit les préférences système de l'utilisateur
 */
type Theme = "light" | "dark" | "system";

/**
 * Types de police disponibles
 * - default: Police système sans-serif
 * - serif: Police avec empattements (Georgia, Times)
 * - mono: Police monospace (Courier, Consolas)
 */
type Font = "default" | "serif" | "mono";

/**
 * Schémas de couleurs disponibles pour personnaliser l'interface
 */
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "pink" | "teal";

/**
 * Tailles de police disponibles pour l'accessibilité
 */
type FontSize = "small" | "normal" | "large" | "extra-large";

/**
 * Interface du contexte de thème avec toutes les options de personnalisation
 */
interface ThemeContextType {
  theme: Theme;
  font: Font;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
  setTheme: (theme: Theme) => void;
  setFont: (font: Font) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setFontSize: (fontSize: FontSize) => void;
  setHighContrast: (highContrast: boolean) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Fournisseur de contexte de thème avec gestion des préférences utilisateur
 * Synchronise automatiquement avec la base de données pour les utilisateurs connectés
 * Utilise le localStorage pour les utilisateurs non connectés
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Initialisation avec des valeurs par défaut optimisées pour l'expérience utilisateur
  const [theme, setThemeState] = useState<Theme>("light"); // Thème clair par défaut
  const [font, setFontState] = useState<Font>("default");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [highContrast, setHighContrastState] = useState(false);
  const [reduceMotion, setReduceMotionState] = useState(false);

  // Écoute des changements d'authentification pour synchroniser les préférences
  useEffect(() => {
    /**
     * Récupération de l'utilisateur initial au chargement de l'application
     */
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur initial:', error);
        setCurrentUserId(null);
      }
    };

    getInitialUser();

    // Abonnement aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Chargement des préférences utilisateur depuis la base de données ou localStorage
  useEffect(() => {
    /**
     * Chargement des préférences d'affichage utilisateur
     * Priorité : Base de données > localStorage > Valeurs par défaut
     */
    const loadUserPreferences = async () => {
      if (!currentUserId) {
        // Chargement depuis localStorage pour les utilisateurs non connectés
        const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
        const savedFont = (localStorage.getItem("font") as Font) || "default";
        const savedColorScheme = (localStorage.getItem("colorScheme") as ColorScheme) || "default";
        const savedFontSize = (localStorage.getItem("fontSize") as FontSize) || "normal";
        const savedHighContrast = localStorage.getItem("highContrast") === "true";
        const savedReduceMotion = localStorage.getItem("reduceMotion") === "true";
        
        setThemeState(savedTheme);
        setFontState(savedFont);
        setColorSchemeState(savedColorScheme);
        setFontSizeState(savedFontSize);
        setHighContrastState(savedHighContrast);
        setReduceMotionState(savedReduceMotion);
        
        setLoading(false);
        return;
      }

      try {
        // Récupération des préférences depuis la base de données
        const { data, error } = await supabase
          .from('user_display_preferences')
          .select('*')
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors du chargement des préférences d\'affichage:', error);
          setLoading(false);
          return;
        }

        if (data) {
          // Application des préférences sauvegardées
          setThemeState((data.theme as Theme) || "light");
          setFontState((data.font_family as Font) || "default");
          setColorSchemeState((data.color_scheme as ColorScheme) || "default");
          setFontSizeState((data.font_size as FontSize) || "normal");
          setHighContrastState(data.high_contrast || false);
          setReduceMotionState(data.reduce_motion || false);
        } else {
          // Création d'entrée par défaut si aucune préférence n'existe
          await supabase
            .from('user_display_preferences')
            .insert({
              user_id: currentUserId,
              theme: 'light',
              font_family: 'default',
              color_scheme: 'default',
              font_size: 'normal',
              high_contrast: false,
              reduce_motion: false
            });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences d\'affichage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
  }, [currentUserId]);

  /**
   * Sauvegarde des préférences utilisateur
   * Base de données pour utilisateurs connectés, localStorage sinon
   */
  const savePreferences = async (updates: any) => {
    if (!currentUserId) {
      // Sauvegarde en localStorage pour les utilisateurs non connectés
      Object.keys(updates).forEach(key => {
        localStorage.setItem(key, updates[key]?.toString() || '');
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_display_preferences')
        .upsert({
          user_id: currentUserId,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde des préférences d\'affichage:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences d\'affichage:', error);
    }
  };

  // Application dynamique du thème sur l'élément racine
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      // Détection automatique du thème système
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Application dynamique de la police
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("font-sans", "font-serif", "font-mono");

    switch (font) {
      case "serif":
        root.classList.add("font-serif");
        break;
      case "mono":
        root.classList.add("font-mono");
        break;
      default:
        root.classList.add("font-sans");
        break;
    }
  }, [font]);

  // Application dynamique du schéma de couleurs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove(
      "color-default", "color-blue", "color-green", "color-purple", 
      "color-orange", "color-red", "color-indigo", "color-pink", "color-teal"
    );
    root.classList.add(`color-${colorScheme}`);
  }, [colorScheme]);

  // Application dynamique de la taille de police
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("text-small", "text-normal", "text-large", "text-extra-large");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Application des options d'accessibilité
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [highContrast, reduceMotion]);

  // Écoute des changements de thème système
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Fonctions de mise à jour des préférences avec sauvegarde automatique
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    savePreferences({ theme: newTheme });
  };

  const setFont = (newFont: Font) => {
    setFontState(newFont);
    savePreferences({ font_family: newFont });
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
    savePreferences({ color_scheme: newColorScheme });
  };

  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    savePreferences({ font_size: newFontSize });
  };

  const setHighContrast = (newHighContrast: boolean) => {
    setHighContrastState(newHighContrast);
    savePreferences({ high_contrast: newHighContrast });
  };

  const setReduceMotion = (newReduceMotion: boolean) => {
    setReduceMotionState(newReduceMotion);
    savePreferences({ reduce_motion: newReduceMotion });
  };

  return (
    <ThemeContext.Provider
      value={{ 
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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder au contexte de thème
 * Vérifie que le composant est bien dans un ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
