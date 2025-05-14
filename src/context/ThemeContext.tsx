/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";
type Font = "default" | "serif" | "mono";
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange";

interface ThemeContextType {
  theme: Theme;
  font: Font;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setFont: (font: Font) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light"; // Changed default to light
  });

  const [font, setFontState] = useState<Font>(() => {
    const savedFont = localStorage.getItem("font") as Font;
    return savedFont || "default";
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;
    return savedColorScheme || "default";
  });

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");

    // Apply selected theme or system preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply font when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all font classes
    root.classList.remove("font-sans", "font-serif", "font-mono");

    // Apply selected font
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

    localStorage.setItem("font", font);
  }, [font]);

  // Apply color scheme when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all color scheme classes
    root.classList.remove(
      "color-default",
      "color-blue",
      "color-green",
      "color-purple",
      "color-orange"
    );

    // Apply selected color scheme
    root.classList.add(`color-${colorScheme}`);

    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

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
  };

  const setFont = (newFont: Font) => {
    setFontState(newFont);
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, font, colorScheme, setTheme, setFont, setColorScheme }}
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
