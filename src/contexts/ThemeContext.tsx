import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  DefaultTheme,
} from "styled-components";
import {
  lightTheme,
  darkTheme,
  lightPastelTheme,
  darkPastelTheme,
  devTheme,
} from "../styles/themes";

type ThemeContextType = {
  theme: number;
  toggleTheme: (newTheme: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<number>(0);

  const toggleTheme = (newTheme: number) => {
    setTheme(newTheme);
  };

  const themeMode: DefaultTheme =
    theme === 0
      ? darkTheme
      : theme === 1
        ? lightTheme
        : theme === 2
          ? lightPastelTheme
          : theme === 3
            ? darkPastelTheme
            : theme === 4
              ? devTheme
              : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={themeMode}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeProvider, useTheme };
