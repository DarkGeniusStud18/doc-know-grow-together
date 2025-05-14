
import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = "light" | "dark";
type FontFamily = "sans" | "serif" | "mono";
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  reducedMotion: boolean;
  setReducedMotion: (reducedMotion: boolean) => void;
  highContrast: boolean;
  setHighContrast: (highContrast: boolean) => void;
  largeText: boolean;
  setLargeText: (largeText: boolean) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
  fontFamily: "sans",
  setFontFamily: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  largeText: false,
  setLargeText: () => {},
  colorScheme: "default",
  setColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Update the ThemeProvider component to disable dark mode
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light"; // Default to light theme
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const savedFont = localStorage.getItem("font-family") as FontFamily;
    return savedFont || "sans";
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem("reduced-motion") === "true";
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("high-contrast") === "true";
  });

  const [largeText, setLargeText] = useState<boolean>(() => {
    return localStorage.getItem("large-text") === "true";
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const savedColorScheme = localStorage.getItem("color-scheme") as ColorScheme;
    return savedColorScheme || "default";
  });

  // Comment out dark theme application
  useEffect(() => {
    /*
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    */
    
    // Always use light theme for now
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    
    localStorage.setItem("font-family", fontFamily);
    document.documentElement.classList.remove("font-sans", "font-serif", "font-mono");
    document.documentElement.classList.add(`font-${fontFamily}`);
    
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
      localStorage.setItem("reduced-motion", "true");
    } else {
      document.documentElement.classList.remove("reduced-motion");
      localStorage.setItem("reduced-motion", "false");
    }
    
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("high-contrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("high-contrast", "false");
    }
    
    if (largeText) {
      document.documentElement.classList.add("large-text");
      localStorage.setItem("large-text", "true");
    } else {
      document.documentElement.classList.remove("large-text");
      localStorage.setItem("large-text", "false");
    }
    
    document.documentElement.classList.remove("color-blue", "color-green", "color-purple", "color-orange");
    if (colorScheme !== "default") {
      document.documentElement.classList.add(`color-${colorScheme}`);
    }
    localStorage.setItem("color-scheme", colorScheme);
  }, [theme, fontFamily, reducedMotion, highContrast, largeText, colorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        colorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
