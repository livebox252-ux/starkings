import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "light";
export type AccentColor = "gold" | "blue" | "red" | "green" | "purple";
export type PosterStyle = "portrait" | "landscape";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  posterStyle: PosterStyle;
  setPosterStyle: (style: PosterStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem("theme") as Theme) || "dark"
  );
  
  const [accent, setAccent] = useState<AccentColor>(() => 
    (localStorage.getItem("accent") as AccentColor) || "gold"
  );

  const [posterStyle, setPosterStyle] = useState<PosterStyle>(() => 
    (localStorage.getItem("posterStyle") as PosterStyle) || "portrait"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-gold", "theme-blue", "theme-red", "theme-green", "theme-purple");
    root.classList.add(`theme-${accent}`);
    localStorage.setItem("accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("posterStyle", posterStyle);
  }, [posterStyle]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, posterStyle, setPosterStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
