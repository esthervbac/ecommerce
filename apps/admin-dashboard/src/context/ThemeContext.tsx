"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = authService.getTheme();
    const isDarkMode = saved === "dark";
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "light" : "dark";
    setIsDark(!isDark);
    authService.setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  return context;
};
