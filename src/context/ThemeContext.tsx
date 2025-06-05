
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark" | "system";
type Font = "default" | "serif" | "mono";
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "pink" | "teal";
type FontSize = "small" | "normal" | "large" | "extra-large";

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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authContext = useAuth();
  const user = authContext?.user; // Safe access to user
  const [loading, setLoading] = useState(true);
  
  // Initialize with default values
  const [theme, setThemeState] = useState<Theme>("light");
  const [font, setFontState] = useState<Font>("default");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [highContrast, setHighContrastState] = useState(false);
  const [reduceMotion, setReduceMotionState] = useState(false);

  // Load user preferences from database
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) {
        // Load from localStorage for unauthenticated users
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedFont = localStorage.getItem("font") as Font;
        const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;
        const savedFontSize = localStorage.getItem("fontSize") as FontSize;
        const savedHighContrast = localStorage.getItem("highContrast") === "true";
        const savedReduceMotion = localStorage.getItem("reduceMotion") === "true";
        
        if (savedTheme) setThemeState(savedTheme);
        if (savedFont) setFontState(savedFont);
        if (savedColorScheme) setColorSchemeState(savedColorScheme);
        if (savedFontSize) setFontSizeState(savedFontSize);
        setHighContrastState(savedHighContrast);
        setReduceMotionState(savedReduceMotion);
        
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_display_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading display preferences:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setThemeState(data.theme as Theme);
          setFontState(data.font_family as Font);
          setColorSchemeState(data.color_scheme as ColorScheme);
          setFontSizeState(data.font_size as FontSize);
          setHighContrastState(data.high_contrast);
          setReduceMotionState(data.reduce_motion);
        }
      } catch (error) {
        console.error('Error loading display preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
  }, [user]);

  // Save preferences to database
  const savePreferences = async (updates: any) => {
    if (!user) {
      // Save to localStorage for unauthenticated users
      Object.keys(updates).forEach(key => {
        localStorage.setItem(key, updates[key]?.toString() || '');
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_display_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving display preferences:', error);
      }
    } catch (error) {
      console.error('Error saving display preferences:', error);
    }
  };

  // Apply theme effects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply font effects
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

  // Apply color scheme effects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove(
      "color-default", "color-blue", "color-green", "color-purple", 
      "color-orange", "color-red", "color-indigo", "color-pink", "color-teal"
    );
    root.classList.add(`color-${colorScheme}`);
  }, [colorScheme]);

  // Apply font size effects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("text-small", "text-normal", "text-large", "text-extra-large");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Apply accessibility effects
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

  // Listen for system theme changes
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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
